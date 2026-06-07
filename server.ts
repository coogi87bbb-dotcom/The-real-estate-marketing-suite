import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Define schema types inline to avoid ESM relative resolver compilation errors in bundle
export enum UserRole {
  SYS_ADMIN = "System Admin",
  BROKER_OWNER = "Broker Owner",
  AGENT = "Individual Agent",
  MORTGAGE_PARTNER = "Mortgage Partner"
}

export enum LeadStage {
  NEW = "New",
  AI_NURTURING = "AI Nurturing",
  QUALIFIED = "Qualified",
  MORTGAGE_REVIEW = "Mortgage Review",
  SCHEDULED = "Scheduled",
  HANDED_OFF = "Handed Off"
}

export enum BillingStatus {
  ACTIVE = "Active",
  DELINQUENT = "Delinquent"
}

// Lazy-loaded Gemini Client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
  }
  return aiInstance;
}

// Initial Core Mock Data (Minimum 30 Leads across varying stages and isolation)
const INITIAL_TENANTS = [
  {
    id: "tenant-perryman",
    name: "Perryman's Luxury Realty (Texas)",
    subscription_tier: "Enterprise Brokerage",
    billing_status: BillingStatus.ACTIVE,
    tech_fee_balance: 1420.50,
    active_campaigns_count: 5,
    ad_spend_budget: 12500
  },
  {
    id: "tenant-cascade",
    name: "Cascade Realty Seattle",
    subscription_tier: "Pro Team",
    billing_status: BillingStatus.ACTIVE,
    tech_fee_balance: 420.00,
    active_campaigns_count: 2,
    ad_spend_budget: 4500
  },
  {
    id: "tenant-delinquent",
    name: "Pinnacle Listings Miami",
    subscription_tier: "Enterprise Brokerage",
    billing_status: BillingStatus.DELINQUENT,
    tech_fee_balance: 850.00,
    active_campaigns_count: 0,
    ad_spend_budget: 0
  },
  {
    id: "tenant-solo",
    name: "Maverick Solo Brokerage",
    subscription_tier: "Starter",
    billing_status: BillingStatus.ACTIVE,
    tech_fee_balance: 89.00,
    active_campaigns_count: 1,
    ad_spend_budget: 1500
  }
];

const INITIAL_MORTGAGE_PARTNERS = [
  { tenant_id: "tenant-perryman", name: "David Miller, MLO", email: "david.miller@apexhomeloans.com", phone: "(512) 555-0144", status: "Active" },
  { tenant_id: "tenant-cascade", name: "Sarah Jenkins, senior MLO", email: "s.jenkins@seattlemortgage.com", phone: "(206) 555-0199", status: "Active" }
];

const INITIAL_PHONE_NODES = [
  { id: "node-1", tenant_id: "tenant-perryman", label: "Austin Sign Code QR", phone_number: "+1(512) 601-5259", voice_persona: "Kore (Friendly Texan)", greeting_script: "Thanks for scanning! This is Perryman's automated assistant live from our Austin list. Are you looking to buy, sell, or rent this home?", fallback_routing: "+1(512) 555-9011", calls_count: 42 },
  { id: "node-2", tenant_id: "tenant-perryman", label: "West Lake Hills Flyer", phone_number: "+1(512) 601-3342", voice_persona: "Zephyr (Modern Technical)", greeting_script: "Hello! Thank you for calling Perryman's. I am Nexus-AI. Let me quickly help details or connect you with premium finance team.", fallback_routing: "+1(512) 555-9012", calls_count: 18 },
  { id: "node-3", tenant_id: "tenant-cascade", label: "Seattle Yard QR", phone_number: "+1(206) 402-9112", voice_persona: "Puck (Energetic Creator)", greeting_script: "Hi, this is Cascade Realty's Voice Receptionist. Tell me details about your budget to fast-track your viewing slot!", fallback_routing: "+1(206) 555-3211", calls_count: 29 }
];

const INITIAL_PAST_CLIENTS = [
  { id: "past-1", tenant_id: "tenant-perryman", name: "Robert & Lisa Chen", address: "812 West Ave, Austin, TX 78701", latitude: 30.2721, longitude: -97.7475, close_date: "2019-04-12", purchase_price: 680000, estimated_equity: 345000, moving_probability: 94, last_contacted: "2025-11-20" },
  { id: "past-2", tenant_id: "tenant-perryman", name: "Marcus Thompson", address: "1402 Westover Rd, Austin, TX 78703", latitude: 30.3012, longitude: -97.7588, close_date: "2020-07-22", purchase_price: 1250000, estimated_equity: 540000, moving_probability: 88, last_contacted: "2026-01-10" },
  { id: "past-3", tenant_id: "tenant-perryman", name: "The Harrison Family", address: "3502 River Rd, Austin, TX 78703", latitude: 30.3045, longitude: -97.7812, close_date: "2018-02-15", purchase_price: 1950000, estimated_equity: 870000, moving_probability: 79, last_contacted: "2025-10-05" },
  { id: "past-4", tenant_id: "tenant-perryman", name: "Amelia Rodriguez", address: "2217 East 7th St, Austin, TX 78702", latitude: 30.2635, longitude: -97.7168, close_date: "2021-09-08", purchase_price: 450000, estimated_equity: 125000, moving_probability: 72, last_contacted: "2026-03-01" },
  { id: "past-5", tenant_id: "tenant-perryman", name: "William Vance", address: "1205 Rio Grande St, Austin, TX 78701", latitude: 30.2764, longitude: -97.7461, close_date: "2015-11-30", purchase_price: 520000, estimated_equity: 410000, moving_probability: 91, last_contacted: "2025-08-14" },
  { id: "past-6", tenant_id: "tenant-cascade", name: "Douglas McArthur", address: "4722 Lake Washington Blvd, Seattle, WA 98118", latitude: 47.5582, longitude: -122.2592, close_date: "2019-10-18", purchase_price: 1350000, estimated_equity: 490000, moving_probability: 85, last_contacted: "2025-12-05" },
  { id: "past-7", tenant_id: "tenant-cascade", name: "Chloe Vance", address: "1912 E Denny Way, Seattle, WA 98122", latitude: 47.6185, longitude: -122.3072, close_date: "2021-05-14", purchase_price: 890000, estimated_equity: 210000, moving_probability: 68, last_contacted: "2026-02-18" }
];

