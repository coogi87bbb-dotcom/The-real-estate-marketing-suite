import React, { useState, useEffect } from "react";
import {
  Sparkles,
  LayoutDashboard,
  KanbanSquare,
  Video,
  UserCheck,
  PhoneCall,
  ShieldAlert,
  CalendarDays,
  CreditCard,
  Building,
  User,
  AlertTriangle,
  Megaphone,
  Briefcase,
  HelpCircle,
  Send,
  Bot,
  X,
  Loader2,
  ArrowRight,
  Layers,
  SendToBack,
  TrendingUp,
  Award,
  Search,
  Download
} from "lucide-react";
import { Tenant, Lead, ChatLog, PhoneNode, PastClient, UserRole } from "./types";
import LandingPage from "./components/LandingPage";
import ControlCenter from "./components/ControlCenter";
import PipelineBoard from "./components/PipelineBoard";
import AdArchitect from "./components/AdArchitect";
import VideoStudio from "./components/VideoStudio";
import CoPilotEngine from "./components/CoPilotEngine";
import VoiceReceptionist from "./components/VoiceReceptionist";
import RegulatoryShield from "./components/RegulatoryShield";
import RetentionEngine from "./components/RetentionEngine";
import StripeBilling from "./components/StripeBilling";
import VirtualStaging from "./components/VirtualStaging";
import SmartCampaigns from "./components/SmartCampaigns";
import AuthorityEngine from "./components/AuthorityEngine";
import DealCloserAI from "./components/DealCloserAI";
import PerrymansLogo from "./components/PerrymansLogo";



