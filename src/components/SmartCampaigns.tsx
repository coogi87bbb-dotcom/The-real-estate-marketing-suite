import React, { useState } from "react";
import { Sparkles, Mail, Phone, Map, ChevronRight, FileText, CheckCircle, Smartphone, Send, Printer } from "lucide-react";

interface CampaignCohort {
  id: string;
  name: string;
  tagline: string;
  count: number;
  steps: {
    day: number;
    channel: "Email" | "Ringless Voicemail" | "Direct Mail Card";
    title: string;
    details: string;
    copywriting: string;
  }[];
}

const CAMPAIGN_COHORTS: CampaignCohort[] = [
  {
    id: "cohort-expired",
    name: "Expired MLS Listings",
    tagline: "Homeowners looking for a proven team with a track record of selling quickly.",
    count: 14,
    steps: [
      {
        day: 1,
        channel: "Email",
        title: "The Billion-Dollar Strategy Pitch",
        details: "Send an elite pitch outlining why their property expired and how we reposition it using AI walkthroughs.",
        copywriting: "Subject: Repositioning your listing for a premium close...\n\nHello [Name],\n\nI noticed your listing at [Address] recently expired. Under standard MLS indexing, that often signals an exposure failure, not a product issue. Our team represents over a billion dollars in career sales, optimizing listings with high-density kinetic video and automated Meta targeting.\n\nWe would love to share a complimentary 10-minute visual asset audit to show you how we can save you time, recapture your equity, and sell within 30 days.\n\nBest,\n[Agent Name]\nPerryman's Luxury"
      },
      {
        day: 3,
        channel: "Ringless Voicemail",
        title: "Billion-Dollar Low-Friction Drop",
        details: "Deliver an automatic ringless voicemail directly to their inbox with warm, consultative advice.",
        copywriting: "Hi, this is [Agent Name] with Perryman's Apex Realty. I left a diagnostic audit in your inbox earlier regarding your listing at [Address]. I want to ensure you don't discount your home's equity. Let's schedule 5 minutes to discuss our 4K localized walkthrough queue. Call me standard at [Phone]."
      },
      {
        day: 5,
        channel: "Direct Mail Card",
        title: "The Physical Luxury Brochure",
        details: "We print and dispatch a high-density double-sided direct mail card featuring a custom QR code.",
        copywriting: "Front Copy: WHY DIDN'T IT SELL?\nBack Copy: Your property at [Address] is too prestigious for cookie-cutter flyers. Scan this QR code to see how Nexus-AI stages and sells high-equity homes instantly. Free home valuation analysis maps inside!"
      }
    ]
  },
  {
    id: "cohort-fsbo",
    name: "FSBO (For Sale By Owner)",
    tagline: "Homeowners selling on their own who need professional buyer pools and high-converting marketing exposure.",
    count: 8,
    steps: [
      {
        day: 1,
        channel: "Email",
        title: "The Multi-Channel Exposure Hook",
        details: "Presents our automated buyer syndics map and explains how FSBOs lose on average 15% equity.",
        copywriting: "Subject: Reaching 100% of local buying pools...\n\nHello [Name],\n\nCongratulations on launching your listing at [Address]. Selling privately is a fantastic way to inspect the market. However, studies show private listings bypass 85% of high-net-worth Austin buyer networks.\n\nAt Perryman's, we represent over a billion in volume. Our autonomous platform automatically syndicates listing ad campaigns with custom zip-code filters, matching active pre-approved buyers.\n\nLet me introduce our mortgage partner David Miller to see if we can bring a pre-qualified buyer directly to your doorstep today.\n\nRegards,\n[Agent Name]"
      },
      {
        day: 3,
        channel: "Ringless Voicemail",
        title: "Low-Pressure Buyer Matching Offer",
        details: "Simulate a warm follow-up phone node script asking if they cooperate with brokers bringing pre-approved buyers.",
        copywriting: "Hello! Quick courtesy check-in from Perryman's. I have two buyers pre-approved through our mortgage co-pilot looking specifically in your zipcode. Do you cooperate with buyer agents? Let me know if I can email their financial qualifications. Talk soon!"
      },
      {
        day: 5,
        channel: "Direct Mail Card",
        title: "Recent Neighborhood Sales Postcard",
        details: "Physical postcard detailing our recent luxury closes in their immediate neighborhood.",
        copywriting: "Front Copy: CLOSED IN YOUR NEIGHBORHOOD\nBack Copy: We represent a billion in home transactions. See how we fetched record-breaking valuations in your zip code. Scan this QR to match your FSBO property against our prime buyer pools."
      }
    ]
  },
  {
    id: "cohort-openhouse",
    name: "Open House Attendees",
    tagline: "Turn window shoppers and neighborhood lookers into scheduled, qualified buyers within 48 hours.",
    count: 22,
    steps: [
      {
        day: 1,
        channel: "Email",
        title: "Micro-Walkthrough Asset Followup",
        details: "Automatic follow-up triggering a custom video rendering link of the listing they explored.",
        copywriting: "Subject: Breathtaking walkthrough from Sunday's tour...\n\nHi [Name],\n\nIt was a treat hosting you at our listing yesterday. To save you time, we have compiled an automated virtual walkthrough of the home including the full media room details.\n\nOur mortgage partner, David Miller, has also drafted optimized financing options (including 10% down custom ARMs) specifically for interest in this property. Review your custom calculation sheet below.\n\nCheers,\n[Agent Name]"
      },
      {
        day: 3,
        channel: "Ringless Voicemail",
        title: "Feedback & Custom Sourcing Drop",
        details: "Voicemail asking if they had questions about the home or need us to source private pocket listings.",
        copywriting: "Hey there, this is [Agent Name] from Perryman's. Quick follow-up on Sunday's open house. We have two off-market pocket listings coming up nearby that bypass public MLS. Text me back if you would like exclusive entry!"
      },
      {
        day: 5,
        channel: "Direct Mail Card",
        title: "VIP Pocket Listings Card",
        details: "Direct mail postcard invitation to our exclusive private portfolio database access.",
        copywriting: "Front Copy: ACCESS THE ESCROW VAULT\nBack Copy: Looking for listings that never hit Zillow? Scan this VIP invite to register for private off-market properties curated by Austin and Seattle's top billion-dollar brokerage."
      }
    ]
  }
];

