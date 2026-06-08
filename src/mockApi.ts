import { UserRole, LeadStage, BillingStatus } from "./types";

// Persistent or in-memory state mimicking the backend server
const LOCAL_STORAGE_KEY = "nexus_ai_emulated_db";

const INITIAL_TENANTS = [
  {
    id: "tenant-perryman",
    name: "Perryman's Luxury Realty (Texas)",
    subscription_tier: "Enterprise Brokerage" as const,
    billing_status: BillingStatus.ACTIVE,
    tech_fee_balance: 1420.50,
    active_campaigns_count: 5,
    ad_spend_budget: 12500
  },
  {
    id: "tenant-cascade",
    name: "Cascade Realty Seattle",
    subscription_tier: "Pro Team" as const,
    billing_status: BillingStatus.ACTIVE,
    tech_fee_balance: 420.00,
    active_campaigns_count: 2,
    ad_spend_budget: 4500
  },
  {
    id: "tenant-delinquent",
    name: "Pinnacle Listings Miami",
    subscription_tier: "Enterprise Brokerage" as const,
    billing_status: BillingStatus.DELINQUENT,
    tech_fee_balance: 850.00,
    active_campaigns_count: 0,
    ad_spend_budget: 0
  },
  {
    id: "tenant-solo",
    name: "Maverick Solo Brokerage",
    subscription_tier: "Starter" as const,
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
  { id: "lead-1", tenant_id: "tenant-perryman", name: "Alexandra Thorne", email: "a.thorne@gmail.com", phone: "(512) 555-0101", stage: LeadStage.NEW, income: 145000, credit_score: 720, property_preferences: "3B/2B Central Austin near Town Lake, budget $850k", listing_interest: "905 West Ave, Austin, TX", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T14:30:00Z" },
  { id: "lead-2", tenant_id: "tenant-perryman", name: "David Vance", email: "d.vance@techmail.io", phone: "(512) 555-0102", stage: LeadStage.NEW, income: 198000, credit_score: 740, property_preferences: "Luxury high-rise condo downtown, budget $1.2M", listing_interest: "The Independent, 10th Floor", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T12:15:00Z" },
  { id: "lead-3", tenant_id: "tenant-perryman", name: "Maria Serna", email: "maria.serna@designcorp.com", phone: "(512) 555-0103", stage: LeadStage.NEW, income: 93000, credit_score: 690, property_preferences: "Modern townhome in Austin East side, budget $550k", listing_interest: "Modernist East Units", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T15:22:00Z" },
  { id: "lead-4", tenant_id: "tenant-perryman", name: "Richard Chen", email: "r.chen@capitalinvest.com", phone: "(512) 555-0104", stage: LeadStage.NEW, income: 280000, credit_score: 810, property_preferences: "Invesment duplex in Austin central", listing_interest: "North University Duplex", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T09:44:00Z" },
  { id: "lead-5", tenant_id: "tenant-cascade", name: "Kari Nordstrom", email: "knord@nordstrom.net", phone: "(206) 555-0105", stage: LeadStage.NEW, income: 165000, credit_score: 710, property_preferences: "Capitol Hill bungalow with charm, budget $950k", listing_interest: "1815 E Mercer St", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T16:00:00Z" },

  // AI Nurturing Leads
  { id: "lead-6", tenant_id: "tenant-perryman", name: "Theresa Vance", email: "t.vance@education.org", phone: "(512) 555-0106", stage: LeadStage.AI_NURTURING, income: 110000, credit_score: 650, property_preferences: "Family home in Round Rock ISD, budget $450k", listing_interest: "105 Avery Ranch Cove", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T13:40:00Z" },
  { id: "lead-7", tenant_id: "tenant-perryman", name: "Gregory Peck", email: "greg@peckcreative.com", phone: "(512) 555-0107", stage: LeadStage.AI_NURTURING, income: 135000, credit_score: 720, property_preferences: "Classic Mid-century in South Austin, budget $750k", listing_interest: "Bouldin Creek classic bungalow", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T11:05:00Z" },
  { id: "lead-8", tenant_id: "tenant-perryman", name: "Samantha Knowles", email: "sknowles@mediaspace.com", phone: "(512) 555-0108", stage: LeadStage.AI_NURTURING, income: 125000, credit_score: 680, property_preferences: "Chic condo in North Loop near coffee shops", listing_interest: "The Griffin Lofts", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T10:10:00Z" },
  { id: "lead-9", tenant_id: "tenant-perryman", name: "Jeremy Irons", email: "jirons@prosteel.com", phone: "(512) 555-0109", stage: LeadStage.AI_NURTURING, income: 185000, credit_score: 745, property_preferences: "Acreage property in Hill Country, Austin west", listing_interest: "14 Lone Star Circle, Dripping Springs", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T15:10:00Z" },
  { id: "lead-10", tenant_id: "tenant-perryman", name: "Linda Blair", email: "lblair@hauntpro.com", phone: "(512) 555-0110", stage: LeadStage.AI_NURTURING, income: 82000, credit_score: 610, property_preferences: "Fixer upper / estate sale with potential", listing_interest: "602 East 31st St", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T15:30:00Z" },
  { id: "lead-11", tenant_id: "tenant-cascade", name: "Hiroto Tanaka", email: "htanaka@seattle-sys.co.jp", phone: "(206) 555-0111", stage: LeadStage.AI_NURTURING, income: 240000, credit_score: 790, property_preferences: "Modern Bellevue architectural, budget $2.4M", listing_interest: "Bellevue Lakeview Estates", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T12:00:00Z" },

  // Qualified Leads
  { id: "lead-12", tenant_id: "tenant-perryman", name: "Christian Bale", email: "cbale@gothaminvest.net", phone: "(512) 555-0112", stage: LeadStage.QUALIFIED, income: 350000, credit_score: 820, property_preferences: "Penthouse / luxury lakefront, budget $3.5M", listing_interest: "Lake Austin Waterfront Sanctuary", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T16:15:00Z" },
  { id: "lead-13", tenant_id: "tenant-perryman", name: "Nora Ephron", email: "nora@writertable.org", phone: "(512) 555-0113", stage: LeadStage.QUALIFIED, income: 160000, credit_score: 780, property_preferences: "Craftsman style home with big yard & tree canopy", listing_interest: "Travis Heights Craftsman", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T09:30:00Z" },
  { id: "lead-14", tenant_id: "tenant-perryman", name: "Bradley Cooper", email: "bcoop@hollywoodeast.com", phone: "(512) 555-0114", stage: LeadStage.QUALIFIED, income: 220000, credit_score: 710, property_preferences: "Contemporary modern on Cliffside, budget $1.8M", listing_interest: "Mount Bonnell Ridge Retreat", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T18:20:00Z" },
  { id: "lead-15", tenant_id: "tenant-perryman", name: "Danielle Radcliffe", email: "drac@wizardcapital.co.uk", phone: "(512) 555-0115", stage: LeadStage.QUALIFIED, income: 175000, credit_score: 755, property_preferences: "Historical stone house near campus area", listing_interest: "Heritage Austin Manor", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T14:40:00Z" },
  { id: "lead-16", tenant_id: "tenant-cascade", name: "Fiona Gallagher", email: "fiona.g@southsideloft.com", phone: "(206) 555-0116", stage: LeadStage.QUALIFIED, income: 125000, credit_score: 715, property_preferences: "Queen Anne duplex with sound view", listing_interest: "125 West Highland Dr", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T14:10:00Z" },

  // Mortgage Review Leads
  { id: "lead-17", tenant_id: "tenant-perryman", name: "Oscar Isaac", email: "oscar@duneacademy.org", phone: "(512) 555-0117", stage: LeadStage.MORTGAGE_REVIEW, income: 180000, credit_score: 690, property_preferences: "Mid-century ranch, budget $800k in West Rim", listing_interest: "3302 West Rim Blvd", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T13:10:00Z" },
  { id: "lead-18", tenant_id: "tenant-perryman", name: "Emma Watson", email: "ewatson@unenvoy.org", phone: "(512) 555-0118", stage: LeadStage.MORTGAGE_REVIEW, income: 210000, credit_score: 730, property_preferences: "Eco-friendly passive house certified", listing_interest: "Mueller Green Build Block 4", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T15:55:00Z" },
  { id: "lead-19", tenant_id: "tenant-perryman", name: "Denzel Washington", email: "equalizer@justice.net", phone: "(512) 555-0119", stage: LeadStage.MORTGAGE_REVIEW, income: 300000, credit_score: 805, property_preferences: "Secure compound, gated, budget $2.8M", listing_interest: "Barton Creek Estate #4", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T10:45:00Z" },
  { id: "lead-20", tenant_id: "tenant-perryman", name: "Meryl Streep", email: "meryl@editorialqueen.new", phone: "(512) 555-0120", stage: LeadStage.MORTGAGE_REVIEW, income: 450000, credit_score: 840, property_preferences: "Elegant estate with gorgeous library and gardens", listing_interest: "Rob Roy Garden Manor", compliance_status: "Active" as const, last_interaction_time: "2026-06-05T11:20:00Z" },
  { id: "lead-21", tenant_id: "tenant-cascade", name: "Benedict Cumberbatch", email: "sherlock@221bbaker.co.uk", phone: "(206) 555-0121", stage: LeadStage.MORTGAGE_REVIEW, income: 290000, credit_score: 760, property_preferences: "Fremont industrial loft space with high brick arches", listing_interest: "Fremont Foundry Studios, Penthouse B", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T11:15:00Z" },

  // Scheduled Leads
  { id: "lead-22", tenant_id: "tenant-perryman", name: "Keanu Reeves", email: "matrix@neo-con.net", phone: "(512) 555-0122", stage: LeadStage.SCHEDULED, income: 260000, credit_score: 780, property_preferences: "Minimalist concrete architectural loft with security", listing_interest: "Zilker Park Contemporary concrete home", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T16:30:00Z" },
  { id: "lead-23", tenant_id: "tenant-perryman", name: "Margot Robbie", email: "barbie@worldrealty.pink", phone: "(512) 555-0123", stage: LeadStage.SCHEDULED, income: 410000, credit_score: 795, property_preferences: "Bright retro-modern estate with pool & neon vibes", listing_interest: "Pecan Springs Pink Villa", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T13:00:00Z" },
  { id: "lead-24", tenant_id: "tenant-perryman", name: "Ryan Gosling", email: "gosling@driver.net", phone: "(512) 555-0124", stage: LeadStage.SCHEDULED, income: 155000, credit_score: 740, property_preferences: "Quiet midsize modern cabin with large garage bay", listing_interest: "Barton Hills Hideaway", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T15:20:00Z" },
  { id: "lead-25", tenant_id: "tenant-perryman", name: "Natalie Portman", email: "natalie@postgrad.harvard.edu", phone: "(512) 555-0125", stage: LeadStage.SCHEDULED, income: 235000, credit_score: 810, property_preferences: "Restored Victorian historical home", listing_interest: "Hyde Park Queen Anne", compliance_status: "Active" as const, last_interaction_time: "2026-06-05T14:15:00Z" },
  { id: "lead-26", tenant_id: "tenant-cascade", name: "Tom Hanks", email: "thanks@islandcastaway.com", phone: "(206) 555-0126", stage: LeadStage.SCHEDULED, income: 380000, credit_score: 830, property_preferences: "Mercer Island waterfront, boat slip critical", listing_interest: "Mercer Island West Shoreline", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T09:12:00Z" },

  // Handed Off Leads
  { id: "lead-27", tenant_id: "tenant-perryman", name: "Brad Pitt", email: "brad@theplanb.com", phone: "(512) 555-0127", stage: LeadStage.HANDED_OFF, income: 310000, credit_score: 770, property_preferences: "Frank Lloyd Wright inspired architecture only", listing_interest: "Lost Creek Organic Prairie Mansion", compliance_status: "Active" as const, last_interaction_time: "2026-06-07T14:50:00Z" },
  { id: "lead-28", tenant_id: "tenant-perryman", name: "Jennifer Aniston", email: "jen@friendsreunion.com", phone: "(512) 555-0128", stage: LeadStage.HANDED_OFF, income: 290000, credit_score: 765, property_preferences: "Gated estate with high privacy hedges and guest cottage", listing_interest: "West Lake Hills Hideaway", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T10:11:00Z" },
  { id: "lead-29", tenant_id: "tenant-perryman", name: "Leonardo DiCaprio", email: "leo@ecoground.org", phone: "(512) 555-0129", stage: LeadStage.HANDED_OFF, income: 500000, credit_score: 815, property_preferences: "Strictly solar-powered compound, zero carbon footprints", listing_interest: "Zilker Eco-Compound #1", compliance_status: "Active" as const, last_interaction_time: "2026-06-05T17:15:00Z" },
  { id: "lead-30", tenant_id: "tenant-cascade", name: "Steve McQueen", email: "smcqueen@bullitt.org", phone: "(206) 555-0130", stage: LeadStage.HANDED_OFF, income: 180000, credit_score: 720, property_preferences: "Mid-century with massive multi-car exhibition workshop", listing_interest: "Ballard Automotive Loft", compliance_status: "Active" as const, last_interaction_time: "2026-06-06T11:05:00Z" }
];

const INITIAL_CHAT_LOGS = [
  { id: "chat-1", lead_id: "lead-6", sender: "ai" as const, message: "Hi Theresa! I was scanning the Round Rock schools index. The local properties in Avery Ranch are right next to the top-rated elementary! What is your maximum budget for the home?", timestamp: "2026-06-07T13:30:00Z", channel_visibility: "all" as const },
  { id: "chat-2", lead_id: "lead-6", sender: "lead" as const, message: "That is perfect! Our maximum budget is around $450k. My husband makes about $110,000/yr and we have decent credit.", timestamp: "2026-06-07T13:31:00Z", channel_visibility: "all" as const },
  { id: "chat-3", lead_id: "lead-6", sender: "ai" as const, message: "Amazing. With an income of $110k, a $450k home matches your financial metrics beautifully. Let me invite David Miller, our mortgage partner to fast-track your pre-approval letter so we are ready to offer!", timestamp: "2026-06-07T13:33:00Z", channel_visibility: "all" as const },

  { id: "chat-4", lead_id: "lead-17", sender: "ai" as const, message: "Hello Oscar! I am tracking the West Rim Ranch. Let's look at your buying profile. Could you share your approximate annual income and credit score range?", timestamp: "2026-06-07T13:00:00Z", channel_visibility: "all" as const },
  { id: "chat-5", lead_id: "lead-17", sender: "lead" as const, message: "Sure, my annual income is around $180,000 and my credit score is around 690.", timestamp: "2026-06-07T13:02:00Z", channel_visibility: "all" as const },
  { id: "chat-6", lead_id: "lead-17", sender: "ai" as const, message: "Excellent financial profile. Your income makes a West Rim home highly viable. I am pulling in David Miller, our Preferred Mortgage Partner, into this channel right now so he can evaluate custom financing packages for you. Our Broker Owner and Agent will also be updated in real-time.", timestamp: "2026-06-07T13:05:00Z", channel_visibility: "all" as const },
  { id: "chat-7", lead_id: "lead-17", sender: "mortgage" as const, message: "Oscar! This is David. Looking at your metrics, we can do a 5/1 ARM or a 30-year fixed with only 10% down because of our partner priority. Let's schedule a call!", timestamp: "2026-06-07T13:08:00Z", channel_visibility: "all" as const }
];

const INITIAL_VIDEO_QUEUE = [
  { id: "vid-1", address: "14 Lone Star Circle, Dripping Springs, TX", status: "Price Dropped" as const, progress: 100, status_text: "Completed" as const, voiceover_script: "Unbelievable price drop in Dripping Springs! This spectacular 4-bedroom Hill Country homestead is now available for seventy-five thousand dollars below original listing. Act fast before it's gone!", duration_sec: 22, url: "https://images.unsplash.com/photo-1513694203232-719a280e022f" },
  { id: "vid-2", address: "Travis Heights Craftsman, Austin, TX", status: "Just Listed" as const, progress: 100, status_text: "Completed" as const, voiceover_script: "Just listed in highly coveted Travis Heights! Walk to South Congress from this perfectly restored historical-grade craftsman home featuring an automated chef kitchen and breathtaking live oaks.", duration_sec: 18, url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914" },
  { id: "vid-3", address: "905 West Ave, Austin, TX", status: "Price Dropped" as const, progress: 45, status_text: "Kinetic Layering" as const, voiceover_script: "Substantial price drop on West Ave! Experience sleek luxury Downtown Austin living with magnificent high ceilings and gorgeous private terraces. Contact Perryman's immediately.", duration_sec: 15 },
  { id: "vid-4", address: "Mueller Green Build Block 4", status: "Just Listed" as const, progress: 0, status_text: "In Queue" as const, voiceover_script: "", duration_sec: 20 }
];

const INITIAL_AD_CAMPAIGNS = [
  { id: "camp-1", tenant_id: "tenant-perryman", property_id: "MLS-90124", original_url: "https://mls.com/listing/travis-heights", headline: "Historic Travis Heights Bungalow with Modern Pool", ad_copy: "Uncompromising elegance in the heart of 78704! Perryman's presents this gorgeous 3-bedroom jewel. Perfect for modern living with highly rated schools nearby.", zipcodes: ["78704", "78701", "78703"], budget: 1500, tech_fee: 150, status: "Active" as const },
  { id: "camp-2", tenant_id: "tenant-perryman", property_id: "MLS-44512", original_url: "https://mls.com/listing/dripping-springs", headline: "Price Drop! Hill Country Oasis with 5 Acres", ad_copy: "Wake up to breathtaking morning vistas! Huge price reduction on this Dripping Springs compound. Bring your horses or build your detached duplex studio.", zipcodes: ["78620", "78738", "78735"], budget: 2000, tech_fee: 200, status: "Active" as const }
];

interface MockState {
  tenants: any[];
  leads: any[];
  chatLogs: any[];
  videoQueue: any[];
  phoneNodes: any[];
  pastClients: any[];
  campaigns: any[];
  mortgagePartners: any[];
}

function getStoredState(): MockState {
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (val) {
      return JSON.parse(val);
    }
  } catch (err) {
    console.error("Local storage read fail", err);
  }

  const defaultState: MockState = {
    tenants: INITIAL_TENANTS,
    leads: INITIAL_LEADS,
    chatLogs: INITIAL_CHAT_LOGS,
    videoQueue: INITIAL_VIDEO_QUEUE,
    phoneNodes: INITIAL_PHONE_NODES,
    pastClients: INITIAL_PAST_CLIENTS,
    campaigns: INITIAL_AD_CAMPAIGNS,
    mortgagePartners: INITIAL_MORTGAGE_PARTNERS
  };
  saveStoredState(defaultState);
  return defaultState;
}

function saveStoredState(state: MockState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Local storage save fail", err);
  }
}

// Emulate Node.js API endpoint logic client-side
function handleMockRequest(url: string, init?: RequestInit): Promise<Response> {
  const state = getStoredState();
  const parsedUrl = new URL(url, window.location.origin);
  const path = parsedUrl.pathname;
  const method = init?.method?.toUpperCase() || "GET";

  let responseBody: any = {};
  let status = 200;

  console.log(`[CLIENT-SIDE MOCK WORKSPACE] Intercepted Request: ${method} ${path}`);

  if (path === "/api/state" && method === "GET") {
    responseBody = state;
  } 

  else if (path === "/api/tenant/update" && method === "POST") {
    const { tenant_id, data } = JSON.parse(init?.body as string || "{}");
    const idx = state.tenants.findIndex(t => t.id === tenant_id);
    if (idx !== -1) {
      state.tenants[idx] = { ...state.tenants[idx], ...data };
      saveStoredState(state);
      responseBody = { success: true, tenant: state.tenants[idx] };
    } else {
      status = 404;
      responseBody = { error: "Tenant not found" };
    }
  } 

  else if (path === "/api/stripe/checkout" && method === "POST") {
    const { tenant_id, plan } = JSON.parse(init?.body as string || "{}");
    const tenantIdx = state.tenants.findIndex(t => t.id === tenant_id);
    if (tenantIdx !== -1) {
      state.tenants[tenantIdx].billing_status = BillingStatus.ACTIVE;
      state.tenants[tenantIdx].subscription_tier = plan;
      saveStoredState(state);
      responseBody = { success: true, message: `Subscription Activated successfully via Stripe Sandbox!`, tenant: state.tenants[tenantIdx] };
    } else {
      status = 404;
      responseBody = { error: "Tenant not found to activate subscription" };
    }
  } 

  else if (path === "/api/voice/save-node" && method === "POST") {
    const { node_id, greeting_script, voice_persona, fallback_routing } = JSON.parse(init?.body as string || "{}");
    const item = state.phoneNodes.find(n => n.id === node_id);
    if (item) {
      item.greeting_script = greeting_script;
      item.voice_persona = voice_persona;
      item.fallback_routing = fallback_routing;
      saveStoredState(state);
      responseBody = { success: true, node: item };
    } else {
      status = 404;
      responseBody = { error: "Voice node not found" };
    }
  } 

  else if (path === "/api/voice/generate-node" && method === "POST") {
    const { tenant_id, label } = JSON.parse(init?.body as string || "{}");
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
    saveStoredState(state);
    responseBody = { success: true, node: newNode };
  } 

  else if (path === "/api/mortgage/invite" && method === "POST") {
    const { tenant_id, name, email, phone } = JSON.parse(init?.body as string || "{}");
    const newPartner = { tenant_id, name, email, phone, status: "Active" };
    state.mortgagePartners.push(newPartner);
    saveStoredState(state);
    responseBody = { success: true, partners: state.mortgagePartners.filter(p => p.tenant_id === tenant_id) };
  } 

  else if (path === "/api/leads/update-stage" && method === "POST") {
    const { lead_id, stage } = JSON.parse(init?.body as string || "{}");
    const lead = state.leads.find(l => l.id === lead_id);
    if (lead) {
      lead.stage = stage as LeadStage;
      lead.last_interaction_time = new Date().toISOString();
      saveStoredState(state);
      responseBody = { success: true, lead };
    } else {
      status = 404;
      responseBody = { error: "Lead not found" };
    }
  } 

  else if (path === "/api/leads/add-chat" && method === "POST") {
    const { lead_id, message, sender } = JSON.parse(init?.body as string || "{}");
    const lead = state.leads.find(l => l.id === lead_id);
    if (!lead) {
      status = 404;
      responseBody = { error: "Lead not found" };
    } else {
      const leadMsg = {
        id: "chat-user-" + Date.now(),
        lead_id,
        sender: sender || "lead",
        message,
        timestamp: new Date().toISOString(),
        channel_visibility: "all" as const
      };
      state.chatLogs.push(leadMsg);

      const responseMessages = [leadMsg];

      // Simulated local AI nurture agent response
      if (sender === "lead" || !sender) {
        const financialMatch = message.match(/(income|earn|salary|make|credit|score|\$)/i);
        let responseText = "";

        if (financialMatch) {
          responseText = `Incredible credentials! As a world-class team with a billion dollars in successful sales, we recognize top-tier qualifications instantly. We have saved these metrics and synced our Preferred Mortgage Loan Officer partner, David Miller, to evaluate optimized rates and save you immense time and capital. Let's secure this elite deal!`;
        } else {
          responseText = `Excellent prospect. At Perryman's, we represent world-class properties. To save you substantial time and money, may I inquire about your preferred target timeline, or should we introduce our senior mortgage partner, David Miller, to analyze custom pricing packages?`;
        }

        // Check if message has financial data to update lead state
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
        responseMessages.push(aiMsg);
      }

      saveStoredState(state);
      responseBody = { success: true, lead, messages: responseMessages };
    }
  } 

  else if (path === "/api/video/add-queue" && method === "POST") {
    const { address, status } = JSON.parse(init?.body as string || "{}");
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
    saveStoredState(state);
    responseBody = { success: true, item: newItem };
  } 

  else if (path === "/api/video/simulate-process" && method === "POST") {
    const { video_id } = JSON.parse(init?.body as string || "{}");
    const item = state.videoQueue.find(v => v.id === video_id);
    if (!item) {
      status = 404;
      responseBody = { error: "Queue item not found" };
    } else {
      let script = "";
      if (item.status === "Price Dropped") {
        script = `Elite buy signal! A massive price correction just went live for ${item.address}. Curated by Perryman's billion-dollar sales engine to save you immense time and money. Call now!`;
      } else {
        script = `Just listed by Perryman's: ${item.address}. An architectural masterpiece representing world-class design, curated by a team with a billion in career sales to maximize your net equity.`;
      }

      item.voiceover_script = script;
      item.progress = 100;
      item.status_text = "Completed";
      item.url = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";
      
      saveStoredState(state);
      responseBody = { success: true, item };
    }
  } 

  else if (path === "/api/campaign/generate-architect" && method === "POST") {
    const { tenant_id, property_id, original_url, budget, details } = JSON.parse(init?.body as string || "{}");
    const budgetVal = Number(budget) || 1000;
    const techFee = Number((budgetVal * 0.10).toFixed(2));

    const tenant = state.tenants.find(t => t.id === tenant_id);
    if (tenant) {
      tenant.tech_fee_balance += techFee;
      tenant.active_campaigns_count += 1;
      tenant.ad_spend_budget += budgetVal;
    }

    const headline = `Billion-Dollar Choice: Premium Live - ${property_id}`;
    const copyText = `Luxury residence introduced by Perryman's Apex Systems, curated by a team with a billion in career sales. Lock in high-converting buyer rates instantly to save critical time and money. ${details || ''}`;
    const zipcodes = property_id.includes("Seattle") ? ["98122", "98112", "98105"] : ["78703", "78704", "78731"];

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
    saveStoredState(state);
    responseBody = { success: true, campaign: newCampaign, tenant };
  } 

  else if (path === "/api/compliance/intercept" && method === "POST") {
    const { ad_copy } = JSON.parse(init?.body as string || "{}");
    if (!ad_copy) {
      responseBody = { clean: true };
    } else {
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
        const rewrite = ad_copy
          .replace(/young\s+families/ig, "homebuyers of all sizes")
          .replace(/mature\s+couples?/ig, "people who appreciate a tranquil lifestyle")
          .replace(/christian\s+neighborhood/ig, "welcoming inclusive neighborhood")
          .replace(/exclusive\s+gated\s+elite/ig, "secure community setting")
          .replace(/no\s+section\s*8/ig, "all qualified applicants welcome");

        responseBody = {
          clean: false,
          phrase: matched.phrase,
          reason: matched.reason,
          rewrite
        };
      } else {
        responseBody = { clean: true };
      }
    }
  } 

  else if (path === "/api/retention/generate-draft" && method === "POST") {
    const { client_name, address, estimated_equity, years } = JSON.parse(init?.body as string || "{}");
    const draft = `Hi ${client_name}, this is Perryman's. We noticed local transaction records show your home at ${address} has accumulated nearly $${estimated_equity} in community equity. Under our localized moving timelines of ${years} years, this is a prime window to optimize your portfolio. Let's execute to save you massive time and maximize your money!`;
    responseBody = { success: true, draft };
  } 

  else if (path === "/api/ai-command" && method === "POST") {
    const { command, tenant_id } = JSON.parse(init?.body as string || "{}");
    const activeTenant = state.tenants.find(t => t.id === tenant_id) || state.tenants[0];

    let resultJson = {
      action: "CHITCHAT",
      explanation: "Greetings! I am Perryman's Nexus-AI fallback sandbox core. Let's execute to optimize your portfolio!",
      payload: {} as any
    };

    const cmdLC = command.toLowerCase();
    
    // Command Parser RegEx Simulators
    if (cmdLC.includes("bypass") || cmdLC.includes("delinquency") || cmdLC.includes("unlock")) {
      const idx = state.tenants.findIndex(t => t.id === activeTenant.id);
      if (idx !== -1) {
        state.tenants[idx].billing_status = BillingStatus.ACTIVE;
        saveStoredState(state);
      }
      resultJson = {
        action: "UPDATE_BILLING",
        explanation: `🔓 Billing Guardrail override successful! Restored active token state for tenant: "${activeTenant.name}". Suspending delinquent blocks and synced state engines.`,
        payload: { tenant_id: activeTenant.id, billing_status: "Active", subscription_tier: activeTenant.subscription_tier }
      };
    } 
    
    else if (cmdLC.includes("sandra bullock") || cmdLC.includes("sandra")) {
      const newLead = {
        id: "lead-sandra-" + Date.now(),
        tenant_id: activeTenant.id,
        name: "Sandra Bullock",
        email: "sandra.b@hollywoodrealty.com",
        phone: "(512) 555-0720",
        stage: LeadStage.NEW,
        income: 240000,
        credit_score: 755,
        property_preferences: "3B/2B Central Austin Historic Home near zilker park",
        listing_interest: "3502 River Rd",
        compliance_status: "Active",
        last_interaction_time: new Date().toISOString()
      } as any;
      
      state.leads.push(newLead);
      saveStoredState(state);
      
      resultJson = {
        action: "ADD_LEAD",
        explanation: `👤 Lead Record Created! Sandra Bullock is added with stage NEW interested in '3502 River Rd'. Real-time CRM pipelines updated.`,
        payload: newLead
      };
    }

    else if (cmdLC.includes("add lead") || cmdLC.includes("new lead")) {
      const m = command.match(/add lead\s+([A-Za-z\s]+)(?:\s+interested\s+in\s+([0-9A-Za-z\s]+))?/i);
      const leadName = m ? m[1].trim() : "Bobby Fischer";
      const leadInterest = m && m[2] ? m[2].trim() : "905 West Ave Loft";
      
      const newLead = {
        id: "lead-" + Date.now(),
        tenant_id: activeTenant.id,
        name: leadName,
        email: `${leadName.toLowerCase().replace(/\s+/g, "")}@luxurymail.com`,
        phone: "(512) 555-0811",
        stage: LeadStage.NEW,
        income: 155000,
        credit_score: 730,
        property_preferences: "3B/2B Central Austin",
        listing_interest: leadInterest,
        compliance_status: "Active",
        last_interaction_time: new Date().toISOString()
      } as any;
      
      state.leads.push(newLead);
      saveStoredState(state);
      
      resultJson = {
        action: "ADD_LEAD",
        explanation: `👤 Created lead record successfully for "${leadName}" seeking "${leadInterest}" inside the standalone local database. CRM boards resolved.`,
        payload: newLead
      };
    } 
    
    else if (cmdLC.includes("move lead david vance") || cmdLC.includes("david vance")) {
      const l = state.leads.find(x => x.name.toLowerCase().includes("david vance") || x.id === "lead-2");
      if (l) {
        l.stage = LeadStage.QUALIFIED;
        saveStoredState(state);
      }
      resultJson = {
        action: "UPDATE_LEAD_STAGE",
        explanation: `📈 Lead Re-ranking complete! David Vance's status advanced from 'New' to 'Qualified' based on income metrics ($198k/yr) and credit score (740).`,
        payload: l || {}
      };
    }

    else if (cmdLC.includes("portfolio performance") || cmdLC.includes("portfolio metrics") || (cmdLC.includes("show") && cmdLC.includes("metrics"))) {
      resultJson = {
        action: "PORTFOLIO_ANALYTICS",
        explanation: `📊 [BILLION DOLLAR ANALYTICS CORE] Portfolio report generated for "${activeTenant.name}"! Verified subscription tier: ${activeTenant.subscription_tier}. Active campaigns count: ${activeTenant.active_campaigns_count}, Total active ad budgets: $${activeTenant.ad_spend_budget}, and current technology fee balance: $${activeTenant.tech_fee_balance}. All systems running optimally.`,
        payload: { tenant: activeTenant }
      };
    }

    else if (cmdLC.includes("database health") || cmdLC.includes("health check") || cmdLC.includes("diagnostic")) {
      resultJson = {
        action: "DIAGNOSTIC_CHECK",
        explanation: `🛡️ Overall System Database Health Index: Excellent (99.8% nominal). Verified 30 lead pipelines, yard voice receptionist tracking lines, HUD rule constraints, and compliance filters. AI agent average latency holds at 0.04s.`,
        payload: { latency_seconds: 0.04, checks: "Passed" }
      };
    }

    else if (cmdLC.includes("active lead engagement") || cmdLC.includes("pipeline logs") || cmdLC.includes("engagement check")) {
      resultJson = {
        action: "CRM_AUDIT",
        explanation: `💬 Dialogue Engagement Audit: Synced 4 active dialogue streams. Identified hot client prospects Theresa Vance and David Vance as highly engaged with AI assistants. Recommended scheduling high-volume mortgage broker warm handoffs.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("bouldin") || cmdLC.includes("budget $2500")) {
      const newAd = {
        id: "camp-bouldin-" + Date.now(),
        tenant_id: activeTenant.id,
        property_id: "MLS-BOULDIN-99",
        original_url: "https://perrymansai.com/mls-bouldin-preview",
        headline: "Historic Bouldin Creek Jewel with Modern Pool",
        ad_copy: "Uncompromising elegance in the heart of 78704! Perryman's presents this gorgeous 3-bedroom jewel. Perfect for modern living with highly rated schools nearby.",
        zipcodes: ["78704", "78701", "78703"],
        budget: 2500,
        tech_fee: 250,
        status: "Active"
      };
      state.campaigns.push(newAd);
      const idx = state.tenants.findIndex(t => t.id === activeTenant.id);
      if (idx !== -1) {
        state.tenants[idx].tech_fee_balance += 250;
        state.tenants[idx].active_campaigns_count += 1;
        state.tenants[idx].ad_spend_budget += 2500;
      }
      saveStoredState(state);
      resultJson = {
        action: "GENERATE_AD",
        explanation: `📣 Multi-channel Ad Copy curated for 'Austin Bouldin Luxury Listing'! Generated copy options with ZIP codes 78704, 78701. Allocated $2,500 ad spend, with a 10% automation tech-fee ($250) routed back to subscriber ledger.`,
        payload: newAd
      };
    }

    else if (cmdLC.includes("mueller green block 4") || cmdLC.includes("mueller green") || cmdLC.includes("budget $1500")) {
      const newAd = {
        id: "camp-mueller-" + Date.now(),
        tenant_id: activeTenant.id,
        property_id: "MLS-MUELLER-44",
        original_url: "https://perrymansai.com/mls-mueller-preview",
        headline: "Mueller Green Block 4 Eco-Townhome",
        ad_copy: "Eco-friendly certified passive build block in Mueller! Magnificent solar orientation and modern zero-footprint amenities.",
        zipcodes: ["78723", "78722", "78751"],
        budget: 1500,
        tech_fee: 150,
        status: "Active"
      };
      state.campaigns.push(newAd);
      const idx = state.tenants.findIndex(t => t.id === activeTenant.id);
      if (idx !== -1) {
        state.tenants[idx].tech_fee_balance += 150;
        state.tenants[idx].active_campaigns_count += 1;
        state.tenants[idx].ad_spend_budget += 1500;
      }
      saveStoredState(state);
      resultJson = {
        action: "GENERATE_AD",
        explanation: `📣 Eco-focused ad set established for Mueller Green Block 4 with budget $1,500 (+10% tech fee). Meta Ad APIs simulated and targeted at localized zipcodes.`,
        payload: newAd
      };
    }

    else if (cmdLC.includes("video studio render") || cmdLC.includes("render walkthrough") || cmdLC.includes("ridge ave")) {
      const newVid = {
        id: "vid-1010-" + Date.now(),
        address: "1010 Ridge Ave, Austin, TX",
        status: "Just Listed",
        progress: 100,
        status_text: "Completed",
        voiceover_script: "Just listed by Perryman's: 1010 Ridge Ave. An architectural masterpiece representing world-class design, curated by a team with a billion in career sales to maximize your net equity.",
        duration_sec: 15,
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
      } as any;
      state.videoQueue.push(newVid);
      saveStoredState(state);
      resultJson = {
        action: "RENDER_VIDEO",
        explanation: `🎬 Stitched image frames successfully into walkthrough render queue for '1010 Ridge Ave'. Voiceover script synthesized using professional audio models.`,
        payload: newVid
      };
    }

    else if (cmdLC.includes("render walkthrough video") || (cmdLC.includes("walkthrough") && cmdLC.includes("mueller"))) {
      const newVid = {
        id: "vid-mueller-" + Date.now(),
        address: "Mueller Green Build Block 4, Austin, TX",
        status: "Just Listed",
        progress: 100,
        status_text: "Completed",
        voiceover_script: "Uncompromising green credentials! Experience Mueller's premium passive certified townhome design. Ready for immediate tours.",
        duration_sec: 18,
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
      } as any;
      state.videoQueue.push(newVid);
      saveStoredState(state);
      resultJson = {
        action: "RENDER_VIDEO",
        explanation: `🎬 Walkthrough rendering active! Stitched listing imagery together with an automated kinetic text overlay and voiceover script generated for Mueller Green Build.`,
        payload: newVid
      };
    }

    else if (cmdLC.includes("minimalist modern") || (cmdLC.includes("staging") && cmdLC.includes("905 west"))) {
      resultJson = {
        action: "STAGE_ROOM",
        explanation: `🛋️ Minimalist modern virtual staging package drafted for 905 West Ave living room! Recommended placing low-profile top-grain leather sections, brushed oak coffee tables, and neutral linen accents to highlight high-contrast windows.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("scandinavian") || (cmdLC.includes("staging") && cmdLC.includes("penthouse"))) {
      resultJson = {
        action: "STAGE_ROOM",
        explanation: `🛋️ Premium Scandinavian virtual staging guidelines compiled for South Austin Penthouse. Suggested light pine timber framing, high-pile ivory rugs, and minimalistic ambient brass light indicators to double potential luxury offer values.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("follow-up series") || (cmdLC.includes("text") && cmdLC.includes("series"))) {
      resultJson = {
        action: "CAMPAIGN_SEQUENCE",
        explanation: `📱 Curated 3-tier text sequence for active buyers. Day 1: Instant portfolio pricing match. Day 3: Preferred mortgage pre-approval check. Day 5: Multi-negotiation priority check-in. Designed to maximize lead responsiveness.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("newsletter") || cmdLC.includes("email newsletter")) {
      resultJson = {
        action: "CAMPAIGN_SEQUENCE",
        explanation: `✉️ Autonomously drafted elegant email newsletter highlighting key local neighborhood transaction indices, upcoming price drops, and modern virtual tour links. Optimized with click conversion tracking markers.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("authority seo") || cmdLC.includes("seo landing page") || cmdLC.includes("westlake")) {
      resultJson = {
        action: "SEO_GENERATE",
        explanation: `🌐 Geo-targeted high-ranking authority SEO landing page content generated for Austin Westlake real estate! Integrated essential keywords (Westlake luxury properties, Eanes ISD rankings, Barton Creek home values) to claim top-tier organic Google positions.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("google my business") || cmdLC.includes("zilker Listings") || cmdLC.includes("zilker")) {
      resultJson = {
        action: "SEO_GENERATE",
        explanation: `🌐 Automated Google My Business neighborhood post curated for Zilker Park listings. Highlighted walking distances to Barton Springs, coffee shop density indexes, and average equity growth records (12% YoY).`,
        payload: {}
      };
    }

    else if (cmdLC.includes("commission objection") || cmdLC.includes("1% listing fee")) {
      resultJson = {
        action: "CLOSE_DEAL_STRATEGIES",
        explanation: `🏆 Elite commission protection playbook compiled! Provided a 3-step reframing script addressing the 1% discount request. Emphasizes that buying premium representation saves time and nets 8.4% higher average prices.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("interest rate shocks") || cmdLC.includes("objection concerns") || cmdLC.includes("rate shocks")) {
      resultJson = {
        action: "CLOSE_DEAL_STRATEGIES",
        explanation: `🏆 Multi-offer rate shock objection manual prepared. Teaches buyers how our Preferred MLO partners use temporary interest rate buy-downs (e.g. 2-1 buy-down) funded by seller credits to lock in low initial mortgage payments.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("multi-offer") || cmdLC.includes("negotiations response")) {
      resultJson = {
        action: "CLOSE_DEAL_STRATEGIES",
        explanation: `🏆 Tactical escalation response drafted! Leveraged psychological urgency anchors to motivate the counterparty to waive appraisal holds or match list premiums. Ready to review and send.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("invite") && (cmdLC.includes("david miller") || cmdLC.includes("mlo"))) {
      const newPartner = {
        tenant_id: activeTenant.id,
        name: "David Miller, MLO",
        email: "david.miller@apexhomeloans.com",
        phone: "(512) 555-0144",
        status: "Active"
      };
      state.mortgagePartners.push(newPartner);
      saveStoredState(state);
      resultJson = {
        action: "INVITE_MORTGAGE",
        explanation: `🤝 MLO Partner Invited! David Miller, preferred senior Mortgage Loan Officer, has been successfully invited and syndicates onto your tenant seat. Real-time tri-party allocation activated.`,
        payload: newPartner
      };
    }

    else if (cmdLC.includes("criteria triage") || cmdLC.includes("theresa vance") || cmdLC.includes("loan viability")) {
      resultJson = {
        action: "TRIAGE_FINANCES",
        explanation: `🤝 Financial qualification triage run for Theresa Vance. Calculated DTI (Debt-to-Income) at 36% based on $110,000/yr income. Credit score holds at 650. Verified loan viability is strong for standard conventional or FHA mortgage options.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("virtual node") || cmdLC.includes("tracking number") || cmdLC.includes("main sign yard")) {
      const newNode = {
        id: "node-mainsign-" + Date.now(),
        tenant_id: activeTenant.id,
        label: "Main Sign Yard Board",
        phone_number: "+1(512) 601-8319",
        voice_persona: "Kore (Friendly Texan)",
        greeting_script: "Thanks for calling! This is the automated assistant for Perryman's. Are you looking to buy or sell a luxury home today?",
        fallback_routing: "+1(512) 555-0111",
        calls_count: 1
      };
      state.phoneNodes.push(newNode);
      saveStoredState(state);
      resultJson = {
        action: "TRACKING_NUMBER",
        explanation: `📞 Claimed exclusive virtual tracking number (+1(512) 601-8319) mapped for 'Main Sign Yard Board'. Prompt set for friendly Texan persona ready to capture inbound calls.`,
        payload: newNode
      };
    }

    else if (cmdLC.includes("seattle yard qr") || cmdLC.includes("voicenode Seattle") || cmdLC.includes("voicenode tracking")) {
      resultJson = {
        action: "TRACKING_NUMBER",
        explanation: `📞 Seattle Yard QR line configuration verified! Mapped +1(206) 402-9112 to high-converting energetics creator speech receptionist script, redirecting fallback calls to Cascade main branch line.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("copy audit") || cmdLC.includes("discriminatory") || cmdLC.includes("single tech bros only")) {
      resultJson = {
        action: "COMPLIANCE_HOLD",
        explanation: `⚠️ COMPLIANCE HOLD REGISTERED! Outbound copy blocked. The term 'single tech bros only' violates the Fair Housing Act targeting familial/sex status (steering towards unmarried males without children). Suggested legal rewrite: 'Perfect for working professionals seeking a dynamic urban hub.'`,
        payload: { clean: false, phrase: "single tech bros only" }
      };
    }

    else if (cmdLC.includes("christian neighborhood") || cmdLC.includes("christian") || cmdLC.includes("religious steering")) {
      resultJson = {
        action: "COMPLIANCE_HOLD",
        explanation: `⚠️ COMPLIANCE HOLD REGISTERED! Outbound copy blocked. The phrases 'Christian neighborhood' and 'wealthy buyers only' violate Fair Housing Act guidelines concerning religious and source of income discrimination. Suggested legal rewrite: 'Breathtaking neighborhood setting with secure entry access.'`,
        payload: { clean: false, phrase: "Christian neighborhood" }
      };
    }

    else if (cmdLC.includes("past client") || cmdLC.includes("robert & lisa chen") || cmdLC.includes("lisa chen")) {
      resultJson = {
        action: "RETENTION_DRAFT",
        explanation: `🗺️ Relocation alert generated! Robert & Lisa Chen purchased their home in 2019 (6 years tenure) with $345,000 in accumulated equity. Drafted friendly check-in letter outlining community equity optimization options.`,
        payload: {}
      };
    }

    else if (cmdLC.includes("relocation check-in") || cmdLC.includes("steve mcqueen") || cmdLC.includes("steve")) {
      resultJson = {
        action: "RETENTION_DRAFT",
        explanation: `🗺️ Predictive relocation check-in draft prepared for Steve McQueen's Pacific Northwest property. Moving probability modeled at 85% based on localized transaction indexes.`,
        payload: {}
      };
    }
    
    else if (cmdLC.includes("upgrade to pro") || cmdLC.includes("pro team")) {
      const idx = state.tenants.findIndex(t => t.id === activeTenant.id);
      if (idx !== -1) {
        state.tenants[idx].subscription_tier = "Pro Team";
        saveStoredState(state);
      }
      resultJson = {
        action: "UPDATE_BILLING",
        explanation: `📈 Successfully upgraded "${activeTenant.name}" capacity codes to the Pro Team strategic subscription tier! Limit expanded.`,
        payload: { tenant_id: activeTenant.id, billing_status: activeTenant.billing_status, subscription_tier: "Pro Team" }
      };
    } 
    
    else if (cmdLC.includes("upgrade to enterprise") || cmdLC.includes("enterprise")) {
      const idx = state.tenants.findIndex(t => t.id === activeTenant.id);
      if (idx !== -1) {
        state.tenants[idx].subscription_tier = "Enterprise Brokerage";
        saveStoredState(state);
      }
      resultJson = {
        action: "UPDATE_BILLING",
        explanation: `⚜️ Promoted "${activeTenant.name}" to the flagship Enterprise Brokerage strategic high-level tier! Unlocked all 13 autonomous tools.`,
        payload: { tenant_id: activeTenant.id, billing_status: activeTenant.billing_status, subscription_tier: "Enterprise Brokerage" }
      };
    }

    responseBody = resultJson;
  }

  else {
    status = 404;
    responseBody = { error: "API Route Not Found" };
  }

  // Construct a standard fetch Response object
  const headers = new Headers({ "Content-Type": "application/json" });
  const response = new Response(JSON.stringify(responseBody), {
    status,
    headers
  });

  return Promise.resolve(response);
}

const originalFetch = window.fetch;
let isMockActive = false;

export function setupMockApi() {
  if (typeof window === "undefined") return;

  const interceptor = async function (input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === "string" ? input : (input as Request).url;

    // Check if it's our backend API route
    if (url.includes("/api/")) {
      const isStaticHost = 
        window.location.hostname.endsWith("github.io") || 
        window.location.hostname.endsWith("github.com") ||
        window.location.protocol === "file:" ||
        isMockActive;

      if (!isStaticHost) {
        try {
          const res = await originalFetch(input, init);
          return res;
        } catch (err) {
          console.warn(
            "Connection to express full-stack server failed. Engaging browser-side Nexus-AI emulation engine seamlessly...", 
            err
          );
          isMockActive = true;
          // Continue to handle client-side mock
        }
      }

      return handleMockRequest(url, init);
    }

    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, "fetch", {
      value: interceptor,
      configurable: true,
      writable: true,
      enumerable: true
    });
  } catch (err) {
    console.warn("Could not override window.fetch using Object.defineProperty. Attempting direct assignment...", err);
    try {
      window.fetch = interceptor;
    } catch (e) {
      console.error("Failed both Object.defineProperty and direct assignment for window.fetch:", e);
    }
  }
}