const AI_TOOLS_INDEX = [
  {
    id: "dashboard",
    name: "Control Center Dashboard",
    desc: "Provides centralized real-time diagnostic checks, resource management counts, and aggregated portfolio spending balances.",
    metric: "Central Watchtower",
    icon: LayoutDashboard,
    badge: "100% Automated",
    color: "teal",
    examples: [
      {
        prompt: "Show full portfolio performance metrics for the active tenant",
        description: "Analyze tenant's subscription tier, billing status, active campaigns, and total real-estate ad budgets."
      },
      {
        prompt: "Perform overall system database health check",
        description: "Run diagnostic checks across CRM lists, receptionist queues, and active campaigns."
      }
    ]
  },
  {
    id: "pipeline",
    name: "Interactive Lead Pipeline",
    desc: "Tracks listing leads, manages stage qualification status, and streams buyer chat logs.",
    metric: "Fast Pipelines",
    icon: KanbanSquare,
    badge: "Saves 4 hours",
    color: "indigo",
    examples: [
      {
        prompt: "Add lead named Sandra Bullock in New Stage interested in 3502 River Rd",
        description: "Configure new buyer profile and map them directly into the lead list."
      },
      {
        prompt: "Move lead David Vance to Qualified buyer stage",
        description: "Re-rank lead pipeline scores and advance interest state instantly."
      },
      {
        prompt: "Check active lead engagement across the pipeline logs",
        description: "Audit CRM dialogues to identify client prospects needing follow up."
      }
    ]
  },
  {
    id: "architect",
    name: "AI Ad Architect",
    desc: "Autonomously drafts and launches high-converting multi-channel ad copy and zip-targeted budgets with a strict 10% tech-fee logic.",
    metric: "Click Optimizer",
    icon: Megaphone,
    badge: "Saves 8 Hours",
    color: "sky",
    examples: [
      {
        prompt: "Construct high spend ad campaign budget $2500 for Austin Bouldin listing",
        description: "Write targeted social media ad headlines and copy structured with automated 10% tech-fee tiers."
      },
      {
        prompt: "Build targeted local Zipcode campaign for Mueller Green Block 4 with budget $1500",
        description: "Create local ad sets designed for modern eco-friendly development buyers."
      }
    ]
  },
  {
    id: "walks",
    name: "Video Studio Walks",
    desc: "Queues up active properties and auto-generates premier 15-second kinetic text-to-speech media descriptions using Gemini.",
    metric: "Visual Stitcher",
    icon: Video,
    badge: "Saves $450/video",
    color: "amber",
    examples: [
      {
        prompt: "Generate automatic video studio render for listing 1010 Ridge Ave",
        description: "Initiate visual rendering cues to auto-generate a luxury media script."
      },
      {
        prompt: "Render walkthrough video for Mueller Green Build Block 4",
        description: "Compose text-to-speech visual sequence directions using AI."
      }
    ]
  },
  {
    id: "staging",
    name: "AI Staging Studio",
    desc: "Advises on aesthetic virtual staging layouts, furniture profiles (e.g., Scandinavian, Industrial), and modern room transformations.",
    metric: "Style Architect",
    icon: Layers,
    badge: "Infinite Styles",
    color: "rose",
    examples: [
      {
        prompt: "Design minimalist modern virtual staging plan for 905 West Ave living room",
        description: "Get curated furniture specs and visual layout guidelines."
      },
      {
        prompt: "Draft luxury Scandinavian staging plan for Austin Penthouse",
        description: "Receive elite Nordic interior styling suggestions."
      }
    ]
  },
  {
    id: "campaigns",
    name: "Smart Campaigns",
    desc: "Configures hyper-targeted email sequences, automated texts, and ringless voice broadcasts.",
    metric: "Engage Flow",
    icon: SendToBack,
    badge: "Multi-channel",
    color: "emerald",
    examples: [
      {
        prompt: "Draft comprehensive, high-converting text follow-up series for active buyers",
        description: "Create responsive text marketing copy for hot buyer leads."
      },
      {
        prompt: "Suggest dynamic email newsletter templates for luxury properties",
        description: "Generate structured newsletter hooks and body copy."
      }
    ]
  },
  {
    id: "authority",
    name: "Local Authority SEO",
    desc: "Generates high-ranking localized Google My Business updates, advisory blogs, and community landing pages.",
    metric: "SEO Master",
    icon: TrendingUp,
    badge: "Saves 12 Hours",
    color: "blue",
    examples: [
      {
        prompt: "Create high-ranking local SEO landing page draft for Austin Westlake real estate",
        description: "Craft dense, localized landing page scripts targeting high value searches."
      },
      {
        prompt: "Write a Google My Business neighborhood branding post for Zilker listings",
        description: "Construct community profile copy optimized for local Zillow rankings."
      }
    ]
  },
  {
    id: "closer",
    name: "The Deal Closer AI",
    desc: "Provides deep psychological scripts for high-stakes fee objections, interest rate panic, and multi-bid negotiations.",
    metric: "Deal Anchoring",
    icon: Award,
    badge: "Closes Elite Deals",
    color: "yellow",
    examples: [
      {
        prompt: "Generate commission objection handler guide for luxury owners wanting a 1% listing fee",
        description: "Formulate elite response playbooks to preserve standard broker commissions."
      },
      {
        prompt: "Analyze buyer concerns on interest rate shocks to draft a closing pitch",
        description: "Construct premium rate objection handling text scripts."
      },
      {
        prompt: "Draft a multi-offer negotiations response letter to a premium purchase offer",
        description: "Maximize list premiums through tactical psychology scripts."
      }
    ]
  },
  {
    id: "copilot",
    name: "Mortgage Co-Pilot",
    desc: "Syndicates active preferred mortgage officers directly into tri-party closing agreements and tracks loan pre-approvals.",
    metric: "MLO Connector",
    icon: UserCheck,
    badge: "Saves 10 Hours",
    color: "purple",
    examples: [
      {
        prompt: "Invite top-tier mortgage loan officer partner named David Miller",
        description: "Onboard preferred mortgage advisor onto transaction channels."
      },
      {
        prompt: "Run mortgage criteria triage on lead Theresa Vance to analyze loan viability",
        description: "Examine lead debt-to-income and pre-approval metrics."
      }
    ]
  },
  {
    id: "receptionist",
    name: "Yard Voice Receps",
    desc: "Claims virtual phone signboards, configures QR routing, and updates localized speech scripts instantly.",
    metric: "Call Triage Engine",
    icon: PhoneCall,
    badge: "Saves $300/mo",
    color: "pink",
    examples: [
      {
        prompt: "Assign a virtual node tracking number for Main Sign Yard Board",
        description: "Claim trackable telephone line nodes for yard banners."
      },
      {
        prompt: "Configure dynamic voicenode tracking line for Seattle Yard QR",
        description: "Link sign-board call routing directions to specific Seattle area scripts."
      }
    ]
  },
  {
    id: "shield",
    name: "Regulatory Shield",
    desc: "Protects your license by automatically intercepting discriminatory familial, religious, and marital steering violations before ads go live.",
    metric: "HUD Shield Active",
    icon: ShieldAlert,
    badge: "Prevents $16k Fines",
    color: "red",
    examples: [
      {
        prompt: "Apply copy audit compliance check on: This elite property is perfect for single tech bros only",
        description: "Flag demographic restrictions and generate fair housing HUD rewrites."
      },
      {
        prompt: "Audit compliance copy for: Gorgeous quiet Christian neighborhood with exclusive gated access for wealthy buyers",
        description: "Sanitize discrimination violations and rewrite with objective local markers."
      }
    ]
  },
  {
    id: "retention",
    name: "Relocation Map / Client Retention",
    desc: "Visualizes historic client moving probabilities and computes home equity peaks to suggest proactive valuation outreach.",
    metric: "Client Retention Map",
    icon: CalendarDays,
    badge: "Predicts Equity",
    color: "cyan",
    examples: [
      {
        prompt: "Select past client Robert & Lisa Chen for predictive equity check-in campaign",
        description: "Assess community appreciation charts and draft friendly check-in copies."
      },
      {
        prompt: "Draft predictive relocation check-in for past client Steve McQueen",
        description: "Formulate proactive outbound letters using standard 7-year relocation timelines."
      }
    ]
  },
  {
    id: "billing",
    name: "Stripe Billing Tiers",
    desc: "Bypasses billing blocks, updates subscription plans, and resets system API webhooks in the sandbox.",
    metric: "Billing Safeguard",
    icon: CreditCard,
    badge: "By-pass Delinquency",
    color: "slate",
    examples: [
      {
        prompt: "Unlock delinquency and bypass billing guardrails to activate the tenant",
        description: "Force active billing tokens, bypassing system hold restrictions."
      },
      {
        prompt: "Upgrade current active tenant to Pro Team subscription tier",
        description: "Instantly elevate account capacity codes to Pro level."
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [dbState, setDbState] = useState<{
    tenants: Tenant[];
    leads: Lead[];
    chatLogs: ChatLog[];
    videoQueue: any[];
    phoneNodes: PhoneNode[];
    pastClients: PastClient[];
    campaigns: any[];
    mortgagePartners: any[];
  } | null>(null);

  // Tenant / Role simulator state
  const [selectedTenantId, setSelectedTenantId] = useState<string>("tenant-perryman");
  const [userRole, setUserRole] = useState<UserRole>(UserRole.BROKER_OWNER);
  const [errorMessage, setErrorMessage] = useState("");

  // AI autopilot terminal states
  const [aiConsoleOpen, setAiConsoleOpen] = useState(false);
  const [aiCommandText, setAiCommandText] = useState("");
  const [aiLogs, setAiLogs] = useState<{ text: string; isUser: boolean; timestamp: string }[]>([
    {
      text: "Welcome back! I am Perryman's Nexus-AI, built with the DNA of a world-class real estate powerhouse with a billion dollars in career sales. My mission is to save you massive amounts of time and a massive amount of money. Tell me what operation of the platform you would like to run (e.g., 'Unpaid subscription bypass', 'Add lead named Bobby Fischer', 'Rerender walkthroughs') and I will directly mutate the backend models and sync your dashboard instantly!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCapabilitiesExpanded, setAiCapabilitiesExpanded] = useState(false);
  const [aiOmniModalOpen, setAiOmniModalOpen] = useState(false);
  const [commandSearchQuery, setCommandSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [consoleActiveTab, setConsoleActiveTab] = useState<"capabilities" | "logs">("capabilities");
  const [consoleSearchQuery, setConsoleSearchQuery] = useState("");

  const handleDownloadSingleHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>The Deal Closer AI — Standalone Elite Suite</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
  :root {
    --gold: #C9A84C; --gold-light: #E2C47A; --gold-dim: #8a6f2e;
    --black: #0A0A0A; --dark: #111111; --card: #161616; --card2: #1C1C1C;
    --border: #2a2a2a; --text: #E8E2D6; --muted: #888;
    --red: #e05252; --green: #52c48a; --blue: #1d4ed8; --teal: #0d9488;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--black); color: var(--text);
    font-family: 'DM Sans', sans-serif; min-height: 100vh;
    background-image: 
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201, 168, 76, .09) 0%, transparent 70%),
      repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(201, 168, 76, .015) 80px, rgba(201, 168, 76, .015) 81px);
  }
  header { text-align: center; padding: 40px 20px 20px; }
  header h1 {
    font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 3rem);
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-dim) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px;
  }
  header p { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-dim); }
  .wrapper { max-width: 1200px; margin: 0 auto; padding: 20px; display: grid; grid-template-columns: 280px 1fr; gap: 30px; }
  @media(max-width: 900px) { .wrapper { grid-template-columns: 1fr; } }
  .sidebar { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; height: fit-content; }
  .sidebar-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); margin-bottom: 12px; font-weight: 700; }
  .tab-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  @media(max-width: 900px) { .tab-list { flex-direction: row; overflow-x: auto; padding-bottom: 8px; } }
  .tab-btn {
    width: 100%; text-align: left; padding: 12px 16px; border-radius: 10px; border: 1px solid transparent;
    background: transparent; color: var(--muted); cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 10px;
  }
  .tab-btn:hover { color: var(--gold-light); background: rgba(201, 168, 76, 0.05); }
  .tab-btn.active {
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.18), rgba(201, 168, 76, 0.05));
    color: var(--gold-light); border-color: rgba(201, 168, 76, 0.25);
  }
  .main-content { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 30px; min-height: 500px; }
  .panel { display: none; }
  .panel.active { display: block; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 14px; }
  .panel-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--gold-light); }
  .panel-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin-top: 4px; }
  
  /* Form elements */
  .fl { display: block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-dim); margin: 14px 0 6px; }
  input, select, textarea {
    width: 100%; background: var(--card2); border: 1px solid var(--border); border-radius: 8px;
    padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none; transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: rgba(201, 168, 76, 0.5); }
  button.submit-btn {
    background: linear-gradient(100deg, var(--gold) 0%, var(--gold-dim) 100%); color: #000;
    padding: 13px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; border: none; width: 100%;
    margin-top: 20px; font-size: 0.88rem; letter-spacing: 0.02em; transition: filter 0.2s;
  }
  button.submit-btn:hover { filter: brightness(1.15); }
  
  /* Calculator splits styling */
  .calc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
  .calc-card { background: var(--card2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-align: center; }
  .calc-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--gold-light); font-weight: 700; margin-top: 6px; }
  
  /* Objection cards */
  .objection-pill { padding: 10px 14px; background: var(--card2); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; text-align: left; width: 100%; }
  .objection-pill:hover { border-color: var(--gold-dim); background: rgba(201, 168, 76, 0.03); }
  
  /* Results section */
  .output-box { margin-top: 20px; background: var(--card2); border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 12px; overflow: hidden; }
  .output-header { background: rgba(201, 168, 76, 0.05); border-bottom: 1px solid var(--border); padding: 10px 16px; font-size: 0.65rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); display: flex; justify-content: space-between; }
  .output-body { padding: 20px; font-size: 0.88rem; line-height: 1.7; font-family: 'DM Sans', sans-serif; color: var(--text); white-space: pre-wrap; }
  
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 0.6rem; font-weight: bold; background: rgba(201, 168, 76, 0.1); color: var(--gold-light); border: 1px solid rgba(201, 168, 76, 0.2); }
</style>
</head>
<body>

<header>
  <h1>THE DEAL CLOSER AI</h1>
  <p>Standalone Executive Suite — 13 Billion-Dollar Real Estate Tools</p>
</header>