export default function SmartCampaigns() {
  const [selectedCohort, setSelectedCohort] = useState<CampaignCohort>(CAMPAIGN_COHORTS[0]);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isSendingSim, setIsSendingSim] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string>("");
  const [isPrintingSim, setIsPrintingSim] = useState<boolean>(false);
  const [totalEnrolled, setTotalEnrolled] = useState<number>(44);

  const activeStep = selectedCohort.steps[activeStepIdx];

  const handleTestTrigger = () => {
    setIsSendingSim(true);
    setSimLogs("Warming up auto-nurture servers...");
    
    setTimeout(() => {
      setSimLogs(prev => prev + "\n[PIPELINE OK] Fetching lead contacts mapped to: " + selectedCohort.name);
    }, 400);

    setTimeout(() => {
      if (activeStep.channel === "Email") {
        setSimLogs(prev => prev + `\n[SECURE API] Dispatched ${selectedCohort.count} customized emails safely. Low-latency tracker is listening for replies.`);
      } else if (activeStep.channel === "Ringless Voicemail") {
        setSimLogs(prev => prev + `\n[VAPI NODE] Automatic dialer bypassed ring. Dropped sound logs on ${selectedCohort.count} mobile boxes.`);
      } else {
        setSimLogs(prev => prev + `\n[PRINTER CORE] Exported vector layouts. Synced with local direct postcard printer. Estimated ship date: Tomorrow morning.`);
      }
      setIsSendingSim(false);
    }, 1800);
  };

  const handleEnrollMock = () => {
    setTotalEnrolled(prev => prev + 1);
    alert("Secured! Mock cold lead enrolled into " + selectedCohort.name + " campaign flow. Autopilot triggered.");
  };

  return (
    <div id="smart-campaigns-module" className="space-y-6">
      
      {/* Title block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="p-1 px-2.5 bg-teal-500/10 text-teal-700 rounded-md font-mono text-[9px] uppercase font-bold border border-teal-500/20">
              Omnichannel cold outreach
            </span>
            <h2 className="text-xl font-bold font-sans tracking-tight text-slate-800">
              Co-Pilot Omnichannel Smart Nurture Campaigns
            </h2>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              Automate multi-channel touchpoints. Deploy structured sequences combining high-converting emails, ringless voicemails, and direct physical mail brochures on autopilot.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center shrink-0">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Active Enrolled Contacts</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{totalEnrolled} Leads</span>
            <span className="text-[9px] text-teal-600 block mt-0.5 font-bold">● Auto-Nurturing Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step List & Cohorts Selector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cohort Card list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
              1. Choose Cold Nurture Audience
            </h3>

            <div className="space-y-2">
              {CAMPAIGN_COHORTS.map((cohort) => {
                const isSelected = selectedCohort.id === cohort.id;
                return (
                  <button
                    key={cohort.id}
                    onClick={() => {
                      setSelectedCohort(cohort);
                      setActiveStepIdx(0);
                      setSimLogs("");
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-slate-50 border-teal-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold ${isSelected ? "text-teal-600" : "text-slate-900"}`}>
                        {cohort.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {cohort.count} Cold Leads
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {cohort.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleEnrollMock}
              className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              + Manual Enroll New Cold Lead
            </button>
          </div>

          {/* Drip Sequence flow step viewer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
              2. Nurture Chain Steps
            </h3>

            <div className="relative border-l-2 border-slate-100 ml-4 space-y-4 pl-6">
              {selectedCohort.steps.map((step, idx) => {
                const isActive = activeStepIdx === idx;
                const isEmail = step.channel === "Email";
                const isVoicemail = step.channel === "Ringless Voicemail";
                
                return (
                  <div
                    key={step.day}
                    onClick={() => {
                      setActiveStepIdx(idx);
                      setSimLogs("");
                    }}
                    className={`relative cursor-pointer group transition-all`}
                  >
                    {/* Circle timeline dot */}
                    <span className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center font-mono text-[8px] font-bold ${
                      isActive
                        ? "bg-teal-600 border-teal-600 text-white font-bold"
                        : "bg-white border-slate-300 text-slate-500 group-hover:border-slate-400"
                    }`}>
                      D{step.day}
                    </span>

                    <div className={`p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-slate-50 border-slate-350 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-slate-50/50"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-black text-teal-600 uppercase tracking-widest">
                          {step.channel}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">Day {step.day} Target</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-850 mt-1 line-clamp-1">{step.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{step.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Step Preview & Mock Action panels */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Workspace comparison pane (visualizes Email vs phone log vs direct mail front/back) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-slate-100 rounded-lg text-slate-600">
                  {activeStep.channel === "Email" && <Mail className="h-4 w-4" />}
                  {activeStep.channel === "Ringless Voicemail" && <Phone className="h-4 w-4" />}
                  {activeStep.channel === "Direct Mail Card" && <Map className="h-4 w-4" />}
                </span>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-wider block">PREVIEW PLATFORM INSTANCE:</span>
                  <h4 className="text-xs font-bold text-slate-900">{activeStep.title}</h4>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded">
                Active Target: Day {activeStep.day}
              </span>
            </div>

            {/* If Channel is Email */}
            {activeStep.channel === "Email" && (
              <div className="border border-slate-200 rounded-xl overflow-hidden font-sans shadow-sm">
                <div className="bg-slate-50 p-3.5 border-b border-slate-200 space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Sender: <strong className="text-slate-800">Perryman's Apex Systems (outbound@perrymans.ai)</strong></span>
                    <span className="text-[10px] font-mono text-teal-600 font-bold">✓ SECURE SMTP</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2">
                    <span>Recipients: <strong className="text-slate-800">{selectedCohort.count} Expelled / Cold Leads</strong></span>
                  </div>
                </div>
                <div className="p-4 bg-white text-slate-700 text-xs font-medium space-y-3 whitespace-pre-wrap leading-relaxed min-h-[170px]">
                  {activeStep.copywriting}
                </div>
              </div>
            )}

            {/* If Channel is Voicemail */}
            {activeStep.channel === "Ringless Voicemail" && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-950 text-[#f4f0e6] font-mono text-xs space-y-4 shadow-md">
                <div className="flex justify-between items-center bg-slate-900 p-2 border border-slate-800 rounded-lg">
                  <span className="text-amber-400 text-[10px] font-bold">🎙️ VOICE REC PERSONNEL:</span>
                  <select className="bg-transparent text-[#f4f0e6] focus:outline-none text-[11px] font-semibold">
                    <option value="kore" className="bg-[#1E293B]">Kore (Warm Professional Texan)</option>
                    <option value="cascade_puck" className="bg-[#1E293B]">Puck (Fast-talking Creator Seattle)</option>
                    <option value="zephyr" className="bg-[#1E293B]">Zephyr (Polished Luxury AI Male)</option>
                  </select>
                </div>

                <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl italic leading-relaxed text-[11.5px] relative">
                  <span className="absolute -top-2 leading-none left-4 bg-slate-800 text-slate-400 text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded">
                    OUTBOUND PHONE SPOKEN SCRIPT
                  </span>
                  "{activeStep.copywriting}"
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Total Bypassed Rings: 100% Secure Delivery</span>
                  <button
                    onClick={() => alert("Playing audio testing generation... 'Hello! Quick courtesy check-in from Perryman's...'")}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
                  >
                    🔊 Listen to Voice Sample
                  </button>
                </div>
              </div>
            )}

            {/* If Channel is Direct Mail card */}
            {activeStep.channel === "Direct Mail Card" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Card Front */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-white text-center flex flex-col justify-between aspect-[1.5/1] shadow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/35 to-slate-950 pointer-events-none" />
                    <span className="text-[9px] font-mono text-teal-400 font-extrabold uppercase bg-slate-800/40 px-1.5 py-0.5 border border-slate-700 rounded self-start z-10">POSTCARD: FRONT COVER</span>
                    <h5 className="text-xl font-sans tracking-widest font-black uppercase text-center mt-3 z-10 leading-snug">
                      {activeStep.copywriting.split("\n")[0].replace("Front Copy: ", "")}
                    </h5>
                    <span className="text-[9.5px] font-mono text-slate-400 tracking-wider z-10">Perryman's Apex Portfolio System</span>
                  </div>

                  {/* Card Back */}
                  <div className="border border-slate-250 rounded-xl p-4 bg-white text-slate-800 aspect-[1.5/1] shadow justify-between flex flex-col font-sans relative">
                    <span className="text-[8px] font-mono text-slate-400 font-extrabold uppercase bg-slate-150 px-1.5 py-0.5 rounded self-start">POSTCARD: BACK MAILER</span>
                    
                    <div className="grid grid-cols-12 gap-2 mt-2 items-center">
                      <div className="col-span-8 text-[9px] leading-relaxed text-slate-600 font-medium">
                        {activeStep.copywriting.split("\n")[1].replace("Back Copy: ", "")}
                      </div>

                      <div className="col-span-4 flex flex-col items-center justify-center space-y-1">
                        {/* Mock QR */}
                        <div className="w-11 h-11 bg-slate-100 border border-slate-300 p-1 rounded flex flex-col justify-center items-center">
                          <span className="text-[7px] font-mono font-bold leading-none text-center">QR LINK</span>
                        </div>
                        <span className="text-[7px] text-center font-mono uppercase text-slate-400">Scan Area</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-150 pt-2 text-[8px] text-slate-400 font-mono">
                      <span>Perryman's Luxury Portfolios</span>
                      <span>ZIP US Postage Paid</span>
                    </div>
                  </div>

                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-650">Estimation: $1.15 per high-gloss printed brochure dispatch.</span>
                  <button
                    onClick={() => alert("Successfully requested a printing proof test dispatched to principal office!")}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-250 rounded-lg font-bold transition-all"
                  >
                    Send Physical Print Proof
                  </button>
                </div>
              </div>
            )}

            {/* Live Send and Nurture Automation Controls */}
            <div className="border-t border-slate-100/80 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <span className="text-[11px] text-slate-500 font-semibold leading-relaxed max-w-sm">
                Deploy these tactics instantly to all <strong className="text-slate-800">{selectedCohort.count} dormant leads</strong> mapped to the cohort pool.
              </span>
              
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={handleTestTrigger}
                  disabled={isSendingSim}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 flex-1 md:flex-none cursor-pointer disabled:opacity-50"
                >
                  {isSendingSim ? "Broadcasting Drip..." : `Deploy Step 1 Nurture (${selectedCohort.count} Leads)`}
                </button>
              </div>
            </div>

            {/* Broadcast terminal log */}
            {simLogs && (
              <div className="bg-[#0b1411] border border-[#d4af37]/25 p-3.5 rounded-xl font-mono text-[10.5px] text-slate-200 space-y-1.5 animate-fadeIn">
                <span className="text-[#ffd700] text-[9px] tracking-wide font-extrabold uppercase flex items-center gap-1.5">
                  <Smartphone className="h-3 w-3 animate-bounce" />
                  Omnichannel Outbox Broadcaster Engine:
                </span>
                <p className="whitespace-pre-wrap text-[#85bb65] font-mono leading-relaxed">{simLogs}</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