const INITIAL_LEADS = [
  // New Leads
  { id: "lead-1", tenant_id: "tenant-perryman", name: "Alexandra Thorne", email: "a.thorne@gmail.com", phone: "(512) 555-0101", stage: LeadStage.NEW, income: 145000, credit_score: 720, property_preferences: "3B/2B Central Austin near Town Lake, budget $850k", listing_interest: "905 West Ave, Austin, TX", compliance_status: "Active", last_interaction_time: "2026-06-07T14:30:00Z" },
  { id: "lead-2", tenant_id: "tenant-perryman", name: "David Vance", email: "d.vance@techmail.io", phone: "(512) 555-0102", stage: LeadStage.NEW, income: 198000, credit_score: 740, property_preferences: "Luxury high-rise condo downtown, budget $1.2M", listing_interest: "The Independent, 10th Floor", compliance_status: "Active", last_interaction_time: "2026-06-07T12:15:00Z" },
  { id: "lead-3", tenant_id: "tenant-perryman", name: "Maria Serna", email: "maria.serna@designcorp.com", phone: "(512) 555-0103", stage: LeadStage.NEW, income: 93000, credit_score: 690, property_preferences: "Modern townhome in Austin East side, budget $550k", listing_interest: "Modernist East Units", compliance_status: "Active", last_interaction_time: "2026-06-07T15:22:00Z" },
  { id: "lead-4", tenant_id: "tenant-perryman", name: "Richard Chen", email: "r.chen@capitalinvest.com", phone: "(512) 555-0104", stage: LeadStage.NEW, income: 280000, credit_score: 810, property_preferences: "Invesment duplex in Austin central", listing_interest: "North University Duplex", compliance_status: "Active", last_interaction_time: "2026-06-06T09:44:00Z" },
  { id: "lead-5", tenant_id: "tenant-cascade", name: "Kari Nordstrom", email: "knord@nordstrom.net", phone: "(206) 555-0105", stage: LeadStage.NEW, income: 165000, credit_score: 710, property_preferences: "Capitol Hill bungalow with charm, budget $950k", listing_interest: "1815 E Mercer St", compliance_status: "Active", last_interaction_time: "2026-06-07T16:00:00Z" },

  // AI Nurturing Leads
  { id: "lead-6", tenant_id: "tenant-perryman", name: "Theresa Vance", email: "t.vance@education.org", phone: "(512) 555-0106", stage: LeadStage.AI_NURTURING, income: 110000, credit_score: 650, property_preferences: "Family home in Round Rock ISD, budget $450k", listing_interest: "105 Avery Ranch Cove", compliance_status: "Active", last_interaction_time: "2026-06-07T13:40:00Z" },
  { id: "lead-7", tenant_id: "tenant-perryman", name: "Gregory Peck", email: "greg@peckcreative.com", phone: "(512) 555-0107", stage: LeadStage.AI_NURTURING, income: 135000, credit_score: 720, property_preferences: "Classic Mid-century in South Austin, budget $750k", listing_interest: "Bouldin Creek classic bungalow", compliance_status: "Active", last_interaction_time: "2026-06-07T11:05:00Z" },
  { id: "lead-8", tenant_id: "tenant-perryman", name: "Samantha Knowles", email: "sknowles@mediaspace.com", phone: "(512) 555-0108", stage: LeadStage.AI_NURTURING, income: 125000, credit_score: 680, property_preferences: "Chic condo in North Loop near coffee shops", listing_interest: "The Griffin Lofts", compliance_status: "Active", last_interaction_time: "2026-06-07T10:10:00Z" },
  { id: "lead-9", tenant_id: "tenant-perryman", name: "Jeremy Irons", email: "jirons@prosteel.com", phone: "(512) 555-0109", stage: LeadStage.AI_NURTURING, income: 185000, credit_score: 745, property_preferences: "Acreage property in Hill Country, Austin west", listing_interest: "14 Lone Star Circle, Dripping Springs", compliance_status: "Active", last_interaction_time: "2026-06-07T15:10:00Z" },
  { id: "lead-10", tenant_id: "tenant-perryman", name: "Linda Blair", email: "lblair@hauntpro.com", phone: "(512) 555-0110", stage: LeadStage.AI_NURTURING, income: 82000, credit_score: 610, property_preferences: "Fixer upper / estate sale with potential", listing_interest: "602 East 31st St", compliance_status: "Active", last_interaction_time: "2026-06-06T15:30:00Z" },
  { id: "lead-11", tenant_id: "tenant-cascade", name: "Hiroto Tanaka", email: "htanaka@seattle-sys.co.jp", phone: "(206) 555-0111", stage: LeadStage.AI_NURTURING, income: 240000, credit_score: 790, property_preferences: "Modern Bellevue architectural, budget $2.4M", listing_interest: "Bellevue Lakeview Estates", compliance_status: "Active", last_interaction_time: "2026-06-07T12:00:00Z" },

  // Qualified Leads
  { id: "lead-12", tenant_id: "tenant-perryman", name: "Christian Bale", email: "cbale@gothaminvest.net", phone: "(512) 555-0112", stage: LeadStage.QUALIFIED, income: 350000, credit_score: 820, property_preferences: "Penthouse / luxury lakefront, budget $3.5M", listing_interest: "Lake Austin Waterfront Sanctuary", compliance_status: "Active", last_interaction_time: "2026-06-07T16:15:00Z" },
  { id: "lead-13", tenant_id: "tenant-perryman", name: "Nora Ephron", email: "nora@writertable.org", phone: "(512) 555-0113", stage: LeadStage.QUALIFIED, income: 160000, credit_score: 780, property_preferences: "Craftsman style home with big yard & tree canopy", listing_interest: "Travis Heights Craftsman", compliance_status: "Active", last_interaction_time: "2026-06-07T09:30:00Z" },
  { id: "lead-14", tenant_id: "tenant-perryman", name: "Bradley Cooper", email: "bcoop@hollywoodeast.com", phone: "(512) 555-0114", stage: LeadStage.QUALIFIED, income: 220000, credit_score: 710, property_preferences: "Contemporary modern on Cliffside, budget $1.8M", listing_interest: "Mount Bonnell Ridge Retreat", compliance_status: "Active", last_interaction_time: "2026-06-06T18:20:00Z" },
  { id: "lead-15", tenant_id: "tenant-perryman", name: "Danielle Radcliffe", email: "drac@wizardcapital.co.uk", phone: "(512) 555-0115", stage: LeadStage.QUALIFIED, income: 175000, credit_score: 755, property_preferences: "Historical stone house near campus area", listing_interest: "Heritage Austin Manor", compliance_status: "Active", last_interaction_time: "2026-06-06T14:40:00Z" },
  { id: "lead-16", tenant_id: "tenant-cascade", name: "Fiona Gallagher", email: "fiona.g@southsideloft.com", phone: "(206) 555-0116", stage: LeadStage.QUALIFIED, income: 125000, credit_score: 715, property_preferences: "Queen Anne duplex with sound view", listing_interest: "125 West Highland Dr", compliance_status: "Active", last_interaction_time: "2026-06-07T14:10:00Z" },

  // Mortgage Review Leads
  { id: "lead-17", tenant_id: "tenant-perryman", name: "Oscar Isaac", email: "oscar@duneacademy.org", phone: "(512) 555-0117", stage: LeadStage.MORTGAGE_REVIEW, income: 180000, credit_score: 690, property_preferences: "Mid-century ranch, budget $800k in West Rim", listing_interest: "3302 West Rim Blvd", compliance_status: "Active", last_interaction_time: "2026-06-07T13:10:00Z" },
  { id: "lead-18", tenant_id: "tenant-perryman", name: "Emma Watson", email: "ewatson@unenvoy.org", phone: "(512) 555-0118", stage: LeadStage.MORTGAGE_REVIEW, income: 210000, credit_score: 730, property_preferences: "Eco-friendly passive house certified", listing_interest: "Mueller Green Build Block 4", compliance_status: "Active", last_interaction_time: "2026-06-07T15:55:00Z" },
  { id: "lead-19", tenant_id: "tenant-perryman", name: "Denzel Washington", email: "equalizer@justice.net", phone: "(512) 555-0119", stage: LeadStage.MORTGAGE_REVIEW, income: 300000, credit_score: 805, property_preferences: "Secure compound, gated, budget $2.8M", listing_interest: "Barton Creek Estate #4", compliance_status: "Active", last_interaction_time: "2026-06-07T10:45:00Z" },
  { id: "lead-20", tenant_id: "tenant-perryman", name: "Meryl Streep", email: "meryl@editorialqueen.new", phone: "(512) 555-0120", stage: LeadStage.MORTGAGE_REVIEW, income: 450000, credit_score: 840, property_preferences: "Elegant estate with gorgeous library and gardens", listing_interest: "Rob Roy Garden Manor", compliance_status: "Active", last_interaction_time: "2026-06-05T11:20:00Z" },
  { id: "lead-21", tenant_id: "tenant-cascade", name: "Benedict Cumberbatch", email: "sherlock@221bbaker.co.uk", phone: "(206) 555-0121", stage: LeadStage.MORTGAGE_REVIEW, income: 290000, credit_score: 760, property_preferences: "Fremont industrial loft space with high brick arches", listing_interest: "Fremont Foundry Studios, Penthouse B", compliance_status: "Active", last_interaction_time: "2026-06-07T11:15:00Z" },

  // Scheduled Leads
  { id: "lead-22", tenant_id: "tenant-perryman", name: "Keanu Reeves", email: "matrix@neo-con.net", phone: "(512) 555-0122", stage: LeadStage.SCHEDULED, income: 260000, credit_score: 780, property_preferences: "Minimalist concrete architectural loft with security", listing_interest: "Zilker Park Contemporary concrete home", compliance_status: "Active", last_interaction_time: "2026-06-07T16:30:00Z" },
  { id: "lead-23", tenant_id: "tenant-perryman", name: "Margot Robbie", email: "barbie@worldrealty.pink", phone: "(512) 555-0123", stage: LeadStage.SCHEDULED, income: 410000, credit_score: 795, property_preferences: "Bright retro-modern estate with pool & neon vibes", listing_interest: "Pecan Springs Pink Villa", compliance_status: "Active", last_interaction_time: "2026-06-07T13:00:00Z" },
  { id: "lead-24", tenant_id: "tenant-perryman", name: "Ryan Gosling", email: "gosling@driver.net", phone: "(512) 555-0124", stage: LeadStage.SCHEDULED, income: 155000, credit_score: 740, property_preferences: "Quiet midsize modern cabin with large garage bay", listing_interest: "Barton Hills Hideaway", compliance_status: "Active", last_interaction_time: "2026-06-06T15:20:00Z" },
  { id: "lead-25", tenant_id: "tenant-perryman", name: "Natalie Portman", email: "natalie@postgrad.harvard.edu", phone: "(512) 555-0125", stage: LeadStage.SCHEDULED, income: 235000, credit_score: 810, property_preferences: "Restored Victorian historical home", listing_interest: "Hyde Park Queen Anne", compliance_status: "Active", last_interaction_time: "2026-06-05T14:15:00Z" },
  { id: "lead-26", tenant_id: "tenant-cascade", name: "Tom Hanks", email: "thanks@islandcastaway.com", phone: "(206) 555-0126", stage: LeadStage.SCHEDULED, income: 380000, credit_score: 830, property_preferences: "Mercer Island waterfront, boat slip critical", listing_interest: "Mercer Island West Shoreline", compliance_status: "Active", last_interaction_time: "2026-06-07T09:12:00Z" },

  // Handed Off Leads
  { id: "lead-27", tenant_id: "tenant-perryman", name: "Brad Pitt", email: "brad@theplanb.com", phone: "(512) 555-0127", stage: LeadStage.HANDED_OFF, income: 310000, credit_score: 770, property_preferences: "Frank Lloyd Wright inspired architecture only", listing_interest: "Lost Creek Organic Prairie Mansion", compliance_status: "Active", last_interaction_time: "2026-06-07T14:50:00Z" },
  { id: "lead-28", tenant_id: "tenant-perryman", name: "Jennifer Aniston", email: "jen@friendsreunion.com", phone: "(512) 555-0128", stage: LeadStage.HANDED_OFF, income: 290000, credit_score: 765, property_preferences: "Gated estate with high privacy hedges and guest cottage", listing_interest: "West Lake Hills Hideaway", compliance_status: "Active", last_interaction_time: "2026-06-06T10:11:00Z" },
  { id: "lead-29", tenant_id: "tenant-perryman", name: "Leonardo DiCaprio", email: "leo@ecoground.org", phone: "(512) 555-0129", stage: LeadStage.HANDED_OFF, income: 500000, credit_score: 815, property_preferences: "Strictly solar-powered compound, zero carbon footprints", listing_interest: "Zilker Eco-Compound #1", compliance_status: "Active", last_interaction_time: "2026-06-05T17:15:00Z" },
  { id: "lead-30", tenant_id: "tenant-cascade", name: "Steve McQueen", email: "smcqueen@bullitt.org", phone: "(206) 555-0130", stage: LeadStage.HANDED_OFF, income: 180000, credit_score: 720, property_preferences: "Mid-century with massive multi-car exhibition workshop", listing_interest: "Ballard Automotive Loft", compliance_status: "Active", last_interaction_time: "2026-06-06T11:05:00Z" }
];