<div class="wrapper">
  <div class="sidebar">
    <div class="sidebar-title">Autonomous Toolkit</div>
    <ul class="tab-list">
      <li><button class="tab-btn active" onclick="switchTab('comm')">💰 Commission Splitting</button></li>
      <li><button class="tab-btn" onclick="switchTab('pipeline')">👤 Instant Lead Pipeline</button></li>
      <li><button class="tab-btn" onclick="switchTab('architect')">📣 Ad Copy Architect</button></li>
      <li><button class="tab-btn" onclick="switchTab('video')">🎬 Video Walkthroughs</button></li>
      <li><button class="tab-btn" onclick="switchTab('staging')">🏠 Virtual Staging Studio</button></li>
      <li><button class="tab-btn" onclick="switchTab('campaigns')">📧 Smart Campaign Drips</button></li>
      <li><button class="tab-btn" onclick="switchTab('seo')">📈 Local SEO Authority</button></li>
      <li><button class="tab-btn" onclick="switchTab('closer')">🤝 Master Closer Matrix</button></li>
      <li><button class="tab-btn" onclick="switchTab('copilot')">💼 Mortgage Co-Pilot</button></li>
      <li><button class="tab-btn" onclick="switchTab('yard')">📞 Yard Sign voicenodes</button></li>
      <li><button class="tab-btn" onclick="switchTab('shield')">🛡️ Regulatory HUD Shield</button></li>
      <li><button class="tab-btn" onclick="switchTab('retention')">📅 Proactive Client Relos</button></li>
      <li><button class="tab-btn" onclick="switchTab('billing')">💳 Delinquency Hold Bypass</button></li>
    </ul>
  </div>

  <div class="main-content">
    <!-- Tab 1: Commission Splits -->
    <div id="comm" class="panel active">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Commission Splitting Calculator</h2>
          <p class="panel-desc">Real-time split analytics. Modify values below to project net take-home earnings model.</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          <span class="fl">Sale Price ($)</span>
          <input type="number" id="salePrice" value="550000" oninput="runCommission()"/>
        </div>
        <div>
          <span class="fl">Commission Rate (%)</span>
          <input type="number" id="commRate" value="6" oninput="runCommission()"/>
        </div>
        <div>
          <span class="fl">Broker Distribution Split (%)</span>
          <input type="number" id="agentSplit" value="80" oninput="runCommission()"/>
        </div>
        <div>
          <span class="fl">Transaction Desk Fees ($)</span>
          <input type="number" id="deskFees" value="295" oninput="runCommission()"/>
        </div>
      </div>
      <div class="calc-grid">
        <div class="calc-card"><span class="fl">Gross Comm</span><div class="calc-num" id="grossComm">$33,000</div></div>
        <div class="calc-card"><span class="fl">Broker Share</span><div class="calc-num" id="brokerShare">$26,400</div></div>
        <div class="calc-card"><span class="fl">Take-Home (Net)</span><div class="calc-num" id="netTakeHome" style="color:var(--green);">$26,105</div></div>
      </div>
    </div>

    <!-- Tab 2: Lead Pipeline -->
    <div id="pipeline" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Instant Lead Pipeline Manager</h2>
          <p class="panel-desc">Mock lead tracking panel styled for rapid user qualification.</p>
        </div>
        <span class="badge">Saves 4 hrs/day</span>
      </div>
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <input type="text" id="newLeadName" placeholder="Enter new lead name (e.g. Bobby Fischer)..."/>
        <button onclick="addPipelineLead()" style="background:var(--gold); color:#000; border:none; padding:10px 20px; border-radius:8.5px; font-weight:bold; cursor:pointer;">+ Add Lead</button>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;" id="leadListContainer">
        <div style="background:var(--card2); border:1px solid var(--border); padding:16px; border-radius:10px;">
          <h4 style="color:var(--gold-light);">Sandra Bullock</h4>
          <span style="font-size:0.7rem; color:var(--muted); font-family: monospace;">Stage: New | Interest: 3502 River Rd</span>
        </div>
        <div style="background:var(--card2); border:1px solid var(--border); padding:16px; border-radius:10px;">
          <h4 style="color:var(--gold-light);">David Vance</h4>
          <span style="font-size:0.7rem; color:var(--muted); font-family: monospace;">Stage: Qualified Buyer</span>
        </div>
      </div>
    </div>

    <!-- Tab 3: Ad Copy Architect -->
    <div id="architect" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">AI Ad Architect Generator</h2>
          <p class="panel-desc">Construct highly-converting headlines and social copy targeting high intent buyers.</p>
        </div>
      </div>
      <span class="fl">Listing Address/Specs</span>
      <input type="text" id="adSpecs" value="905 West Ave, 2 Bed 2 Bath Modern Loft with private balcony"/>
      <span class="fl">Budget ($)</span>
      <input type="number" id="adBudget" value="2500" oninput="calcAdFees()"/>
      <div style="margin-top:10px; font-size:0.75rem; color:var(--muted);">Ad Spend Charge: <span id="adSpendCalc" style="color:var(--gold-light); font-weight:bold;">$2,250</span> | Platform 10% tech-fee: <span id="adFeesCalc" style="color:var(--gold-light); font-weight:bold;">$250</span></div>
      <button class="submit-btn" onclick="generateAdCopy()">Compile Copy Outputs ➔</button>
      <div class="output-box" style="display:none;" id="adOutBox">
        <div class="output-header"><span>📣 Ad Architect Compilation Code</span></div>
        <div class="output-body" id="adOutputText"></div>
      </div>
    </div>

    <!-- Tab 4: Video Walkthroughs -->
    <div id="video" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">walkthrough Renders Studio</h2>
          <p class="panel-desc">Queues properties and processes automatic kinetic media narration loops.</p>
        </div>
      </div>
      <span class="fl">Listing Reference</span>
      <input type="text" id="vidRef" value="1010 Ridge Ave, Austin TX"/>
      <button class="submit-btn" onclick="startVideoRenderSim()">Verify Render Queue ➔</button>
      <div style="margin-top:20px; display:none;" id="vidProgressBox">
        <span class="fl">Rendering Thread Execution</span>
        <div style="width:100%; border:1px solid var(--border); height:16px; border-radius:99px; overflow:hidden; background:#222; margin-top:8px;">
          <div id="vidProgressBar" style="width:0%; height:100%; background:linear-gradient(90deg, var(--teal), var(--gold)); transition:width 1s ease;"></div>
        </div>
        <p style="font-size:0.75rem; color:var(--muted); margin-top:8px;" id="vidStatusText">Queued in stream node...</p>
      </div>
    </div>

    <!-- Tab 5: Virtual Staging -->
    <div id="staging" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">AI Virtual Staging Advisor</h2>
          <p class="panel-desc">Provides staging layout guidance and stylistic advice.</p>
        </div>
      </div>
      <span class="fl">Select Room Profile</span>
      <select id="stageRoom">
        <option value="Living Room">Living Room</option>
        <option value="Primary Suite">Primary Bedroom Suite</option>
        <option value="Kitchen">Kitchen Space</option>
      </select>
      <span class="fl">Design Concept Mood</span>
      <select id="stageMood">
        <option value="Scandinavian Minimalist">Nordic Scandinavian Minimalist</option>
        <option value="High-Contrast Brutalist Industrial">High-Contrast Industrial Loft</option>
        <option value="Organic Premium Modernwood">Cozy Organic Boho Modern</option>
      </select>
      <button class="submit-btn" onclick="getStagingPlan()">Retrieve Staging Advice ➔</button>
      <div class="output-box" style="display:none;" id="stagingOutBox">
        <div class="output-header"><span>🏠 Curated Interior Design Specs</span></div>
        <div class="output-body" id="stagingOutputText"></div>
      </div>
    </div>

    <!-- Tab 6: Campaigns Drips -->
    <div id="campaigns" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Smart Campaigns Messaging Drips</h2>
          <p class="panel-desc">Configure automated, high-converting follow-up communications.</p>
        </div>
      </div>
      <span class="fl">Follow Up Channel</span>
      <select id="dripChannel">
        <option value="SMS Text Loop">SMS High-Speed Text Sequence</option>
        <option value="Email Newsletter">Premium Email Custom Newsletter</option>
      </select>
      <button class="submit-btn" onclick="getDripTemplates()">Generate Drip Script Copy ➔</button>
      <div class="output-box" style="display:none;" id="dripOutBox">
        <div class="output-header"><span>📧 Active Multi-Channel Marketing Playbook</span></div>
        <div class="output-body" id="dripOutputText"></div>
      </div>
    </div>

    <!-- Tab 7: Local SEO Engine -->
    <div id="seo" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Local SEO Authority Boost</h2>
          <p class="panel-desc">Attain localized top rankings and craft neighborhood lifestyle descriptions.</p>
        </div>
      </div>
      <span class="fl">target Area Neighborhood</span>
      <input type="text" id="seoArea" value="Austin Westlake & Zilker Park Area"/>
      <button class="submit-btn" onclick="generateSeoCopy()">Compile local Search Content ➔</button>
      <div class="output-box" style="display:none;" id="seoOutBox">
        <div class="output-header"><span>📈 Local Ranking Keyword Clusters & GMB Posts</span></div>
        <div class="output-body" id="seoOutputText"></div>
      </div>
    </div>

    <!-- Tab 8: Obstruction closer Matrix -->
    <div id="closer" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">The Deal Closer Objection Matrix</h2>
          <p class="panel-desc">Access psychological scripts to preserve commissions and handle transaction rate concerns.</p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button class="objection-pill" onclick="showClosingScript('obj-commission')">🔑 Seller: 'I want you to reduce your standard listing commission to 1%'</button>
        <button class="objection-pill" onclick="showClosingScript('obj-interest')">📈 Buyer: 'Interests rates are too volatile, I am stalling the purchase'</button>
        <button class="objection-pill" onclick="showClosingScript('obj-multioffer')">⚔️ Negotiator: 'We have received multiple bids, formulate standard premium escalation reply'</button>
      </div>
      <div class="output-box" style="display:none;" id="closerOutBox">
        <div class="output-header"><span>🧠 Psychological Objection Response script</span></div>
        <div class="output-body" id="closerOutputText" style="background:#0c0f13; border: 1px dashed rgba(201,168,76,0.3); font-family: monospace;"></div >
      </div>
    </div>

    <!-- Tab 9: Mortgage Co Pilot -->
    <div id="copilot" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Preferred Mortgage Co-Pilot</h2>
          <p class="panel-desc">Syndicate qualified loan officers directly into active client deals.</p>
        </div>
      </div>
      <span class="fl">Preferred Loan Partner</span>
      <input type="text" id="mloName" value="David Miller, Senior Residential Lending Officer"/>
      <button class="submit-btn" onclick="inviteMloPartner()">Invite and Link Partner ➔</button>
    </div>

    <!-- Tab 10: Yard Voice signs -->
    <div id="yard" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Yard Sign Virtual Receptionist</h2>
          <p class="panel-desc">Claim localized trackable signboard voicemail nodes instantly.</p>
        </div>
      </div>
      <span class="fl">Location Site Registry</span>
      <input type="text" id="yardSignLabel" value="Seattle West Lake sign flyer QR board"/>
      <button class="submit-btn" onclick="registerYardNode()">Deploy Call Tracking Node ➔</button>
    </div>

    <!-- Tab 11: HUD Shield -->
    <div id="shield" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">HUD Regulatory Fair Housing Shield</h2>
          <p class="panel-desc">Analyze and rewrite copy containing demographic steering triggers.</p>
        </div>
      </div>
      <span class="fl">Marketing Description Copy</span>
      <textarea id="shieldCopy">Perfect luxury master studio for single young tech bachelors. Exclusive Christian retirement complex.</textarea>
      <button class="submit-btn" onclick="verifyHUDShield()">Apply Regulatory Copy Audit ➔</button>
      <div class="output-box" style="display:none;" id="shieldOutBox">
        <div class="output-header"><span>🛡️ Regulatory Compliance Flag Report</span></div>
        <div class="output-body" id="shieldOutputText" style="color:var(--red);"></div>
      </div>
    </div>

    <!-- Tab 12: Predict Relos -->
    <div id="retention" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Client Retention Relocation Modeler</h2>
          <p class="panel-desc">Tracks move likelihood thresholds based on community transaction durations.</p>
        </div>
      </div>
      <span class="fl">Past Buyer Registry</span>
      <select id="pastClientSelect">
        <option value="Chen">Robert & Lisa Chen (Homeowner since 2018)</option>
        <option value="Steve">Steve McQueen (Homeowner since 2019)</option>
      </select>
      <button class="submit-btn" onclick="runReloPrediction()">Compute Home Equity Relocation Score ➔</button>
      <div class="output-box" style="display:none;" id="reloOutBox">
        <div class="output-header"><span>📅 Community Tenure relocation Forecast</span></div>
        <div class="output-body" id="reloOutputText"></div>
      </div>
    </div>

    <!-- Tab 13: Billing Bypass -->
    <div id="billing" class="panel">
      <div class="title-row">
        <div>
          <h2 class="panel-title">Delinquency Hold Bypass Safeguard</h2>
          <p class="panel-desc">Release sandbox system locks and bypass billing delinquency codes.</p>
        </div>
      </div>
      <button class="submit-btn" onclick="bypassBillingSandbox()" style="background:var(--red); color:#fff;">Force Active Guardrail Bypass 🔓</button>
    </div>
  </div>
