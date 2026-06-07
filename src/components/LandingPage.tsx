import React from "react";
import { Sparkles, Bot, PhoneCall, ShieldCheck, Mail, Megaphone, Zap, ChevronRight, Award } from "lucide-react";

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div id="landing-page-component" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-teal-500 selection:text-white relative overflow-hidden">
      
      {/* Decorative Professional Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-100 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-48 left-[15%] w-72 h-72 bg-teal-550/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-[15%] w-96 h-96 bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800 w-full bg-slate-900 text-white sticky top-0 z-50 py-4.5 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-sans">
          <div className="flex items-center gap-2.5">
            <span className="font-sans font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-400 to-white bg-clip-text text-transparent">
              Perryman’s Nexus-AI
            </span>
            <span className="px-2 py-0.5 bg-teal-900/45 text-teal-300 border border-teal-700/30 rounded text-[9px] font-mono tracking-wider font-semibold uppercase">
              PropTech Core
            </span>
          </div>

          <div className="flex items-center gap-4.5">
            <span className="text-slate-400 text-xs font-mono hidden sm:inline">
              Vapi & Retell Cloud Gateway v4.2.1
            </span>
            <button
              onClick={onEnterDashboard}
              type="button"
              className="px-4.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              Launch Enterprise Control Center
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 relative z-20 space-y-24 flex-1">
        
        {/* Main Header Tag */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 font-mono shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0 animate-pulse" />
            <span className="font-semibold text-slate-800">Autonomous Real Estate Marketing, Auto-Nurture & Compliance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-slate-900 leading-[1.1]">
            Build a Billion Dollar Brokerage with <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-slate-800 bg-clip-text text-transparent">Autonomous AI Automation</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans font-medium">
            Nexus-AI isolates lead tracking, auto-stitches Price-Dropped walkthrough videos, manages yard sign receptionist nodes, secures Fair Housing checks, and loops mortgage partner MLOs instantly.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onEnterDashboard}
              type="button"
              className="px-7 py-3.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-teal-600/20 cursor-pointer"
            >
              Enter Dashboard Portal
              <ChevronRight className="h-4 w-4" />
            </button>
            <a
              href="#problem-sectors"
              className="px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center"
            >
              Review Core PropTech Engine modules
            </a>
          </div>
        </div>

        {/* Feature Bento Grid Sections */}
        <section id="problem-sectors" className="space-y-12">
          <div className="text-center">
            <h2 className="text-slate-900 font-sans font-extrabold text-lg uppercase tracking-wider">
              Core Engine Architecture
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">Four proprietary automated pillars solving every major real estate failure point</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Pillar 1 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-lg w-12 h-12 flex items-center justify-center border border-teal-100">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">Autopilot AI Chat & Handoffs</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Extracts financial criteria via low-latency chat conversational log interfaces, automatically allocates channels, and signals agents to close.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-12 h-12 flex items-center justify-center border border-blue-100">
                <Megaphone className="h-5 w-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">Targeted Meta Ad Architect</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Submit property MLS IDs or URLs to automatically synthesize 3 custom targeted ad variations with localized zipcode routing.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg w-12 h-12 flex items-center justify-center border border-red-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">Compliance Shield Interceptor</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Meticulously guards outputs against HUD and RESPA violations. Halts illegal racial/financial steer claims and crafts secure rewrites.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-teal-50 text-teal-700 rounded-lg w-12 h-12 flex items-center justify-center border border-teal-100">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">Sign Receps & Relocations</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Deploys virtual yard sign phone tracks to capture inbound intent, while predictive triggers forecast 5-year Relocation spikes.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6 text-center text-slate-400 font-mono text-[10px] w-full">
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
