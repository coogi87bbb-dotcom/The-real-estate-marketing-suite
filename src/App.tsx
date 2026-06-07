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
  Award
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
                <span
                  onClick={() => setActiveTab("landing")}
                  className="font-sans font-bold text-lg tracking-tight cursor-pointer uppercase text-white hover:text-teal-400 transition-colors"
                >
                  Perryman's Nexus-AI
                </span>
                
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
          <div className="bg-slate-900 text-slate-100 border border-slate-700/80 rounded-2xl shadow-xl w-[380px] md:w-[440px] overflow-hidden flex flex-col h-[550px] transition-all duration-300">
            {/* Console Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-850 flex justify-between items-center animate-fadeIn animate-duration-300">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg animate-pulse">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-[11.5px] font-bold text-white uppercase tracking-wider">Nexus-AI Autopilot</h5>
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

            {/* Console Output Terminal */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[10.5px] bg-slate-950/45 scrollbar-thin">
              {aiLogs.map((log, idx) => (
                  <div key={idx} className={`flex flex-col ${log.isUser ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                      log.isUser 
                        ? "bg-teal-600 text-white text-right rounded-tr-none" 
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

            {/* Unified Quick Presets & Interactive Blueprint Guide */}
            <div className="bg-slate-900 border-t border-slate-850 px-3 py-2.5 flex flex-col shrink-0">
              <div className="flex justify-between items-center w-full mb-1.5 font-sans">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Quick-tap automation instructions:</span>
                <button
                  id="gold-capability-toggle"
                  type="button"
                  onClick={() => setAiCapabilitiesExpanded(!aiCapabilitiesExpanded)}
                  className="text-[10px] font-extrabold uppercase tracking-wide px-3 py-1 bg-black text-[#d4af37] border-2 border-[#d4af37] rounded hover:bg-[#154734] hover:text-[#ffd700] hover:border-[#ffd700] flex items-center gap-1.5 transition-all relative cursor-pointer font-sans"
                >
                  {aiCapabilitiesExpanded ? "Hide Guide ✕" : "💡 See What I Can Do! ➔"}
                  {!aiCapabilitiesExpanded && (
                    <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd700]"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Main instant pills (always visible in the drawer) */}
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => handleAiCommandSubmit(undefined, "Add lead named Bobby Fischer in New Stage interested in 905 West Ave")}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[9.5px] font-mono rounded text-slate-300 transition-colors cursor-pointer hover:border-teal-500/40 font-mono"
                >
                  + Lead Fischer
                </button>
                <button
                  type="button"
                  onClick={() => handleAiCommandSubmit(undefined, "Unlock delinquency and bypass billing guardrails to activate the tenant")}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[9.5px] font-mono rounded text-slate-300 transition-colors cursor-pointer hover:border-teal-500/40 font-mono"
                >
                  🔓 Force active status
                </button>
                <button
                  type="button"
                  onClick={() => handleAiCommandSubmit(undefined, "Invite top-tier mortgage loan officer partner named David Miller")}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[9.5px] font-mono rounded text-slate-300 transition-colors cursor-pointer hover:border-teal-500/40 font-mono"
                >
                  + MLO Partner
                </button>
                <button
                  type="button"
                  onClick={() => handleAiCommandSubmit(undefined, "Construct high spend ad campaign budget $2500 for Austin Bouldin listing")}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[9.5px] font-mono rounded text-slate-300 transition-colors cursor-pointer hover:border-teal-500/40 font-mono"
                >
                  📣 Create $2.5k ad
                </button>
              </div>

              {/* Collapsible Blueprint Guide of exact modules and real-time commands */}
              {aiCapabilitiesExpanded && (
                <div className="mt-2.5 p-2 bg-slate-950/90 border border-slate-800 rounded-xl max-h-[170px] overflow-y-auto space-y-3.5 scrollbar-thin animate-fadeIn font-sans">
                  <div className="text-center p-2 bg-teal-500/10 border border-teal-500/20 rounded-lg font-sans">
                    <span className="font-bold text-teal-400 block text-[10px]">💼 Billion-Dollar Portfolio Intelligence</span>
                    <p className="text-[9px] text-slate-300 leading-normal">
                      Nexus-AI can command our backend engines to execute full system automations. Tap any live blueprint example below:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Blueprint: Add a Lead */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">👤 Lead Automation Engine</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Saves 4 hours</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left">Parses leads, updates property matches, and kick-starts client tracking pipelines.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Add lead named Bobby Fischer in New Stage interested in 905 West Ave");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Add lead Bobby Fischer"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Blueprint: Subscription Active Bypass */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">🔓 Subscription Hold Release</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Saves $1,999/mo</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left">Bypasses delinquency locks instantly, restoring live dashboard pipelines.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Unlock delinquency and bypass billing guardrails to activate the tenant");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Unlock and activate my billing"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Blueprint: Meta Campaigns */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">📣 Ad Architect Optimizer</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Saves 8 Hours</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left">Generates local zip-targeted copy with 10% platform automation fee management.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Construct high spend ad campaign budget $2500 for Austin Bouldin listing");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Create ad campaign for Austin"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Blueprint: Video walkthrough */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">🎬 Walkthrough Render Studio</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Saves $450/video</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left">Simulates rendering queues and stitches listing media scripts automatically.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Generate automatic video studio render for listing 1010 Ridge Ave");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Render walkthrough video"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Blueprint: MLO partner */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">🤝 Preferred Financial Syndication</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Saves 10 Hours</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left">Syncs active mortgage partners into secure tri-party client negotiation channels.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Invite top-tier mortgage loan officer partner named David Miller");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Invite Preferred MLO David Miller"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Blueprint: Phone Receptionist */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">📞 Virtual Receptionist Setup</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Saves $300/mo</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left">Claims virtual sign board tracking numbers & maps dynamic scripts.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Assign a virtual node tracking number for Main Yard Board");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Generate virtual phone nodes"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Blueprint: HUD compliance check */}
                    <div className="bg-slate-900 border border-slate-800 p-2 py-2.5 rounded-lg space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">🛡️ Regulatory HUD Cop</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.25 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">Prevents $16k Fine</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-sans text-left font-sans">Intercepts discriminatory phrasing, generating immediate regulatory HUD rewrites.</p>
                      <button
                        type="button"
                        onClick={() => {
                          handleAiCommandSubmit(undefined, "Apply regulatory copy audit on text 'This elite property is perfect for single tech bros only'");
                          setAiCapabilitiesExpanded(false);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-850 p-1.5 text-left rounded border border-slate-800 cursor-pointer transition flex justify-between items-center group font-mono text-[8.5px]"
                      >
                        <span className="text-slate-300 group-hover:text-teal-400 truncate">Example: "Intercept copy violations"</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Console Input Bar */}
            <form onSubmit={handleAiCommandSubmit} className="bg-slate-950 border-t border-slate-850 p-2.5 flex gap-2 shrink-0">
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
                className="bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-xl transition-all cursor-pointer shadow shadow-teal-900/40 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setAiConsoleOpen(true)}
            className="bg-[#0F172A] hover:bg-slate-850 text-white border-2 border-teal-500/80 rounded-full px-5 py-3 shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all text-xs font-bold uppercase tracking-wider select-none animate-bounce cursor-pointer"
          >
            <div className="relative">
              <Bot className="h-4.5 w-4.5 text-teal-400" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full animate-ping" />
            </div>
            <span>⚡ AI Autopilot Commander</span>
          </button>
        )}
      </div>

    </div>
  );
}