</div>

<footer>
  <p>&copy; The Deal Closer AI. All capabilities run client-side. Created for elite independent real estate brokers. <span>⚜️</span></p>
</footer>

<script>
  function switchTab(tabId) {
    var tabs = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.panel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    
    // find correct list button
    for (var btn of tabs) {
      if (btn.getAttribute('onclick').includes(tabId)) {
        btn.classList.add('active');
        break;
      }
    }
    document.getElementById(tabId).classList.add('active');
  }

  /* Calculations splits formulas */
  function runCommission() {
    var price = parseFloat(document.getElementById('salePrice').value) || 0;
    var rate = parseFloat(document.getElementById('commRate').value) || 0;
    var split = parseFloat(document.getElementById('agentSplit').value) || 0;
    var fees = parseFloat(document.getElementById('deskFees').value) || 0;
    
    var gross = price * (rate / 100);
    var brokerShare = gross * (split / 100);
    var net = brokerShare - fees;
    
    var fmt = function(v){ return '$' + Math.max(0, Math.round(v)).toLocaleString('en-US'); };
    document.getElementById('grossComm').textContent = fmt(gross);
    document.getElementById('brokerShare').textContent = fmt(brokerShare);
    document.getElementById('netTakeHome').textContent = fmt(net);
  }

  /* Lead addition demo script */
  function addPipelineLead() {
    var name = document.getElementById('newLeadName').value.trim();
    if (!name) { alert('Specify lead name.'); return; }
    var container = document.getElementById('leadListContainer');
    var div = document.createElement('div');
    div.style = "background:var(--card2); border:1px solid var(--border); padding:16px; border-radius:10px;";
    div.innerHTML = "<h4 style='color:var(--gold-light);'>" + name + "</h4><span style='font-size:0.7rem; color:var(--muted); font-family: monospace;'>Stage: New | Interest: Standalone Mock Deal</span>";
    container.insertBefore(div, container.firstChild);
    document.getElementById('newLeadName').value = '';
    alert('Lead added successfully to pipeline list!');
  }

  /* Ad calculations */
  function calcAdFees() {
    var budget = parseFloat(document.getElementById('adBudget').value) || 0;
    var spend = budget * 0.9;
    var techFee = budget * 0.1;
    document.getElementById('adSpendCalc').textContent = '$' + Math.round(spend).toLocaleString();
    document.getElementById('adFeesCalc').textContent = '$' + Math.round(techFee).toLocaleString();
  }

  function generateAdCopy() {
    var specs = document.getElementById('adSpecs').value;
    var budget = document.getElementById('adBudget').value;
    var outBox = document.getElementById('adOutBox');
    outBox.style.display = 'block';
    document.getElementById('adOutputText').textContent = 
      "[PROMOTIONAL EVENT HEADING]\\n🏡 ARCHITECTURAL MASTERPIECE ALERT — ACT NOW!\\n\\n" +
      "[COPY BODY DECK]\\nWelcome to high-fidelity living at " + specs + ". " +
      "Optimized with standard list segmentation values, this premier property features " +
      "open-concept floor plans, beautiful light, high ceiling architectures, and custom staging elements.\\n\\n" +
      "[META CAMPAIGN ALLOCATIVE STATS]\\n- High Spend Budget Track: $" + budget + "\\n" +
      "- Isolated Net Media Spend (90%): $" + Math.round(budget*0.9) + "\\n" +
      "- Required Technical Platform Fee (10%): $" + Math.round(budget*0.1) + "\\n" +
      "- Targeting Parameters: Local high income zipcodes & modern design interest groups.";
  }

  /* Video Studio walks */
  function startVideoRenderSim() {
    var bar = document.getElementById('vidProgressBar');
    var text = document.getElementById('vidStatusText');
    document.getElementById('vidProgressBox').style.display = 'block';
    
    var progress = 0;
    bar.style.width = '0%';
    text.textContent = 'Spinning rendering stream nodes. Fetching active property layout...';
    
    var interval = setInterval(function() {
      progress += 20;
      bar.style.width = progress + '%';
      
      if (progress === 40) {
        text.textContent = 'Stitching high-fidelity MLS textures & floorplan layouts...';
      } else if (progress === 80) {
        text.textContent = 'Applying kinetic captions & synthesizing text-to-speech voiceovers...';
      } else if (progress >= 100) {
        clearInterval(interval);
        text.textContent = '✅ Rendering Complete! Your video is live in media feeds (15s duration).';
      }
    }, 450);
  }

  /* Staging Advice scripts */
  function getStagingPlan() {
    var room = document.getElementById('stageRoom').value;
    var mood = document.getElementById('stageMood').value;
    var outBox = document.getElementById('stagingOutBox');
    outBox.style.display = 'block';
    document.getElementById('stagingOutputText').innerHTML = 
      "<p style='margin-bottom:10px;'><strong>🏡 Virtual Staging Specification Profile for: " + room + " (" + mood + ")</strong></p>" +
      "<p style='color:var(--gold-light);'>1. Color Coordinates:</p>" +
      "<p style='margin-bottom:10px; color:#ddd; font-size:0.8rem;'>Incorporate cozy warm neutrals paired with subtle gold metal fixtures and clean dark oak lines.</p>" +
      "<p style='color:var(--gold-light);'>2. Furniture Selection Details:</p>" +
      "<p style='color:#ddd; font-size:0.8rem;'>Install simple modular designer sofas, floating wooden bookshelves, and geometric low-glare reading lamps to maintain high perception scores.</p>";
  }

  /* Campaigns scripts */
  function getDripTemplates() {
    var channel = document.getElementById('dripChannel').value;
    var outBox = document.getElementById('dripOutBox');
    outBox.style.display = 'block';
    document.getElementById('dripOutputText').textContent = 
      "[DRIFT TEMPLATE SEQUENCE 1 — SENT INSTANTLY]\\n" +
      "Hey! Thanks for inquiring about our newest listings. This is " +
      "the Deal Closer Smart AI agent. What are your ideal counts for bedroom and bath sizes? I can sync matches instantly.\\n\\n" +
      "[DRIFT TEMPLATE SEQUENCE 2 — SENT +24 HOURS]\\n" +
      "Hi there! I just sent over three luxury modern home portfolios with high appreciation ratings. " +
      "Would you like to schedule an private virtual walkthrough this Thursday at 4 PM?";
  }

  /* SEO script */
  function generateSeoCopy() {
    var area = document.getElementById('seoArea').value;
    var outBox = document.getElementById('seoOutBox');
    outBox.style.display = 'block';
    document.getElementById('seoOutputText').textContent = 
      "[TARGET HIGH VALUE SEO KEYWORDS]\\n" +
      "1. '" + area + " Homes For Sale' (High Vol)\\n" +
      "2. '" + area + " Premium Luxury Realtors' (Low Difficulty)\\n\\n" +
      "[GOOGLE MY BUSINESS SOCIAL UPDATE POST COPY]\\n" +
      "🏡 Discover unparalleled architectural craftsmanship in beautiful " + area + "! " +
      "From scenic quiet paths to local modern eateries, this neighborhood boasts a gorgeous lifestyle " +
      "and solid equity appreciation growth. Read our detailed area guide to view recent listings!";
  }

  /* CLOSING OBJECTION DICTIONARY */
  function showClosingScript(type) {
    var outBox = document.getElementById('closerOutBox');
    var textEl = document.getElementById('closerOutputText');
    outBox.style.display = 'block';
    
    if (type === 'obj-commission') {
      textEl.textContent = 
        "[⚜️ PSYCHOLOGICAL POSITIONING STATEMENT]\\n" +
        "You state: 'I completely understand your desire to maximize net take home funds. However, " +
        "reducing our marketing resources means compromising buyer visibility, which ultimately drops your final " +
        "sales premium by far more than 1-2%. Our career 98.7% listing close rate preserves your net wealth.'\\n\\n" +
        "[🔥 OBJECTION OVERTURNING SCRIPT]\\n" +
        "Agent: 'Mr. Seller, agents who discount their standard fee are negotiating from weakness. If they " +
        "cannot defend their own business fee in private, how can they aggressively defend your price premium " +
        "against buyer objections.'";
    } else if (type === 'obj-interest') {
      textEl.textContent = 
        "[⚜️ FINANCIAL TRANSFORMATION PLAYBOOK]\\n" +
        "You state: 'Marry the house, date the rate. History displays that mortgage rates fluctuates. " +
        "Securing a high potential property now while buyer competition is low prevents a multi-offer bid war " +
        "when rate cycles descend. Refinancing later is a simple, cost-effective administrative process.'\\n\\n" +
        "[🔥 ACTIONABLE VALUE CLOSING VALUE]\\n" +
        "Agent: 'A 1% drop in rates brings massive influxes of first time buyers into Westlake. Buying " +
        "at current market valuations secures lower entry leverage pricing, locking-in equity buffer benefits instantly.'";
    } else {
      textEl.textContent = 
        "[⚜️ ACTIVE MULTI-BID ESCALATION DECK]\\n" +
        "You state: 'To preserve transaction transparency, we request buyers to submit highest-best terms of " +
        "interest by Wednesday. Our escalation clause maintains high buyer security offsets.'\\n\\n" +
        "[🔥 AIRTIGHT ESCALATION LANGUAGE]\\n" +
        "Text: 'Seller agrees to accept purchase terms, matching competitor premiums by increments of $3,500, " +
        "not exceeding the cap limit. Provide verifiable copy proof of alternate competitive terms.'";
    }
  }

  /* Loan co pilot invitation */
  function inviteMloPartner() {
    var name = document.getElementById('mloName').value;
    alert('✅ Preferred Mortgage Officer: ' + name + ' is linked! Standard pre-approval triggers are mapped.');
  }

  /* Yard setup */
  function registerYardNode() {
    var lbl = document.getElementById('yardSignLabel').value;
    alert('✅ Voicenode claimed successfully! Tracking line: +1 (800) 555-REAL mapped to: ' + lbl);
  }

  /* Compliance Checker HUD Shield */
  function verifyHUDShield() {
    var copy = document.getElementById('shieldCopy').value;
    var outBox = document.getElementById('shieldOutBox');
    outBox.style.display = 'block';
    
    var hasSingle = /single/i.test(copy);
    var hasChristian = /christian/i.test(copy);
    var hasTechBros = /tech bros/i.test(copy);
    
    if (hasSingle || hasChristian || hasTechBros) {
      document.getElementById('shieldOutputText').innerHTML = 
        "<p style='color:var(--red); font-weight:bold;'>⚠️ COMPLIANCE VIOLATION DETECTED (Fair Housing Audit)</p>" +
        "<p style='font-size:0.8rem; margin-top:8px;'>Flagged Demographic steering terms: " + 
        (hasSingle ? '[single] ' : '') + (hasChristian ? '[christian] ' : '') + (hasTechBros ? '[young tech bachelors] ' : '') + "</p>" +
        "<p style='color:#bbb; font-size:0.8rem; margin-top:10px;'><strong>Proposed HUD Compliant Rewrite:</strong></p>" +
        "<p style='color:var(--green); font-size:0.82rem;'>'Stunning, spacious professional property featuring quiet residential neighborhood access and modern appliances. Welcome to all qualified real-estate seekers, in compliance with federal guidelines.'</p>";
    } else {
      document.getElementById('shieldOutputText').innerHTML = 
        "<p style='color:var(--green);'>✅ CONGRATULATIONS! No direct Steering risk signals identified. Copy complies with HUD standards.</p>";
    }
  }

  /* Proactive relocations */
  function runReloPrediction() {
    var client = document.getElementById('pastClientSelect').value;
    var outBox = document.getElementById('reloOutBox');
    outBox.style.display = 'block';
    
    if (client === 'Chen') {
      document.getElementById('reloOutputText').textContent = 
        "Past Client: Robert & Lisa Chen\\n" +
        "Holding Period: 8 Years (National average: 7.2 yrs)\\n" +
        "Projected Equity Appreciation: $184,500 (+33.5%)\\n" +
        "Proactive Move Rating: 🎯 94% (High relocate hazard)\\n\\n" +
        "[SUGGESTED TOUCH POINT TEXT DRIFT]\\n" +
        "Hi Robert & Lisa! It's been 8 years since we closed on your property. " +
        "Zilker home values popped other 12% last season. Would you like a fresh, complimentary " +
        "home equity study packet to see what your home is worth today?";
    } else {
      document.getElementById('reloOutputText').textContent = 
        "Past Client: Steve McQueen\\n" +
        "Holding Period: 7 Years\\n" +
        "Projected Equity Appreciation: $141,000 (+26.2%)\\n" +
        "Proactive Move Rating: ⚠️ 78% (Moderate profile)\\n\\n" +
        "[SUGGESTED TOUCH POINT TEXT DRIFT]\\n" +
        "Hi Steve! We are compiling home appreciation counts in your area this morning. " +
        "Your property value has accrued over $140,000 in equity. Let's touch base soon!";
    }
  }

  /* Sandbox Billing Bypass */
  function bypassBillingSandbox() {
    alert('🔓 Billing Delinquency codes cleared successfully! Tenant set back to ACTIVE. Refreshing nodes...');
  }