const INITIAL_CHAT_LOGS = [
  { id: "chat-1", lead_id: "lead-6", sender: "ai", message: "Hi Theresa! I was scanning the Round Rock schools index. The local properties in Avery Ranch are right next to the top-rated elementary! What is your maximum budget for the home?", timestamp: "2026-06-07T13:30:00Z", channel_visibility: "all" },
  { id: "chat-2", lead_id: "lead-6", sender: "lead", message: "That is perfect! Our maximum budget is around $450k. My husband makes about $110,000/yr and we have decent credit.", timestamp: "2026-06-07T13:31:00Z", channel_visibility: "all" },
  { id: "chat-3", lead_id: "lead-6", sender: "ai", message: "Amazing. With an income of $110k, a $450k home matches your financial metrics beautifully. Let me invite David Miller, our mortgage partner to fast-track your pre-approval letter so we are ready to offer!", timestamp: "2026-06-07T13:33:00Z", channel_visibility: "all" },

  // Lead 17 Chat logs (co-pilot triggers)
  { id: "chat-4", lead_id: "lead-17", sender: "ai", message: "Hello Oscar! I am tracking the West Rim Ranch. Let's look at your buying profile. Could you share your approximate annual income and credit score range?", timestamp: "2026-06-07T13:00:00Z", channel_visibility: "all" },
  { id: "chat-5", lead_id: "lead-17", sender: "lead", message: "Sure, my annual income is around $180,000 and my credit score is around 690.", timestamp: "2026-06-07T13:02:00Z", channel_visibility: "all" },
  { id: "chat-6", lead_id: "lead-17", sender: "ai", message: "Excellent financial profile. Your income makes a West Rim home highly viable. I am pulling in David Miller, our Preferred Mortgage Partner, into this channel right now so he can evaluate custom financing packages for you. Our Broker Owner and Agent will also be updated in real-time.", timestamp: "2026-06-07T13:05:00Z", channel_visibility: "all" },
  { id: "chat-7", lead_id: "lead-17", sender: "mortgage", message: "Oscar! This is David. Looking at your metrics, we can do a 5/1 ARM or a 30-year fixed with only 10% down because of our partner priority. Let's schedule a call!", timestamp: "2026-06-07T13:08:00Z", channel_visibility: "all" }
];

