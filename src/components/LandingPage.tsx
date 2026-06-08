import React from "react";
import { 
  Sparkles, Bot, Megaphone, Video, Users, PhoneCall, 
  ShieldCheck, TrendingUp, BookOpen, LayoutTemplate, 
  Mail, Search, DollarSign, Award, Zap, ChevronRight 
} from "lucide-react";
import PerrymansLogo from "./PerrymansLogo";

interface LandingPageProps {
  onEnterDashboard: () => void;
}

interface Pillar {
  id: string;
  name: string;
  badge: string;
  metric: string;
  whatItDoes: string;
  whatAutomationDoes: string;
  icon: React.ComponentType<any>;
  themeColor: string;
  iconClass: string;
  bgClass: string;
}

const PROPTECH_PILLARS: Pillar[] = [
  {
    id: "nurture",
    name: "Autonomous AI Conversational Nurturing",
    badge: "24/7 Outbound ISA",
    metric: "Saves 15 Hours / Week",
    whatItDoes: "Acts as a low-latency digital concierge engaging warm inquiries across full dialog logs. It evaluates qualification benchmarks, preferences, and local timelines, establishing immediate high-converting touchpoints.",
    whatAutomationDoes: "Instantly extracts household financial income structures and credit score estimates from conversation dialogue, triggers automatic tri-party alignment, and notifies assigned agents to close the sale.",
    icon: Bot,
    themeColor: "text-teal-600 bg-teal-50 border-teal-100",
    iconClass: "text-teal-600",
    bgClass: "hover:border-teal-400 group-hover:bg-teal-50"
  },
  {
    id: "ad-architect",
    name: "Targeted Meta 'Ad Architect' Suite",
    badge: "10% Platform Tech Return",
    metric: "Saves 8 Hours / Listing",
    whatItDoes: "Generates high-performance programmatic social marketing campaigns. Simply feed the engine an MLS listing ID or property URL and watch it build premium localized marketing copy options and asset sets.",
    whatAutomationDoes: "Curates three targeting copy options optimized for conversion, parses zipcodes based on local demographics, and calculates an integrated 10% automation technology fee routed back to the subscriber dashboard.",
    icon: Megaphone,
    themeColor: "text-blue-600 bg-blue-50 border-blue-100",
    iconClass: "text-blue-600",
    bgClass: "hover:border-blue-400 group-hover:bg-blue-50"
  },
  {
    id: "video-studio",
    name: "Walkthrough Video Render Studio",
    badge: "MLS status hooks listener",
    metric: "Saves $450 / Video",
    whatItDoes: "Provides a full-stack automated video production line. Oversees listing inventory statuses and creates premium social video assets on key transitions (e.g. Price Dropped, Just Listed).",
    whatAutomationDoes: "Stitches listing photographs with micro kinetic text overlay animations, and runs our advanced transcription engine to synthesize professional voiceovers highlighting equity gain potential.",
    icon: Video,
    themeColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    iconClass: "text-emerald-600",
    bgClass: "hover:border-emerald-400 group-hover:bg-emerald-50"
  },
  {
    id: "copilot-mortgage",
    name: "Co-Pilot Tri-Party MLO Syndicate",
    badge: "Secured Pre-Approval Loop",
    metric: "Accelerates Offer Time by 48h",
    whatItDoes: "Invites and bonds preferred Mortgage Loan Officers (MLOs) directly into secure, collaborative workspace chambers right alongside the brokerage owner and individual handling agent.",
    whatAutomationDoes: "As soon as the conversational AI identifies qualification criteria from active chats, it auto-calculates Debt-to-Income (DTI) metrics and distributes buyer qualification summaries to both the agent and MLO.",
    icon: Users,
    themeColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    iconClass: "text-indigo-600",
    bgClass: "hover:border-indigo-400 group-hover:bg-indigo-50"
  },
  {
    id: "inbound-voice",
    name: "Yard Node Inbound Voice Receptionist",
    badge: "Low-Latency Speech Model",
    metric: "0% Missed Lead Response",
    whatItDoes: "Deploys a virtual, telephone-tracked speech layer (inspired by Vapi/Retell architecture) responding directly to signs, yard riders, flyers, or physical real estate print marketing.",
    whatAutomationDoes: "Provisions exclusive virtual tracking telephone phone numbers, implements warm customized voice receptionists with automated steering dialogue, and forwards serious buyers to pre-designated live agents.",
    icon: PhoneCall,
    themeColor: "text-purple-600 bg-purple-50 border-purple-100",
    iconClass: "text-purple-600",
    bgClass: "hover:border-purple-400 group-hover:bg-purple-50"
  },
  {
    id: "compliance-shield",
    name: "Fair Housing & RESPA Regulatory Shield",
    badge: "Outbound Content Restrictor",
    metric: "Prevents $16k+ Civil Fines",
    whatItDoes: "Acts as an impenetrable real-time compliance gatekeeper tracking all outgoing communication, email campaigns, flyers, or social ad texts.",
    whatAutomationDoes: "Runs out-of-the-box linguistic checking against Fair Housing steering parameters and discriminatory descriptors (e.g. blocking 'religious steering'), triggers an immediate 'Compliance Hold', and suggests a pre-approved legal rewrite.",
    icon: ShieldCheck,
    themeColor: "text-red-650 bg-rose-50 border-rose-100",
    iconClass: "text-red-600",
    bgClass: "hover:border-rose-400 group-hover:bg-rose-50"
  },
  {
    id: "retention-engine",
    name: "Predictive Relocation Retention Engine",
    badge: "Equity-to-Listing Conversion",
    metric: "Unlocks 3.4x Repeat Listings",
    whatItDoes: "Tracks historical purchase dates and maps local property data to predict which former clients are approaching natural moving timelines.",
    whatAutomationDoes: "Runs real-time calculations checking property equity growth rates, flags clients on their 5-year and 7-year ownership anniversaries, and structures automated, hyper-personalized check-in letters for agents.",
    icon: TrendingUp,
    themeColor: "text-amber-600 bg-amber-50 border-amber-100",
    iconClass: "text-amber-600",
    bgClass: "hover:border-amber-400 group-hover:bg-amber-50"
  },
  {
    id: "objection-handler",
    name: "Deal-Closer Strategic Playbook",
    badge: "Elite Psychological Anchors",
    metric: "Protects Full 6% commissions",
    whatItDoes: "Serves as an interactive repository of premium negotiation responses designed to combat commission discount requests and extreme interest-rate buyer hesitation.",
    whatAutomationDoes: "Compiles action-oriented scripts addressing common objections, and drafts professional client-facing letters suggesting smart seller-funded rate buy-downs (e.g. 2-1 buy-downs) to spark transactions.",
    icon: BookOpen,
    themeColor: "text-cyan-600 bg-cyan-50 border-cyan-100",
    iconClass: "text-cyan-600",
    bgClass: "hover:border-cyan-400 group-hover:bg-cyan-50"
  },
  {
    id: "virtual-staging",
    name: "Virtual Space Staging Suggestor",
    badge: "Luxury spatial optimizer",
    metric: "Saves $2,000 / Photostage",
    whatItDoes: "Highlights spatial and furniture configurations for vacant real estate, giving properties a prestigious luxury feel designed to secure multiple over-asking offers.",
    whatAutomationDoes: "Recommends staging style parameters on-demand (e.g. Nordic Modern or premium light-toned wood Scandinavian layout) based on user uploads and listing characteristics.",
    icon: LayoutTemplate,
    themeColor: "text-violet-600 bg-violet-50 border-violet-100",
    iconClass: "text-violet-600",
    bgClass: "hover:border-violet-400 group-hover:bg-violet-50"
  },
  {
    id: "smart-campaigns",
    name: "Multi-Channel Smart Newsletters",
    badge: "Automated Contact Drips",
    metric: "Elevates Open Rates by 40%",
    whatItDoes: "Ensures agents maintain high-impact top-of-mind relevance with prospects through elegant periodic campaigns, text drops, and newsletter updates.",
    whatAutomationDoes: "Autonomously drafts clean emails incorporating real-time interest indices and local price-drop highlights, allowing single-click bulk distributions with integrated click-attribution tracking.",
    icon: Mail,
    themeColor: "text-sky-600 bg-sky-50 border-sky-100",
    iconClass: "text-sky-600",
    bgClass: "hover:border-sky-400 group-hover:bg-sky-50"
  },
  {
    id: "authority-seo",
    name: "Geo-Targeted Authority SEO Generator",
    badge: "Google Rank Booster",
    metric: "Saves $1,200 / Month Agency Fees",
    whatItDoes: "Automates local community content production to claim high-conversion organic search positions on Google Search and Maps systems.",
    whatAutomationDoes: "Constructs hyper-localized blog posts and Google Business updates targeting sub-neighborhood boundaries (e.g., Eanes ISD, Zilker lifestyle, etc.) containing localized market growth figures.",
    icon: Search,
    themeColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
    iconClass: "text-fuchsia-600",
    bgClass: "hover:border-fuchsia-400 group-hover:bg-fuchsia-50"
  },
  {
    id: "billing-guardrail",
    name: "Multi-Tenant Stripe Billing Guardrails",
    badge: "Active Subscriber Controller",
    metric: "Zero Revenue Delinquency Leak",
    whatItDoes: "Governs platform licensing tiers, transaction technology fees, and localized campaign expenses securely across multiple autonomous brokerage tenants.",
    whatAutomationDoes: "Synchronizes Stripe sandbox pricing tiers (Starter, Pro Team, Enterprise Brokerage) and enforces an automated site-wide dashboard lock if billing variables become unpaid.",
    icon: DollarSign,
    themeColor: "text-pink-600 bg-pink-50 border-pink-100",
    iconClass: "text-pink-600",
    bgClass: "hover:border-pink-400 group-hover:bg-pink-50"
  }
];

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div id="landing-page-component" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-teal-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* Decorative Professional Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-100 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-36 left-[5%] w-96 h-96 bg-teal-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-[5%] w-[450px] h-[450px] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-200/85 w-full bg-slate-900 text-white sticky top-0 z-50 py-4 px-6 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <PerrymansLogo iconSize={40} textColorMode="light" />

          <div className="flex items-center gap-4.5">
            <span className="text-slate-400 text-[10px] font-mono hidden md:inline border-r border-slate-800 pr-4.5">
              Enterprise Integration Gateway v4.5.3
            </span>
            <button
              onClick={onEnterDashboard}
              type="button"
              className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold rounded-lg shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Launch Enterprise Control Center
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-20 flex-1 w-full scale-100">
        
        {/* Main Header Tag and High-Converting B2B SaaS Heading */}
        <div className="text-center space-y-6 max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 text-teal-800 bg-teal-550/10 border border-teal-500/20 rounded-full text-[10.5px] font-semibold tracking-wide font-mono shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0 select-none animate-pulse" />
            <span>The Global Standard in Elite Autonomous PropTech Systems</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold font-sans tracking-tight text-slate-900 leading-[1.12]">
            Multiply Transaction Velocity & Scale Brokerage Asset Margins via <span className="bg-gradient-to-r from-teal-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Complete Operational Automation</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-sans font-medium">
            Nexus-AI isolates lead environments, auto-synthesizes price-dropped walk-through videos, captures physical sign traffic using low-latency phone lines, audits outbound copy for HUD/RESPA compliance on-the-fly, and integrates mortgage syndicates—increasing conversions hands-free.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4.5">
            <button
              onClick={onEnterDashboard}
              type="button"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all select-none"
            >
              Enter Executive Dashboard
              <ChevronRight className="h-4 w-4 text-teal-400 animate-bounce horizontal-bounce" />
            </button>
            <a
              href="#pillars"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 select-none"
            >
              Review the 12 Core Pillars
            </a>
          </div>
        </div>

        {/* 12 Core Pillars Grid Section */}
        <section id="pillars" className="space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-600 tracking-widest uppercase font-mono bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
              <Award className="h-3 w-3" />
              <span>Full-Stack Platform Specification</span>
            </div>
            <h2 className="text-slate-950 font-sans font-extrabold text-2xl tracking-tight">
              The 12 Core PropTech Pillars
            </h2>
            <p className="text-slate-500 text-xs mt-1 max-w-xl mx-auto font-medium">
              Every major point of friction in high-ticket real estate brokerage management—unification, conversion speed, compliance, media production, and client retention—fully computerized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {PROPTECH_PILLARS.map((p) => {
              const PillarIcon = p.icon;
              return (
                <div 
                  key={p.id} 
                  className="group bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-slate-300 relative overflow-hidden"
                >
                  {/* Subtle top decoration */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-teal-500/80 transition-colors" />

                  <div className="space-y-4">
                    {/* Header line icon and status badge */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${p.themeColor}`}>
                        <PillarIcon className="h-5 w-5" />
                      </div>
                      <span className="text-[8px] font-bold font-mono tracking-wider text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md uppercase">
                        {p.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-slate-940 font-extrabold text-sm tracking-tight leading-snug">
                        {p.name}
                      </h3>
                      <span className="text-[9px] font-bold text-slate-400 font-mono tracking-tight block mt-0.5">
                        ⚡ {p.metric}
                      </span>
                    </div>

                    <div className="space-y-3 pt-1 border-t border-slate-100 text-slate-600 text-xs leading-relaxed font-normal">
                      {/* What it is and does */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block uppercase tracking-wider font-mono mb-1">
                          Role & Description:
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {p.whatItDoes}
                        </p>
                      </div>

                      {/* What automation catalyst does */}
                      <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-900 block uppercase tracking-wider font-mono mb-1 flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5 text-amber-500 fill-current" />
                          <span>Platform Automation:</span>
                        </span>
                        <p className="text-[10.5px] leading-relaxed text-slate-700 italic">
                          "{p.whatAutomationDoes}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={onEnterDashboard}
                      type="button"
                      className="text-[10px] font-extrabold text-teal-600 hover:text-teal-500 flex items-center gap-1 transition-all cursor-pointer font-sans"
                    >
                      <span>Explore this module</span>
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-all text-teal-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Enterprise Call To Action Section */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mt-20 relative overflow-hidden text-center space-y-6 shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-radial-gradient from-teal-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Command the Next-Generation Brokerage?
            </h3>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-sans font-medium">
              Join elite broker owners orchestrating massive sales volume. Access the autonomous chat triage channels, targeted ad copies, compliance HUD guardrails, SMS sequences, and automated video render systems configured for immediate business amplification.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterDashboard}
                type="button"
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 active:translate-y-0 transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Access Autopilot Systems Now
              </button>
            </div>
            <p className="text-[9.5px] text-slate-400 font-mono">
              Secure Sandbox Verification • No credit card required to sample mock automation nodes.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-8 px-6 text-center text-slate-400 font-mono text-[10px] w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-teal-400" />
            <span className="font-sans font-medium text-slate-300">© 2026 Perryman’s Apex PropTech Systems, Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-4 text-slate-400">
            <span>Stripe secure sandbox</span>
            <span>RESPA Compliant</span>
            <span>Fair Housing Qualified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