</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perryman_toolkit_arsenal.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAiCommandSubmit = async (e?: React.FormEvent, presetCommand?: string) => {
    if (e) e.preventDefault();
    const activeCommand = presetCommand || aiCommandText;
    if (!activeCommand.trim()) return;

    setAiCommandText("");
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiLogs(prev => [...prev, { text: activeCommand, isUser: true, timestamp: userTime }]);
    setAiLoading(true);

    try {
      const response = await fetch("/api/ai-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: activeCommand,
          tenant_id: selectedTenantId
        })
      });

      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (response.ok) {
        const data = await response.json();
        setAiLogs(prev => [...prev, { 
          text: data.explanation || "System command parsed and database models updated.", 
          isUser: false, 
          timestamp: responseTime 
        }]);
        fetchState();
      } else {
        setAiLogs(prev => [...prev, { 
          text: "Hold error: Autonomous command could not be routed.", 
          isUser: false, 
          timestamp: responseTime 
        }]);
      }
    } catch (err: any) {
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAiLogs(prev => [...prev, { 
        text: `Secure stream error: ${err.message}`, 
        isUser: false, 
        timestamp: responseTime 
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      if (response.ok) {
        const data = await response.json();
        setDbState(data);
      } else {
        setErrorMessage("Failed to establish server secure stream context.");
      }
    } catch (err: any) {
      setErrorMessage(`No connection to full-stack Express server. Please verify dev server is listening. Error: ${err.message}`);
    }
  };

  // Run on start
  useEffect(() => {
    fetchState();
  }, []);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#040C08] text-[#f4f0e6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md p-6 bg-[#0b1411] border border-[#d4af37] rounded-xl space-y-4 shadow-sm shadow-[#d4af37]/10">
          <AlertTriangle className="h-10 w-10 text-[#ffd700] mx-auto animate-bounce" />
          <h2 className="text-[#ffd700] font-extrabold text-sm uppercase font-mono tracking-wider">Server Connection Hold</h2>
          <p className="text-red-400 text-xs leading-relaxed font-semibold">
            {errorMessage}
          </p>
          <button
            onClick={fetchState}
            className="px-4 py-2 bg-[#154734] hover:bg-[#2e6f40] text-[#ffd700] border border-[#d4af37] font-bold text-xs rounded transition-all cursor-pointer shadow-sm"
          >
            Retry Connecting
          </button>
        </div>
      </div>
    );
  }

  if (!dbState) {
    return (
      <div className="min-h-screen bg-[#040C08] text-[#f4f0e6] flex flex-col items-center justify-center font-sans text-xs">
        <div className="h-8 w-8 border-2 border-[#d4af37]/30 border-t-[#ffd700] rounded-full animate-spin mb-4" />
        <span className="font-semibold text-[#85bb65]">Initializing full-stack Perryman's Nexus-AI Sandbox environments...</span>
      </div>
    );
  }

  const currentTenant = dbState.tenants.find((t) => t.id === selectedTenantId) || dbState.tenants[0];

  // Site-wide delinquency block check
  const isDelinquent = currentTenant.billing_status === "Delinquent";

  // Filter leads/logs/nodes mapped specifically to active tenants (Strict Isolate)
  const tenantLeads = dbState.leads.filter((l) => l.tenant_id === currentTenant.id);
  const tenantCampaigns = dbState.campaigns.filter((c) => c.tenant_id === currentTenant.id);
  const tenantPhoneNodes = dbState.phoneNodes.filter((p) => p.tenant_id === currentTenant.id);
  const tenantPastClients = dbState.pastClients.filter((c) => c.tenant_id === currentTenant.id);

  const handleUpdateStage = async (leadId: string, stage: any) => {
    try {
      const response = await fetch("/api/leads/update-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, stage })
      });
      if (response.ok) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Control Center", icon: LayoutDashboard },
    { id: "pipeline", label: "Interactive Pipeline", icon: KanbanSquare },
    { id: "architect", label: "AI Ad Architect", icon: Megaphone },
    { id: "walks", label: "Video Studio Walks", icon: Video },
    { id: "staging", label: "AI Staging Studio", icon: Layers },
    { id: "campaigns", label: "Smart Campaigns", icon: SendToBack },
    { id: "authority", label: "Local Authority SEO", icon: TrendingUp },
    { id: "closer", label: "The Deal Closer AI", icon: Award },
    { id: "copilot", label: "Mortgage Co-Pilot", icon: UserCheck },
    { id: "receptionist", label: "Yard Voice Receps", icon: PhoneCall },
    { id: "shield", label: "Regulatory Shield", icon: ShieldAlert },
    { id: "retention", label: "Relocation Map", icon: CalendarDays },
    { id: "billing", label: "Stripe Billing Tiers", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-[#040C08] text-[#f4f0e6] flex flex-col font-sans">
      
      {activeTab === "landing" ? (
        <LandingPage onEnterDashboard={() => {
          if (isDelinquent) {
            setActiveTab("billing");
          } else {
            setActiveTab("dashboard");
          }
        }} />
      ) : (
        <div className="flex-1 flex flex-col">
          
          {/* Global Multi-Tenant and RBAC selection Bar - Institutional Dark Slate Style */}
          <section className="bg-[#0F172A] border-b border-slate-800 px-6 py-3.5 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Branding and Tab switcher */}
              <div className="flex items-center gap-4.5">
                <div onClick={() => setActiveTab("landing")} className="cursor-pointer">
                  <PerrymansLogo iconSize={34} textColorMode="light" />
                </div>
                
                <div className="h-5 w-px bg-slate-850" />

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase select-none mr-2">Tenant Profile:</span>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => {
                      setSelectedTenantId(e.target.value);
                      fetchState();
                    }}
                    className="bg-[#1E293B] border border-slate-700/60 rounded text-slate-200 text-xs px-2.5 py-1 font-mono focus:outline-none"
                  >
                    {dbState.tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subscription_tier}) - {t.billing_status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Roles Simulator and Settings check */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto md:justify-end">
                <div className="flex items-center gap-1.5 bg-[#1E293B] border border-slate-700/60 rounded px-2.5 py-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">ROLE RBAC:</span>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="bg-transparent text-slate-100 text-[11px] font-semibold border-none focus:outline-none focus:ring-0"
                  >
                    <option value={UserRole.BROKER_OWNER} className="bg-[#1E293B]">{UserRole.BROKER_OWNER}</option>
                    <option value={UserRole.AGENT} className="bg-[#1E293B]">{UserRole.AGENT}</option>
                    <option value={UserRole.MORTGAGE_PARTNER} className="bg-[#1E293B]">{UserRole.MORTGAGE_PARTNER}</option>
                    <option value={UserRole.SYS_ADMIN} className="bg-[#1E293B]">{UserRole.SYS_ADMIN}</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-[#1E293B] text-teal-400 text-[10px] rounded font-mono border border-slate-700/60 shadow">
                    Vault: Active Sync
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab("landing");
                    }}
                    className="px-2.5 py-1 bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white text-[10px] rounded font-mono border border-slate-700/60 transition-all font-semibold"
                  >
                    Welcome Page
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Site-wide Delinquency Billing Guardrail block */}
          {isDelinquent && activeTab !== "billing" ? (
            <div className="max-w-7xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-full text-red-600 animate-pulse">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <div className="space-y-2 max-w-lg">
                <h2 className="text-slate-900 font-bold text-2xl tracking-tight">Enterprise Suite Blocked</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your tenant account billing state for <span className="font-semibold text-slate-900">"{currentTenant.name}"</span> has defaulted as delinquency/unpaid under our standard index. Webhooks have been suspended.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("billing")}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-teal-600/20"
                >
                  Resolve delinquency securely via Stripe Sandbox
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
              
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-3 space-y-4">
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4.5 space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] px-2 mb-2">
                    Suite Nav Controls
                  </span>
                  
                  {navItems.map((item) => {
                    const isCurrent = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (isDelinquent && item.id !== "billing") return;
                          setActiveTab(item.id);
                        }}
                        disabled={isDelinquent && item.id !== "billing"}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold select-none transition-all duration-200 border ${
                          isCurrent
                            ? "bg-slate-100 border-slate-200 text-slate-900 shadow-sm font-bold"
                            : isDelinquent && item.id !== "billing"
                              ? "opacity-35 text-slate-400 cursor-not-allowed border-transparent"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-slate-100/50"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isCurrent ? "text-teal-600" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-slate-900 text-white p-4.5 rounded-xl space-y-2.5 font-mono text-[10.5px] border border-slate-800 shadow-sm">
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2">Billion Dollar AI Workspace</p>
                  
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Tenant Sub Level:</span>
                    <p className="text-slate-100 font-bold text-xs">{currentTenant.subscription_tier}</p>
                  </div>
                  
                  <div className="border-t border-slate-800/80 my-2" />
                  
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Tech Automation Fee:</span>
                    <p className="text-teal-400 font-bold text-xs">${currentTenant.tech_fee_balance.toLocaleString()}</p>
                  </div>
                </div>
              </aside>

              {/* Dynamic Workspace Canvas content router */}
              <section className="lg:col-span-9">
                {activeTab === "dashboard" && <ControlCenter currentTenant={currentTenant} />}
                
                {activeTab === "pipeline" && (
                  <PipelineBoard
                    leads={tenantLeads}
                    chatLogs={dbState.chatLogs}
                    onRefresh={fetchState}
                    onUpdateStage={handleUpdateStage}
                  />
                )}

                {activeTab === "architect" && (
                  <AdArchitect
                    currentTenant={currentTenant}
                    campaigns={tenantCampaigns}
                    onRefresh={fetchState}
                  />
                )}

                {activeTab === "walks" && (
                  <VideoStudio
                    videoQueue={dbState.videoQueue}
                    onRefresh={fetchState}
                  />
                )}

                {activeTab === "staging" && (
                  <VirtualStaging />
                )}

                {activeTab === "campaigns" && (
                  <SmartCampaigns />
                )}

                {activeTab === "authority" && (
                  <AuthorityEngine />
                )}

                {activeTab === "closer" && (
                  <DealCloserAI />
                )}

                {activeTab === "copilot" && (
                  <CoPilotEngine
                    currentTenant={currentTenant}
                    mortgagePartners={dbState.mortgagePartners}
                    onInvitedPartner={fetchState}
                  />
                )}

                {activeTab === "receptionist" && (
                  <VoiceReceptionist
                    currentTenant={currentTenant}
                    phoneNodes={tenantPhoneNodes}
                    onRefresh={fetchState}
                    onAddedNode={fetchState}
                  />
                )}

                {activeTab === "shield" && (
                  <RegulatoryShield />
                )}

                {activeTab === "retention" && (
                  <RetentionEngine
                    pastClients={tenantPastClients}
                    onRefresh={fetchState}
                  />
                )}

                {activeTab === "billing" && (
                  <StripeBilling
                    currentTenant={currentTenant}
                    onSubscriptionUpdated={fetchState}
                    onRefresh={fetchState}
                  />
                )}
              </section>

            </div>
          )}

        </div>
      )}
            {/* AUTONOMOUS REAL-TIME AI PILOT COMMAND STATION */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {aiConsoleOpen ? (
          <div className="bg-slate-900 text-slate-100 border border-slate-700/80 rounded-2xl shadow-2xl w-[380px] md:w-[440px] overflow-hidden flex flex-col h-[580px] transition-all duration-300">
            {/* Console Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-850 flex justify-between items-center animate-fadeIn animate-duration-300 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg animate-pulse">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-[11.5px] font-bold text-white uppercase tracking-wider">Perryman's Autopilot</h5>
                  <p className="text-[9px] text-slate-400 tracking-tight">Full Platform Executive Commander</p>
                </div>
              </div>
              <button 
                onClick={() => setAiConsoleOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Console Tabs */}
            <div className="bg-slate-950 border-b border-slate-800 flex text-xs shrink-0 select-none">
              <button
                type="button"
                onClick={() => setConsoleActiveTab("capabilities")}
                className={`flex-1 py-3 text-center font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  consoleActiveTab === "capabilities"
                    ? "border-teal-500 text-teal-400 bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:bg-slate-900/20 hover:text-slate-350"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                <span>See What I Can Do</span>
              </button>
              <button
                type="button"
                onClick={() => setConsoleActiveTab("logs")}
                className={`flex-1 py-3 text-center font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  consoleActiveTab === "logs"
                    ? "border-emerald-500 text-emerald-400 bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:bg-slate-900/20 hover:text-slate-350"
                }`}
              >
                <Bot className="h-3.5 w-3.5 text-emerald-500" />
                <span>Execution Logs ({aiLogs.length})</span>
              </button>
            </div>

            {/* Panel Body Rendering */}
            {consoleActiveTab === "capabilities" ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Term Bar inside drawer */}
                <div className="px-3 py-2 bg-slate-950 border-b border-slate-850 flex items-center shrink-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search 13 automation molecules..."
                      value={consoleSearchQuery}
                      onChange={(e) => setConsoleSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                    />
                    {consoleSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setConsoleSearchQuery("")}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-white text-[10px]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Molecule Items Scroll Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin bg-slate-950/20">
                  {AI_TOOLS_INDEX.filter((tool) => {
                    const s = consoleSearchQuery.toLowerCase();
                    return tool.name.toLowerCase().includes(s) || tool.desc.toLowerCase().includes(s) || tool.metric.toLowerCase().includes(s);
                  }).map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-950 text-teal-400 rounded-lg">
                                <ToolIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-[11px] font-bold text-white leading-none">{tool.name}</h4>
                                <span className="text-[7.5px] text-slate-500 font-mono tracking-tight">{tool.metric}</span>
                              </div>
                            </div>
                            <span className="text-[7.5px] font-bold text-teal-400 font-mono px-1.5 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-md">
                              {tool.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">{tool.desc}</p>
                        </div>

                        {/* Dropdown-style Examples lists (at least two for each molecule) */}
                        <div className="mt-2.5 pt-2 border-t border-slate-850/60 space-y-1.5">
                          {tool.examples.map((ex, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setConsoleActiveTab("logs");
                                handleAiCommandSubmit(undefined, ex.prompt);
                              }}
                              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-teal-500/30 p-2 rounded-lg text-left transition-all flex items-center justify-between gap-1.5 group cursor-pointer"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-[9.5px] font-bold text-slate-200 group-hover:text-teal-400 truncate">
                                  "{ex.prompt}"
                                </p>
                                <p className="text-[8px] text-slate-500 group-hover:text-amber-400/80 truncate">
                                  {ex.description}
                                </p>
                              </div>
                              <div className="p-1 bg-slate-900 border border-slate-800 rounded group-hover:border-teal-500/40 text-slate-400 group-hover:text-teal-400 shrink-0">
                                <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {AI_TOOLS_INDEX.filter((tool) => {
                    const s = consoleSearchQuery.toLowerCase();
                    return tool.name.toLowerCase().includes(s) || tool.desc.toLowerCase().includes(s) || tool.metric.toLowerCase().includes(s);
                  }).length === 0 && (
                    <div className="p-8 text-center bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
                      <Search className="h-6 w-6 text-slate-600 mx-auto mb-2 animate-bounce" />
                      <p className="text-xs font-bold text-slate-300">No molecules found</p>
                      <p className="text-[10px] text-slate-500">Simplify your term and search again.</p>
                    </div>
                  )}
                </div>

                {/* Footer and standalone launcher shortcut */}
                <div className="bg-slate-950 px-3 py-2 border-t border-slate-850 flex justify-between items-center text-[9px] text-slate-500 font-sans select-none shrink-0 font-mono uppercase tracking-wider">
                  <span>100% Automated Platform</span>
                  <button 
                    type="button"
                    onClick={() => setAiOmniModalOpen(true)}
                    className="text-[#d4af37] hover:text-[#ffd700] hover:underline font-bold flex items-center gap-1 cursor-pointer font-sans"
                  >
                    All Tools Grid ➔
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Console Output Terminal */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[10.5px] bg-slate-950/45 scrollbar-thin">
                  {aiLogs.map((log, idx) => (
                    <div key={idx} className={`flex flex-col ${log.isUser ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                        log.isUser 
                          ? "bg-teal-600 text-white text-right rounded-tr-none font-sans" 
                          : "bg-[#1E293B] text-slate-100 border border-slate-800/80 rounded-tl-none font-sans leading-relaxed text-left whitespace-pre-wrap"
                      }`}>
                        {!log.isUser && (
                          <div className="flex items-center gap-1.5 mb-1.5 text-teal-400 font-bold uppercase tracking-wider text-[9px] font-mono select-none">
                            <Bot className="h-3 w-3 shrink-0" />
                            <span>Nexus-AI Core</span>
                          </div>
                        )}
                        {log.text}
                      </div>
                      <span className="text-[8px] text-slate-500 mt-1 px-1 font-mono">{log.timestamp}</span>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex items-center gap-2.5 text-teal-400 font-sans tracking-wide text-xs bg-slate-900 border border-slate-800 p-3 rounded-lg animate-pulse">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-400 shrink-0" />
                      <span>Nexus-AI Core is routing database instructions...</span>
                    </div>
                  )}
                </div>

                {/* Unified interactive input with toggle back button */}
                <form onSubmit={handleAiCommandSubmit} className="bg-slate-950 border-t border-slate-850 p-2.5 flex flex-col gap-2 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiCommandText}
                      onChange={(e) => setAiCommandText(e.target.value)}
                      placeholder="Tell Nexus-AI to execute anything..."
                      className="flex-1 bg-[#1E293B] border border-slate-700/60 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-sans tracking-wide text-slate-100 placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-xl transition-all cursor-pointer shadow shadow-teal-900/40 shrink-0 flex items-center justify-center w-8 h-8"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1 text-[9px] text-slate-550 select-none">
                    <span>Ask questions or type manually</span>
                    <button
                      type="button"
                      onClick={() => setConsoleActiveTab("capabilities")}
                      className="text-teal-400 hover:text-teal-300 font-bold hover:underline cursor-pointer"
                    >
                      ← Back to capabilities list
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setAiConsoleOpen(true)}
            className="bg-[#0F172A] hover:bg-slate-850 text-white border-2 border-teal-500/80 rounded-full px-5 py-3 shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all text-xs font-bold uppercase tracking-wider select-none animate-bounce cursor-pointer animate-duration-1000"
          >
            <div className="relative">
              <Bot className="h-4.5 w-4.5 text-teal-400" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full animate-ping" />
            </div>
            <span>⚡ AI Autopilot Commander</span>
          </button>
        )}
      </div>

      {aiOmniModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative font-sans text-slate-100">
            
            {/* Header section */}
            <div className="bg-slate-950/90 p-5 md:p-7 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">Core Arsenal</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">13 Tools Loaded</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black font-sans tracking-tight text-white mt-2">All-in-One Capabilities Command Board</h1>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                  Redo of the AI command control center. Tap blueprints below to trigger instant automated operations, or download as a standalone offline file.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadSingleHtml}
                  className="px-4 py-2 border border-emerald-500/65 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
                  title="Export offline file"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Standalone HTML Fleet</span>
                </button>
                <button
                  onClick={() => setAiOmniModalOpen(false)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="px-5 md:px-7 py-4 bg-slate-950/30 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search 13 enterprise tools..."
                  value={commandSearchQuery}
                  onChange={(e) => setCommandSearchQuery(e.target.value)}
                  className="w-full bg-[#1e293b]/70 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-100 placeholder:text-slate-500 font-sans"
                />
                {commandSearchQuery && (
                  <button 
                    onClick={() => setCommandSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
                {[
                  { id: "all", label: "All Modules (13)" },
                  { id: "marketing", label: "Marketing & Campaigns" },
                  { id: "finance", label: "Transaction & Finance" },
                  { id: "compliance", label: "Operations & Compliance" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-tight whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === cat.id
                        ? "bg-teal-600 font-extrabold text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-250"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid display scroll container */}
            <div className="flex-1 overflow-y-auto p-5 md:p-7 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AI_TOOLS_INDEX.filter((tool) => {
                  const s = commandSearchQuery.toLowerCase();
                  const matchesSearch = tool.name.toLowerCase().includes(s) || tool.desc.toLowerCase().includes(s);
                  
                  const isMarketing = ["architect", "walks", "staging", "campaigns", "authority"].includes(tool.id);
                  const isFinance = ["closer", "copilot", "billing"].includes(tool.id);
                  const toolCat = isMarketing ? "marketing" : isFinance ? "finance" : "compliance";
                  
                  const matchesCategory = selectedCategory === "all" || toolCat === selectedCategory;
                  return matchesSearch && matchesCategory;
                }).map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <div 
                      key={tool.id} 
                      className="bg-[#1e293b]/40 border border-slate-800/80 hover:border-slate-705 rounded-xl p-5 flex flex-col justify-between hover:shadow-xl hover:translate-y-[-1px] transition-all group"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-teal-400 group-hover:text-[#ffd700] transition-all">
                            <IconComponent className="h-5 w-5 animate-fadeIn" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-bold text-teal-500 uppercase font-mono px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-md">
                              {tool.badge}
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono tracking-tight">{tool.metric}</span>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-4 font-sans tracking-tight">{tool.name}</h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tool.desc}</p>
                      </div>

                      {/* Interactive Examples Accordion Layout within bento card */}
                      <div className="mt-5 pt-4 border-t border-slate-800/70 space-y-2.5">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase block select-none">Blueprints & Examples:</span>
                        {tool.examples.map((ex, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-850 p-3 rounded-lg space-y-2 hover:border-teal-500/20 transition-all text-left">
                            <div className="text-[10.5px] font-medium text-slate-300 leading-normal">
                              &ldquo;{ex.prompt}&rdquo;
                            </div>
                            <p className="text-[9.5px] text-[#ffd700]/70 font-sans leading-normal">
                              {ex.description}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setAiOmniModalOpen(false);
                                setAiConsoleOpen(true);
                                handleAiCommandSubmit(undefined, ex.prompt);
                              }}
                              className="w-full mt-1 bg-teal-600/15 hover:bg-teal-650 text-teal-400 hover:text-white px-2 py-1.5 rounded text-[8.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer border border-teal-500/20"
                            >
                              <Sparkles className="h-2.5 w-2.5 shrink-0" />
                              <span>⚡ Run Automation</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Zero match display state */}
              {AI_TOOLS_INDEX.filter((tool) => {
                const s = commandSearchQuery.toLowerCase();
                const matchesSearch = tool.name.toLowerCase().includes(s) || tool.desc.toLowerCase().includes(s);
                
                const isMarketing = ["architect", "walks", "staging", "campaigns", "authority"].includes(tool.id);
                const isFinance = ["closer", "copilot", "billing"].includes(tool.id);
                const toolCat = isMarketing ? "marketing" : isFinance ? "finance" : "compliance";
                
                const matchesCategory = selectedCategory === "all" || toolCat === selectedCategory;
                return matchesSearch && matchesCategory;
              }).length === 0 && (
                <div className="text-center py-16 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
                  <Bot className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-bounce" />
                  <h3 className="text-sm font-bold text-slate-300">No Enterprise Tools Found</h3>
                  <p className="text-xs text-slate-550 mt-1 max-w-[320px] mx-auto">
                    No results match your terms &ldquo;{commandSearchQuery}&rdquo; under the current filter selection scope.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Status bar */}
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-sans select-none shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Core Sandbox Environment Connected</span>
              </span>
              <span>All 13 Tools Fully Wired</span>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