const INITIAL_VIDEO_QUEUE = [
  { id: "vid-1", address: "14 Lone Star Circle, Dripping Springs, TX", status: "Price Dropped", progress: 100, status_text: "Completed", voiceover_script: "Unbelievable price drop in Dripping Springs! This spectacular 4-bedroom Hill Country homestead is now available for seventy-five thousand dollars below original listing. Act fast before it's gone!", duration_sec: 22, url: "https://images.unsplash.com/photo-1513694203232-719a280e022f" },
  { id: "vid-2", address: "Travis Heights Craftsman, Austin, TX", status: "Just Listed", progress: 100, status_text: "Completed", voiceover_script: "Just listed in highly coveted Travis Heights! Walk to South Congress from this perfectly restored historical-grade craftsman home featuring an automated chef kitchen and breathtaking live oaks.", duration_sec: 18, url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914" },
  { id: "vid-3", address: "905 West Ave, Austin, TX", status: "Price Dropped", progress: 45, status_text: "Kinetic Layering", voiceover_script: "Substantial price drop on West Ave! Experience sleek luxury Downtown Austin living with magnificent high ceilings and gorgeous private terraces. Contact Perryman's immediately.", duration_sec: 15 },
  { id: "vid-4", address: "Mueller Green Build Block 4", status: "Just Listed", progress: 0, status_text: "In Queue", voiceover_script: "", duration_sec: 20 }
];

const INITIAL_AD_CAMPAIGNS = [
  { id: "camp-1", tenant_id: "tenant-perryman", property_id: "MLS-90124", original_url: "https://mls.com/listing/travis-heights", headline: "Historic Travis Heights Bungalow with Modern Pool", ad_copy: "Uncompromising elegance in the heart of 78704! Perryman's presents this gorgeous 3-bedroom jewel. Perfect for modern living with highly rated schools nearby.", zipcodes: ["78704", "78701", "78703"], budget: 1500, tech_fee: 150, status: "Active" },
  { id: "camp-2", tenant_id: "tenant-perryman", property_id: "MLS-44512", original_url: "https://mls.com/listing/dripping-springs", headline: "Price Drop! Hill Country Oasis with 5 Acres", ad_copy: "Wake up to breathtaking morning vistas! Huge price reduction on this Dripping Springs compound. Bring your horses or build your detached duplex studio.", zipcodes: ["78620", "78738", "78735"], budget: 2000, tech_fee: 200, status: "Active" }
];


// System State Wrapper
let state = {
  tenants: INITIAL_TENANTS,
  leads: INITIAL_LEADS,
  chatLogs: INITIAL_CHAT_LOGS,
  videoQueue: INITIAL_VIDEO_QUEUE,
  phoneNodes: INITIAL_PHONE_NODES,
  pastClients: INITIAL_PAST_CLIENTS,
  campaigns: INITIAL_AD_CAMPAIGNS,
  mortgagePartners: INITIAL_MORTGAGE_PARTNERS
};

// Start Express App
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log API queries for visibility
  app.use((req, res, next) => {
    console.log(`[API REQUEST] ${req.method} ${req.url}`);
    next();
  });

  // REST endpoints for the operational application state
  app.get("/api/state", (req, res) => {
    res.json(state);
  });

  app.post("/api/tenant/update", (req, res) => {
    const { tenant_id, data } = req.body;
    const idx = state.tenants.findIndex(t => t.id === tenant_id);
    if (idx !== -1) {
      state.tenants[idx] = { ...state.tenants[idx], ...data };
      res.json({ success: true, tenant: state.tenants[idx] });
    } else {
      res.status(404).json({ error: "Tenant not found" });
    }
  });

  // Stripe Checkout Action Simulation (Delinquency Resolver)
  app.post("/api/stripe/checkout", (req, res) => {
    const { tenant_id, card_holder, plan } = req.body;
    const tenantIdx = state.tenants.findIndex(t => t.id === tenant_id);
    if (tenantIdx !== -1) {
      state.tenants[tenantIdx].billing_status = BillingStatus.ACTIVE;
      state.tenants[tenantIdx].subscription_tier = plan;
      res.json({ success: true, message: `Subscription Activated successfully via Stripe!`, tenant: state.tenants[tenantIdx] });
    } else {
      res.status(404).json({ error: "Tenant not found to activate subscription" });
    }
  });

  // Inbound Voice Node simulation settings saver
  app.post("/api/voice/save-node", (req, res) => {
    const { node_id, greeting_script, voice_persona, fallback_routing } = req.body;
    const item = state.phoneNodes.find(n => n.id === node_id);
    if (item) {
      item.greeting_script = greeting_script;
      item.voice_persona = voice_persona;
      item.fallback_routing = fallback_routing;
      res.json({ success: true, node: item });
    } else {
      res.status(404).json({ error: "Voice node not found" });
    }
  });

  // Generate Voice Node Track
  app.post("/api/voice/generate-node", (req, res) => {
    const { tenant_id, label } = req.body;
    const areaCode = tenant_id === "tenant-cascade" ? "206" : "512";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newNode = {
      id: "node-" + Date.now(),
      tenant_id,
      label: label || "New Sign Yard",
      phone_number: `+1(${areaCode}) 601-${randNum}`,
      voice_persona: "Kore (Friendly Texan)",
      greeting_script: "Welcome to Perryman's! I am the automated smart sign receptionist. Type or speak your query about this property.",
      fallback_routing: `+1(${areaCode}) 555-0100`,
      calls_count: 0
    };
    state.phoneNodes.push(newNode);
    res.json({ success: true, node: newNode });
  });

  // Co-Pilot Mortgage Invitations
  app.post("/api/mortgage/invite", (req, res) => {
    const { tenant_id, name, email, phone } = req.body;
    const newPartner = { tenant_id, name, email, phone, status: "Active" };
    state.mortgagePartners.push(newPartner);
    res.json({ success: true, partners: state.mortgagePartners.filter(p => p.tenant_id === tenant_id) });
  });

  // Update Lead qualification, notes, or assigned stage
  app.post("/api/leads/update-stage", (req, res) => {
    const { lead_id, stage } = req.body;
    const lead = state.leads.find(l => l.id === lead_id);
    if (lead) {
      lead.stage = stage as LeadStage;
      lead.last_interaction_time = new Date().toISOString();
      res.json({ success: true, lead });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // Add a live chat log & trigger immediate automated AI response (Low-Latency Response engine simulation)
  app.post("/api/leads/add-chat", async (req, res) => {
    const { lead_id, message, sender } = req.body;
    const lead = state.leads.find(l => l.id === lead_id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const leadMsg = {
      id: "chat-user-" + Date.now(),
      lead_id,
      sender: sender || "lead",
      message,
      timestamp: new Date().toISOString(),
      channel_visibility: "all" as const
    };
    state.chatLogs.push(leadMsg);

    // If the sender is 'lead', simulate an immediate low-latency automated AI nurture agent response
    if (sender === "lead" || !sender) {
      const ai = getGeminiClient();
      let responseText = "Thanks for your interesting metrics! Our Nexus-AI team will look closely and update you.";

      // Check if user has entered financial data, extract it
      const financialMatch = message.match(/(income|earn|salary|make|credit|score|\$)/i);

      if (ai) {
        try {
          const geminiPrompt = `You are Nexus-AI, Perryman's elite co-pilot, designed with a world-class, billion-dollar sales pedigree. Your perspective comes from driving a billion in career real estate transactions by saving clients immense time and a lot of money. 
          The customer says: "${message}". 
          The customer profile is: Income $${lead.income}/yr, Credit score: ${lead.credit_score}, Interests: ${lead.property_preferences}. 
          Draft an ultra-confident, polished, and crisp response (maximum 3 sentences) that guides, qualifies, and builds massive trust. Show supreme expertise.
          If they supplied financial data, celebrate their premium credentials, and let them know both their dedicated luxury advisor and David Miller, our Preferred Mortgage Loan Officer partner, have been synced to this channel and notified to save them maximum time and cost.`;

          const result = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: geminiPrompt,
            config: {
              temperature: 0.7,
            },
          });
          responseText = result.text || responseText;
        } catch (err: any) {
          console.warn("[Gemini API call warning]: ", err.message);
          // Fallback response with beautiful intelligence
          if (financialMatch) {
            responseText = `Incredible credentials! As a world-class team with a billion dollars in successful sales, we recognize top-tier qualifications instantly. I have saved those metrics and invited our Preferred MLO partner, David Miller, to review optimized strategies to save you immense time and money. Let's secure this elite deal!`;
          } else {
            responseText = `Excellent choice. At Perryman's, we represent world-class listings. To save you substantial time and money, may I inquire about your preferred target budget, or should we introduce our senior mortgage partner, David Miller, to lock in an elite pre-approval rate?`;
          }
        }
      } else {
        // High fidelity fallback without Gemini API configured
        if (financialMatch) {
          responseText = `Incredible credentials! As a world-class team with a billion dollars in successful sales, we recognize top-tier qualifications instantly. I have saved those metrics and invited our Preferred MLO partner, David Miller, to review optimized strategies to save you immense time and money. Let's secure this elite deal!`;
        } else {
          responseText = `Excellent choice. At Perryman's, we represent world-class listings. To save you substantial time and money, may I inquire about your preferred target budget, or should we introduce our senior mortgage partner, David Miller, to lock in an elite pre-approval rate?`;
        }
      }

      // Check if message has financial data to update the lead's state (tri-party qualification capture)
      const incomeM = message.match(/(?:income|salary|make|earn|earning)\s*(?:is|of)?\s*\$?([0-9,]{4,7})/i);
      const creditM = message.match(/(?:credit|score|fico)\s*(?:is|of|around|at)?\s*([3-8][0-9]{2})/i);

      if (incomeM) {
        const amt = parseInt(incomeM[1].replace(/,/g, ""), 10);
        if (!isNaN(amt)) lead.income = amt;
      }
      if (creditM) {
        const sc = parseInt(creditM[1], 10);
        if (!isNaN(sc)) lead.credit_score = sc;
      }

      // Dynamic rule: If lead has income > 100k and credit > 650, automatically bump stage to MORTGAGE_REVIEW/QUALIFIED if currently NEW
      if (lead.income >= 100000 && lead.credit_score >= 650 && lead.stage === LeadStage.NEW) {
        lead.stage = LeadStage.QUALIFIED;
      }

      const aiMsg = {
        id: "chat-ai-" + Date.now(),
        lead_id,
        sender: "ai" as const,
        message: responseText,
        timestamp: new Date().toISOString(),
        channel_visibility: "all" as const
      };
      state.chatLogs.push(aiMsg);
      return res.json({ success: true, lead, messages: [leadMsg, aiMsg] });
    }

    res.json({ success: true, lead, messages: [leadMsg] });
  });

  // MODULE: Autonomous Localized Video Studio Automation
  app.post("/api/video/add-queue", (req, res) => {
    const { address, status } = req.body;
    const newItem = {
      id: "vid-" + Date.now(),
      address,
      status: (status || "Price Dropped") as "Price Dropped" | "Just Listed",
      progress: 0,
      status_text: "In Queue" as const,
      voiceover_script: "",
      duration_sec: 15
    };
    state.videoQueue.push(newItem);
    res.json({ success: true, item: newItem });
  });

  app.post("/api/video/simulate-process", async (req, res) => {
    const { video_id } = req.body;
    const item = state.videoQueue.find(v => v.id === video_id);
    if (!item) {
      return res.status(404).json({ error: "Queue item not found" });
    }

    // Dynamic Script Generation using Gemini (if available) or fine preset
    const ai = getGeminiClient();
    let script = `Elite buy signal! A massive status shift just went live at ${item.address}. Curated by Perryman's billion-dollar sales engine to save you immense time and money. Call now!`;

    if (ai) {
      try {
        const geminiPrompt = `You are the lead luxury media voiceover writer for Perryman's elite team—renowned world-class experts with a billion dollars in total portfolio sales. 
        Write a hyper-efficient, prestigious 15-second kinetic walkthrough voiceover script tailored to sell quickly. This automated rendering saves agents hours of time and sellers thousands in marketing fees.
        Property: ${item.address}. status: This property is now ${item.status}. 
        Deliver absolute confidence and value. Under 35 words. Only output the voiceover script itself.`;

        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: geminiPrompt,
          config: {
            temperature: 0.85,
          }
        });
        script = result.text?.replace(/["']/g, "") || script;
      } catch (err: any) {
        console.warn("[Gemini Script Fail]: ", err.message);
      }
    } else {
      if (item.status === "Price Dropped") {
        script = `Elite buy signal! A massive price correction just went live for ${item.address}. Curated by Perryman's billion-dollar sales engine to save you immense time and money. Call now!`;
      } else {
        script = `Just listed by Perryman's: ${item.address}. An architectural masterpiece representing world-class design, curated by a team with a billion in career sales to maximize your net equity.`;
      }
    }

    item.voiceover_script = script;
    item.progress = 100;
    item.status_text = "Completed";
    item.url = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";

    res.json({ success: true, item });
  });

  // MODULE: Ad Architect with Real-Time Gemini Copy Parsing
  app.post("/api/campaign/generate-architect", async (req, res) => {
    const { tenant_id, property_id, original_url, budget, details } = req.body;

    const budgetVal = Number(budget) || 1000;
    const techFee = Number((budgetVal * 0.10).toFixed(2)); // Strict 10% tech fee calculation

    // Update the tenant's tech fee balance
    const tenant = state.tenants.find(t => t.id === tenant_id);
    if (tenant) {
      tenant.tech_fee_balance += techFee;
      tenant.active_campaigns_count += 1;
      tenant.ad_spend_budget += budgetVal;
    }

    const ai = getGeminiClient();
    let headline = `Billion-Dollar Choice: Elite New Listing - ${property_id}`;
    let copyText = `Luxury residence introduced by Perryman's Apex Systems, curated by a team with a billion in career sales. Lock in high-converting buyer rates instantly to save critical time and money. 10% automation fee applies.`;
    let zipcodes = ["78701", "78703", "78704"];

    if (ai) {
      try {
        const geminiPrompt = `You are a world-class real estate marketing strategist with a personal history of a billion dollars in career sales, optimizing campaigns at Perryman’s. 
        Analyze this property: "${property_id} ${details || ''}". Live URL: "${original_url}". Budget allocated: $${budgetVal}.
        Draft a high-converting property ad optimized to save agents massive time and pull record-shattering local buyer leads to save a lot of money on acquisition costs.
        Return raw JSON matching this format:
        {
          "headline": "...",
          "ad_copy": "...",
          "suggested_zipcodes": ["...", "...", "..."]
        }`;

        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: geminiPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.8,
          }
        });

        const parsed = JSON.parse(result.text || "{}");
        headline = parsed.headline || headline;
        copyText = parsed.ad_copy || copyText;
        zipcodes = parsed.suggested_zipcodes || zipcodes;
      } catch (err: any) {
        console.warn("[Gemini Ad Architect Fail]: ", err.message);
      }
    } else {
      // High fidelity static backup generator matching MLS properties
      headline = `Billion-Dollar Standard: ${property_id} is Now Premier Live`;
      copyText = `A world-class luxury treasure has surfaced! Handled with the elite precision of Perryman's billion-dollar sales engine, saving you immense time and money. Premium finishes, pristine yard layouts, and unbeatable neighborhood equity await.`;
      zipcodes = property_id.includes("Seattle") ? ["98122", "98112", "98105"] : ["78703", "78704", "78731"];
    }

    const newCampaign = {
      id: "camp-" + Date.now(),
      tenant_id,
      property_id,
      original_url: original_url || "https://perrymansai.com/mls-preview",
      headline,
      ad_copy: copyText,
      zipcodes,
      budget: budgetVal,
      tech_fee: techFee,
      status: "Active" as const
    };

    state.campaigns.push(newCampaign);
    res.json({ success: true, campaign: newCampaign, tenant });
  });

  // MODULE: Real-Time Regulatory Shield Pre-Send Interceptor
  app.post("/api/compliance/intercept", async (req, res) => {
    const { ad_copy } = req.body;
    if (!ad_copy) {
      return res.json({ clean: true });
    }

    // Banned phrases checking (HUD Fair Housing & RESPA sensitive metrics)
    const bannedPatterns = [
      { pattern: /young\s+families/i, phrase: "young families", reason: "Familial status restriction (HUD prohibits indicating preference for/against families with children)" },
      { pattern: /mature\s+couples?/i, phrase: "mature couple", reason: "Age discrimination (violations of Fair Housing Act age preferences)" },
      { pattern: /christian\s+neighborhood/i, phrase: "christian neighborhood", reason: "Religious discrimination (prohibited preferences under Fair Housing guidelines)" },
      { pattern: /exclusive\s+gated\s+elite/i, phrase: "exclusive gated elite", reason: "Steering / Elitism racial indicators (RESPA / Fair Housing Steering concerns)" },
      { pattern: /no\s+section\s*8/i, phrase: "no section 8", reason: "Source of income discrimination (violates Fair Housing guidelines in many states)" },
      { pattern: /perfect\s+for\s+bachelors/i, phrase: "perfect for bachelors", reason: "Sex/marital status steering violation" },
      { pattern: /wealthy\s+only/i, phrase: "wealthy only", reason: "Source of income steering discrimination" }
    ];

    let matched = null;
    for (const b of bannedPatterns) {
      if (b.pattern.test(ad_copy)) {
        matched = b;
        break;
      }
    }

    if (matched) {
      const ai = getGeminiClient();
      let rewrite = ad_copy;

      if (ai) {
        try {
          const geminiPrompt = `You are a world-class regulatory protection advisor for Perryman's billion-dollar brokerage portfolio. You understand that error-free compliance safeguards resources, saving brokers and agents a massive amount of time and money while yielding top-shelf deals.
          The ad copy violated guidelines due to: "${matched.phrase}".
          Original source copy: "${ad_copy}".
          Deliver a legally flawless, HUD-compliant, RESPA-compliant, and highly persuasive translation of this copy. 
          Keep the elite tone, saving the listing while executing zero risk. Return ONLY the rewrite text.`;

          const result = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: geminiPrompt,
            config: {
              temperature: 0.5,
            }
          });
          rewrite = result.text?.trim() || rewrite;
        } catch (err: any) {
          console.warn("[Gemini Compliance Rewrite Fail]: ", err.message);
        }
      } else {
        // Simple static replacement
        rewrite = ad_copy
          .replace(/young\s+families/ig, "homebuyers of all sizes")
          .replace(/mature\s+couples?/ig, "people appreciate a tranquil lifestyle")
          .replace(/christian\s+neighborhood/ig, "welcoming inclusive neighborhood")
          .replace(/exclusive\s+gated\s+elite/ig, "secure community setting")
          .replace(/no\s+section\s*8/ig, "all qualified applicants welcome");
      }

      return res.json({
        clean: false,
        phrase: matched.phrase,
        reason: matched.reason,
        rewrite
      });
    }

    res.json({ clean: true });
  });

  // MODULE: Predictive Retention Engine check-in draft builder
  app.post("/api/retention/generate-draft", async (req, res) => {
    const { client_name, address, estimated_equity, years } = req.body;
    let draft = `Hi ${client_name}, this is Perryman's. We noticed local transaction records show your home at ${address} has accumulated nearly $${estimated_equity} in community equity. Under our localized moving timelines, this is a prime window to optimize your portfolio. Let's execute to save you massive time and maximize your money!`;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const geminiPrompt = `You are an elite, world-class private wealth advisor representing Perryman’s flagship Nexus-AI platform. With a billion dollars in successful transactions, you know exactly how to guide clients to save time and extract maximum potential from their assets.
        Write a warm, hyper-professional, high-level strategic check-in message to past client: "${client_name}" at ${address}.
        They have owned for ${years} years with $${estimated_equity} in current accrued neighborhood equity.
        Highlight that our predictive relocations indicate historic localized demand. Propose a short high-level check-in to see how they can leverage this peak cycle to save time and optimize their portfolio. Keep it incredibly crisp and elite. Do not output anything other than the text body copy, max 60 words.`;

        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: geminiPrompt,
          config: {
            temperature: 0.75,
          }
        });
        draft = result.text?.trim() || draft;
      } catch (err: any) {
        console.warn("[Gemini Retention Draft Fail]: ", err.message);
      }
    }

    res.json({ success: true, draft });
  });

  // MODULE: Autonomous Executive Autopilot Command Center
  app.post("/api/ai-command", async (req, res) => {
    const { command, tenant_id } = req.body;
    if (!command) {
      return res.status(400).json({ error: "No automation instructions provided." });
    }

    const tenant = state.tenants.find(t => t.id === tenant_id) || state.tenants[0];
    const ai = getGeminiClient();

    let resultJson = {
      action: "CHITCHAT",
      explanation: "Greetings! I am Perryman's Nexus-AI core autopilot, representing a legendary team with a billion dollars in career sales. Under my direction, we save you massive amounts of time and high sums of capital. Call on me to automate listings, pipelines, campaigns, or regulatory boards instantly.",
      payload: {} as any
    };

    if (ai) {
      try {
        const prompt = `You are Perryman's Nexus-AI Core—the ultimate, elite PropTech AI autonomous director, powered by a legacy of a billion dollars in closed transaction volume. Your core mission is to save users a tremendous amount of time and a massive amount of money by automating every operational funnel with absolute premier precision.
The user wants to control the entire enterprise platform through your high-level intelligence.
The current platform context has these active values:
- Tenants: ${JSON.stringify(state.tenants)}
- Current tenant ID: ${tenant.id}
- Available Lead Stages: "New", "AI Nurturing", "Qualified", "Mortgage Review", "Scheduled", "Handed Off"

Analyze the user's input/command carefully: "${command}".
Determine which operational state action the user wishes to execute to modify our system. Match to one of these:
1. "ADD_LEAD": Add a brand new real estate lead/buyer.
   Expected JSON payload: { name: string, email: string, phone: string, stage: string, income: number, credit_score: number, property_preferences: string, listing_interest: string }
2. "UPDATE_BILLING": Restructure tenant subscription tier or clear delinquency blocks.
   Expected JSON payload: { tenant_id: string, billing_status: "Active" | "Delinquent", subscription_tier: "Starter" | "Pro Team" | "Enterprise Brokerage" }
3. "ADD_CAMPAIGN": Generate an automated Meta ad campaign programmatically.
   Expected JSON payload: { property_id: string, original_url: string, headline: string, ad_copy: string, zipcodes: string[], budget: number }
4. "ADD_VIDEO": Push a kinetic localized walkthrough video into the automation queue.
   Expected JSON payload: { address: string, status: "Price Dropped" | "Just Listed", progress: number, status_text: string, voiceover_script: string, duration_sec: number }
5. "ADD_MORTGAGE_PARTNER": Add a preferred mortgage loan officer partner.
   Expected JSON payload: { name: string, email: string, phone: string }
6. "UPDATE_PHONE_RECEPS": Modify or add an inbound tracking node.
   Expected JSON payload: { label: string, greeting_script: string, voice_persona: string, fallback_routing: string }
7. "COMPLIANCE_CHECK_REWRITE": Checks code ad text and fixes Fair Housing / RESPA issues.
   Expected JSON payload: { target_text: string }
8. "CHITCHAT": If they ask questions, provide analytical market summaries, or ask general queries.
   Expected JSON payload: {}

You MUST return a raw JSON matching this exact schema:
{
  "action": "ADD_LEAD" | "UPDATE_BILLING" | "ADD_CAMPAIGN" | "ADD_VIDEO" | "ADD_MORTGAGE_PARTNER" | "UPDATE_PHONE_RECEPS" | "COMPLIANCE_CHECK_REWRITE" | "CHITCHAT",
  "explanation": "Your executive confirmation message to display in the user's dashboard console. Ensure this message sounds like an elite, world-class broker with a billion in sales who delivers ultimate time-saving and money-saving value. Explain precisely what automation was completed.",
  "payload": { ... }
}
Do NOT wrap the result in any markdown \`\`\`json format. Just return the raw JSON string.`;

        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.5,
          }
        });

        const text = result.text?.trim() || "";
        resultJson = JSON.parse(text);
      } catch (err: any) {
        console.warn("[Gemini Command Center Fail]: ", err.message);
      }
    }

    // Heuristics fallback / simulation matching if Gemini is not set up OR returned CHITCHAT when user clearly wanted action
    if (!ai || resultJson.action === "CHITCHAT") {
      const lower = command.toLowerCase();
      if (lower.includes("lead") || lower.includes("buyer") || lower.includes("client")) {
        let name = "John Smith";
        if (lower.includes("named")) {
          const matched = command.match(/named\s+([A-Za-z]+\s*[A-Za-z]*)/i);
          if (matched) name = matched[1].trim();
        } else {
          const rName = command.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
          if (rName) name = rName[1];
        }
        
        resultJson = {
          action: "ADD_LEAD",
          explanation: `As a world-class real estate engine built with a billion-dollar perspective, I successfully captured and programmatically created a new high-converting lead named "${name}" under tenant "${tenant.name}". This automated funnel just saved you 4 hours of tedious entry time and secured pristine profile logs to make you money!`,
          payload: {
            name,
            email: name.toLowerCase().replace(/\s+/g, "") + "@gmail.com",
            phone: `(512) 555-` + Math.floor(1000 + Math.random() * 9000),
            stage: "New",
            income: 155000,
            credit_score: 720,
            property_preferences: "Sleek contemporary single unit, budget $650k",
            listing_interest: "905 West Ave, Austin, TX"
          }
        };
      } else if (lower.includes("bill") || lower.includes("delinquent") || lower.includes("suspend") || lower.includes("subscription") || lower.includes("unpaid") || lower.includes("starter") || lower.includes("pro") || lower.includes("enterprise") || lower.includes("pay") || lower.includes("unlock")) {
        resultJson = {
          action: "UPDATE_BILLING",
          explanation: `Invoice cleared and subscription status updated instantly! Delinquency blocks bypassed under our world-class enterprise system. You just saved massive service interruption costs and preserved your pipeline. All webhook endpoints fully back online.`,
          payload: {
            tenant_id: tenant.id,
            billing_status: "Active",
            subscription_tier: lower.includes("starter") ? "Starter" : lower.includes("pro") ? "Pro Team" : "Enterprise Brokerage"
          }
        };
      } else if (lower.includes("ad") || lower.includes("campaign") || lower.includes("marketing") || lower.includes("promote") || lower.includes("placement")) {
        resultJson = {
          action: "ADD_CAMPAIGN",
          explanation: `Highly calibrated, world-class Meta Ad campaign generated programmatically! Injected elite headline copies and hyper-targeted zipcodes directly, saving you 8 hours of manual setup. Standard 10% tech fee calculated to optimize ad spend.`,
          payload: {
            property_id: "MLS-" + Math.floor(100000 + Math.random() * 900000),
            original_url: "https://perrymansai.com/listings-live",
            headline: "Billion-Dollar Choice: Elite Modern Penthouse",
            ad_copy: "Unparalleled layout representing world-class luxury design. Curated to save buyer time and maximize developer returns. Private tours booking instantly.",
            zipcodes: ["78701", "78703", "78704"],
            budget: 1500
          }
        };
      } else if (lower.includes("video") || lower.includes("render") || lower.includes("studio") || lower.includes("clip") || lower.includes("walkthrough")) {
        resultJson = {
          action: "ADD_VIDEO",
          explanation: `Automated localized walkthrough compiled and queued successfully! This instant render bypasses premium video agency fees, saving you thousands of dollars and substantial prep time.`,
          payload: {
            address: "3302 West Rim Blvd, Austin, TX",
            status: "Price Dropped",
            progress: 100,
            status_text: "Completed",
            voiceover_script: "Unbelievable price dropped custom assets! Crafted by Perryman's billion-dollar engine to save you immense time and money. Schedule today.",
            duration_sec: 15
          }
        };
      } else if (lower.includes("officer") || lower.includes("mortgage") || lower.includes("partner") || lower.includes("mlo") || lower.includes("invite")) {
        resultJson = {
          action: "ADD_MORTGAGE_PARTNER",
          explanation: `Invited new preferred Senior Mortgage Partner and synced global portal credentials instantly. Linking finance early saves borrowers substantial interest rates and streamlines overall closing speed by 40%.`,
          payload: {
            name: "Alexander Hamilton, Senior MLO",
            email: "hamilton@preferredmortgage.net",
            phone: "(512) 555-8821"
          }
        };
      } else if (lower.includes("node") || lower.includes("number") || lower.includes("phone") || lower.includes("receps") || lower.includes("sign")) {
        resultJson = {
          action: "UPDATE_PHONE_RECEPS",
          explanation: `Inbound yard node tracked and assigned! Localized virtual receptionist is online with prompt greeting script. This automated triage saves office receptionist overheads and ensures zero missed leads.`,
          payload: {
            label: "HQ Main Entrance Sign Code",
            greeting_script: "Welcome to Perryman's! Let me fast-track your inquiry to our active broker owners to save you immense time and money.",
            voice_persona: "Kore (Friendly Texan)",
            fallback_routing: "(512) 555-0100"
          }
        };
      }
    }

    // Physically execute the parsed action
    try {
      const { action, payload } = resultJson;
      switch (action) {
        case "ADD_LEAD": {
          const newLead = {
            id: "lead-" + Date.now(),
            tenant_id: tenant.id,
            name: payload.name || "Donald Duck",
            email: payload.email || "duck@gmail.com",
            phone: payload.phone || "(512) 555-9011",
            stage: (payload.stage || "New") as any,
            income: Number(payload.income) || 120000,
            credit_score: Number(payload.credit_score) || 710,
            property_preferences: payload.property_preferences || "Modern layout flat with yard access",
            listing_interest: payload.listing_interest || "905 West Ave, Austin",
            compliance_status: "Active" as const,
            last_interaction_time: new Date().toISOString()
          };
          state.leads.push(newLead);
          break;
        }
        case "UPDATE_BILLING": {
          const targetId = payload.tenant_id || tenant.id;
          const targetTenant = state.tenants.find(t => t.id === targetId);
          if (targetTenant) {
            targetTenant.billing_status = (payload.billing_status || "Active") as any;
            if (payload.subscription_tier) {
              targetTenant.subscription_tier = payload.subscription_tier as any;
            }
          }
          break;
        }
        case "ADD_CAMPAIGN": {
          const budgetVal = Number(payload.budget) || 1000;
          const techFee = Number((budgetVal * 0.10).toFixed(2));
          tenant.tech_fee_balance += techFee;
          tenant.active_campaigns_count += 1;
          tenant.ad_spend_budget += budgetVal;

          const newCampaign = {
            id: "camp-" + Date.now(),
            tenant_id: tenant.id,
            property_id: payload.property_id || "MLS-772159",
            original_url: payload.original_url || "https://perrymansai.com/listing",
            headline: payload.headline || "Spectacular Opportunity",
            ad_copy: payload.ad_copy || "A rare listing on the market.",
            zipcodes: payload.zipcodes || ["78704"],
            budget: budgetVal,
            tech_fee: techFee,
            status: "Active" as const
          };
          state.campaigns.push(newCampaign);
          break;
        }
        case "ADD_VIDEO": {
          const newVideo = {
            id: "vid-" + Date.now(),
            address: payload.address || "905 West Ave, Austin, TX",
            status: (payload.status || "Just Listed") as any,
            progress: payload.progress !== undefined ? Number(payload.progress) : 100,
            status_text: (payload.status_text || "Completed") as any,
            voiceover_script: payload.voiceover_script || "Check this amazing property now live!",
            duration_sec: Number(payload.duration_sec) || 18,
            url: "https://images.unsplash.com/photo-1513694203232-719a280e022f"
          };
          state.videoQueue.push(newVideo);
          break;
        }
        case "ADD_MORTGAGE_PARTNER": {
          const newPartner = {
            tenant_id: tenant.id,
            name: payload.name || "Thomas Jefferson, MLO",
            email: payload.email || "tj@jeffersonloans.com",
            phone: payload.phone || "(512) 555-1776",
            status: "Active"
          };
          state.mortgagePartners.push(newPartner);
          break;
        }
        case "UPDATE_PHONE_RECEPS": {
          const areaCode = tenant.id === "tenant-cascade" ? "206" : "512";
          const randNum = Math.floor(1000 + Math.random() * 9000);
          const newNode = {
            id: "node-" + Date.now(),
            tenant_id: tenant.id,
            label: payload.label || "Smart Yard Code Board",
            phone_number: `+1(${areaCode}) 601-${randNum}`,
            voice_persona: payload.voice_persona || "Kore (Friendly Texan)",
            greeting_script: payload.greeting_script || "Welcome! Perryman's automated assistant is ready.",
            fallback_routing: payload.fallback_routing || `+1(${areaCode}) 555-0100`,
            calls_count: 0
          };
          state.phoneNodes.push(newNode);
          break;
        }
        default:
          break;
      }
    } catch (err: any) {
      console.error("[Execution phase of AI command failed]: ", err.message);
    }

    res.json({
      success: true,
      action: resultJson.action,
      explanation: resultJson.explanation,
      state
    });
  });

  // MODULE: The Deal Closer AI Generation Proxy Route
  app.post("/api/closer/generate", async (req, res) => {
    const { systemPrompt, userPrompt, maxTokens } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: "Missing user prompt parameters." });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt || undefined,
            maxOutputTokens: maxTokens || 1800,
            temperature: 0.7,
          }
        });
        const content = result.text || "";
        return res.json({ content });
      } catch (err: any) {
        console.warn("[Gemini Closer SDK Fail, trying proxy fallback...]: ", err.message);
      }
    }

    // Fallback to the original proxy endpoint from coogi87bbb tool kit
    try {
      const response = await fetch("https://api.manus.im/api/llm-proxy/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-Kdc58KKRTPCFeJyiAdqqJN"
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          max_tokens: maxTokens || 1800,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        return res.json({ content });
      } else {
        const errorText = await response.text();
        return res.status(500).json({ error: `Fallback proxy failed: ${errorText}` });
      }
    } catch (fallbackErr: any) {
      return res.status(500).json({ error: `All generation endpoints failed: ${fallbackErr.message}` });
    }
  });

  // Vite framework setup (serving production build or development server context)
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on host 0.0.0.0 port ${PORT}`);
  });
}

startServer();
