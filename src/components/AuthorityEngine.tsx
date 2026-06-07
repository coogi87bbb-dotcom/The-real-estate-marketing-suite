import React, { useState } from "react";
import { Sparkles, BarChart, FileText, Share2, Search, MapPin, CheckCircle, RefreshCw, Smartphone, TrendingUp, Compass, Award } from "lucide-react";

interface ZipMetrics {
  zip: string;
  neighborhood: string;
  medianPrice: number;
  velocityPercent: number; // Inbound lead velocity growth
  inventoryMonths: number;
  authorityRank: string;
}

const ZIP_DATA: { [key: string]: ZipMetrics } = {
  "78704": { zip: "78704", neighborhood: "Bouldin Creek & Travis Heights (Austin)", medianPrice: 875000, velocityPercent: 18.4, inventoryMonths: 1.8, authorityRank: "#1 Elite Growth" },
  "78701": { zip: "78701", neighborhood: "Downtown High-Rises (Austin)", medianPrice: 1250000, velocityPercent: 12.2, inventoryMonths: 2.4, authorityRank: "#2 Global Core" },
  "78703": { zip: "78703", neighborhood: "West Lake Hills Outer & Tarrytown (Austin)", medianPrice: 1680000, velocityPercent: 24.1, inventoryMonths: 1.2, authorityRank: "#1 Prime Luxury" },
  "98122": { zip: "98122", neighborhood: "Capitol Hill & Central Seattle (Seattle)", medianPrice: 945000, velocityPercent: 15.6, inventoryMonths: 1.5, authorityRank: "#3 Sound High" }
};

export default function AuthorityEngine() {
  const [zipCode, setZipCode] = useState<string>("78704");
  const [zipInput, setZipInput] = useState<string>("78704");
  const [currentMetrics, setCurrentMetrics] = useState<ZipMetrics>(ZIP_DATA["78704"]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"blog" | "social">("blog");
  const [publishedCount, setPublishedCount] = useState<number>(12);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Social Template modifiers
  const [socialBgColor, setSocialBgColor] = useState<string>("bg-slate-900");
  const [socialCaption, setSocialCaption] = useState<string>("Bouldin Creek inventory recently compressed to a rapid 1.8 months supply. When transaction vectors run this lean, home valuations appreciate on hyper-drive. Is your portfolio positioned correctly? Contact Perryman's.");

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      const match = ZIP_DATA[zipInput.trim()];
      if (match) {
        setCurrentMetrics(match);
        setZipCode(match.zip);
        // auto-update social caption based on selected metrics
        setSocialCaption(`${match.neighborhood} inventory recently compressed to a rapid ${match.inventoryMonths} months supply. When transaction vectors run this lean, home valuations appreciate on hyper-drive. Is your portfolio positioned correctly? Contact Perryman's.`);
      } else {
        // Fallback generator for un-modeled zips so it always succeeds gracefully!
        const generated: ZipMetrics = {
          zip: zipInput,
          neighborhood: `Segment Area Zip Code [${zipInput}]`,
          medianPrice: 650000 + Math.floor(Math.random() * 800000),
          velocityPercent: 8 + Math.floor(Math.random() * 20),
          inventoryMonths: 1 + Number((Math.random() * 2.5).toFixed(1)),
          authorityRank: "#4 Local Prime Index"
        };
        setCurrentMetrics(generated);
        setZipCode(generated.zip);
        setSocialCaption(`Local marketplace analysis in Zipcode ${zipInput} highlights a compressing inventory of ${generated.inventoryMonths} months, driving incredible seller equity. Ready to discover your property's net worth? Trust a team with a billion-dollar track record.`);
      }
      setIsSearching(false);
    }, 800);
  };

  const handleTriggerPublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedCount(prev => prev + 1);
      alert(`Flawless! Nexus-AI compiled your localized article containing custom metrics for MLS Zip ${zipCode}, dispatched across optimized SEO indexes, and queued LinkedIn social cards.`);
    }, 1800);
  };

  return (
    <div id="authority-engine-module" className="space-y-6">
      
      {/* Title pitch */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="p-1 px-2.5 bg-indigo-500/10 text-indigo-700 rounded-md font-mono text-[9px] uppercase font-bold border border-indigo-500/20">
              SEO Content Automation
            </span>
            <h2 className="text-xl font-bold font-sans tracking-tight text-slate-800">
              Neighborhood Authority Index & SEO Social Engine
            </h2>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              Synthesize instant neighborhood-targeted market updates. Establish instant local expertise to capture organic high-probability seller listings while saving hours of custom copywriting.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center shrink-0">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Total Portals Dominated</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{publishedCount} Zip-Codes</span>
            <span className="text-[9px] text-teal-600 block mt-0.5 font-bold">● High Search Authority</span>
          </div>
        </div>
      </div>

      {/* Zip Search selector and metrics bento */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
              Configure Target Marketplace Zone:
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Select a modeled zip code (78704, 78701, 78703, 98122) or type any local zipcode to auto-simulate analytics.</p>
          </div>

          <form onSubmit={handleZipSearch} className="flex gap-2 min-w-[280px]">
            <input
              type="text"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              placeholder="Enter ZIP code..."
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-700 font-mono font-bold"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold font-sans hover:bg-slate-850 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{isSearching ? "Compiling..." : "Deploy"}</span>
            </button>
          </form>
        </div>

        {/* Dynamic metrics block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-left space-y-1 relative overflow-hidden group">
            <TrendingUp className="absolute right-3 top-3 h-4 w-4 text-teal-500 opacity-20" />
            <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Transaction Velocity</span>
            <span className="text-lg font-bold block text-teal-600 font-mono">+{currentMetrics.velocityPercent}%</span>
            <span className="text-[9px] text-slate-500 block leading-none font-medium">Inbound buyer speed</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-left space-y-1 relative overflow-hidden">
            <Compass className="absolute right-3 top-3 h-4 w-4 text-emerald-500 opacity-20" />
            <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Months Supply Inventory</span>
            <span className="text-lg font-bold block text-slate-800 font-mono">{currentMetrics.inventoryMonths} Months</span>
            <span className="text-[9px] text-slate-500 block leading-none font-medium">Ultra-compressed seller market</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-left space-y-1 relative overflow-hidden">
            <BarChart className="absolute right-3 top-3 h-4 w-4 text-indigo-500 opacity-20" />
            <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Median sales price</span>
            <span className="text-lg font-bold block text-slate-800 font-mono">${(currentMetrics.medianPrice / 1000).toLocaleString()}k</span>
            <span className="text-[9px] text-slate-500 block leading-none font-medium">High appraisal indices</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-left space-y-1 relative overflow-hidden">
            <Award className="absolute right-3 top-3 h-4 w-4 text-amber-500 opacity-20" />
            <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Autopilot Area Rank</span>
            <span className="text-xs font-bold block text-amber-600 font-mono mt-1.5">{currentMetrics.authorityRank}</span>
            <span className="text-[9px] text-slate-500 block leading-none font-medium mt-1">Direct authority tier</span>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sub Navigation */}
        <div className="lg:col-span-12 flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveSubTab("blog")}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeSubTab === "blog"
                ? "bg-slate-900 border-transparent text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            📰 SEO Weekly Market Appraisal Article
          </button>
          <button
            onClick={() => setActiveSubTab("social")}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeSubTab === "social"
                ? "bg-slate-900 border-transparent text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            📱 Designer Social Post Generator
          </button>
        </div>

        {/* Left pane: Selected View */}
        <div className="lg:col-span-7">
          
          {/* Subtab: Blog Article builder */}
          {activeSubTab === "blog" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest">AUTO-DRAFT ENGINE LEVEL 4:</span>
                  <h4 className="text-xs font-bold text-slate-950 font-sans">Appraisal Newsletter for {currentMetrics.neighborhood}</h4>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8.5px] font-mono rounded">
                  SEO Appraised Score: 94%
                </span>
              </div>

              {/* Blog body frame */}
              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-4 max-h-[350px] overflow-y-auto text-xs text-slate-700 leading-relaxed font-sans">
                <h3 className="text-sm font-bold text-slate-900 font-sans border-b border-slate-200 pb-2">
                  Are Bouldin Creek & Austin Sellers Leaving Money on the Table? Why Real Estate Inventory Compression Points to a Homeownership Peak
                </h3>

                <p className="font-semibold text-slate-800">
                  By: Perryman's Private Client Division (A Billion-Dollar Lead Enterprise)
                </p>

                <p>
                  The modern Austin listings paradigm is experiencing a fundamental structural shift in 2026. In highly coveted zones like <strong>{currentMetrics.neighborhood}</strong>, historic transaction metrics are painting a prestigious window for homeowners attempting to extract maximum cash and home equity value before standard seasonal adjustments.
                </p>

                <p>
                  According to local database indices tracked specifically by Perryman's proprietary automated engine, the localized inventory supply is currently compressed to an extremely tight <strong>{currentMetrics.inventoryMonths} Months Supply</strong>. Under traditional real estate models, any index falling below 2.0 months indicates an intense, highly competitive seller dominance. 
                </p>

                <p>
                  "When supply compresses under this velocity index, buyer bid pools compete on premium, margin-shattering timelines," comments Perryman's senior valuation director. "Our inbound buyer leads speed rose by a staggering <strong>{currentMetrics.velocityPercent}%</strong> this cycle. This means listings exposed through targeted Meta ad pipelines sell on average 14 days faster compared to standard agency exposures."
                </p>

                <p className="border-t border-slate-200 pt-3 italic text-[11px] text-slate-500">
                  Target SEO Tag matches: Austin real estate, property appraisal {zipCode}, home equity transfer Texas, Perryman's luxury.
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100/80 pt-4">
                <span className="text-[10px] text-slate-400">Published articles aggregate onto your local agent dashboard blog.</span>
                <button
                  type="button"
                  onClick={handleTriggerPublish}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  Publish & Syndicate SEO Article
                </button>
              </div>
            </div>
          )}

          {/* Subtab: Social Post Designer */}
          {activeSubTab === "social" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest">CREATIVE BLOCK CONTROLS:</span>
                <h4 className="text-xs font-bold text-slate-950 font-sans">Customize Authority Card Social Cover</h4>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {/* Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Card Theme Hue:</span>
                  <div className="flex gap-2">
                    {[
                      { class: "bg-slate-900 border-slate-800 text-white", label: "Midnight Gold" },
                      { class: "bg-[#154734] border-transparent text-white", label: "Perryman's Emerald" },
                      { class: "bg-gradient-to-r from-[#0F172A] to-teal-950 text-white", label: "Corporate Corporate" },
                      { class: "bg-white border-slate-250 text-slate-800", label: "High-Light Ice" }
                    ].map((theme) => {
                      const isSelected = socialBgColor === theme.class;
                      return (
                        <button
                          key={theme.label}
                          onClick={() => setSocialBgColor(theme.class)}
                          className={`p-2 border rounded-xl text-[10.5px] transition-all font-medium ${
                            isSelected
                              ? "bg-slate-900 text-white border-teal-500 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {theme.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Social Post Caption Copywriter:</span>
                  <textarea
                    rows={4}
                    value={socialCaption}
                    onChange={(e) => setSocialCaption(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-750 font-sans leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100/80 pt-4">
                <span className="text-[10px] text-slate-400">Queue automatically scales social exposure index points.</span>
                <button
                  type="button"
                  onClick={handleTriggerPublish}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all"
                >
                  Auto-Post to Instagram & LinkedIn
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right pane: Graphic Preview Canvas */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
              📱 Live Generation Social Canvas Proof
            </h3>

            {/* Simulated Smartphone Grid / Instagram Post Frame */}
            <div className={`aspect-square w-full rounded-2xl p-6 flex flex-col justify-between border-2 border-slate-200/50 shadow-md ${socialBgColor} relative overflow-hidden`}>
              
              {/* Background watermark */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="flex justify-between items-start z-10 font-sans">
                <div className="flex items-center gap-1.5">
                  <div className="h-5.5 w-5.5 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/30 flex items-center justify-center font-bold font-sans text-[10px]">
                    P
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-tight uppercase block leading-none text-teal-400 font-sans">PERRYMAN'S</span>
                    <span className="text-[7.5px] font-mono uppercase tracking-wider block text-slate-400 mt-0.5">Zip {zipCode} Market Brief</span>
                  </div>
                </div>

                <span className="text-[7.5px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded font-black">
                  {currentMetrics.authorityRank}
                </span>
              </div>

              <div className="space-y-4 z-10 text-center font-sans">
                <span className="text-[8.5px] font-mono uppercase tracking-widest text-slate-400 font-extrabold block">Compression Signal Appraised</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white uppercase font-sans">
                  COMPRESSING TO {currentMetrics.inventoryMonths} MONTH SUPPLY
                </h2>
                <div className="h-1 w-10 bg-[#d4af37] mx-auto rounded" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/60 z-10 font-mono">
                <div className="text-left space-y-0.5">
                  <span className="text-[7.5px] text-slate-400 uppercase tracking-widest block font-bold">Median valuation</span>
                  <span className="text-sm font-bold text-white block leading-none font-mono">${(currentMetrics.medianPrice / 1000).toLocaleString()}k</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[7.5px] text-slate-400 uppercase tracking-widest block font-bold">Inbound lead speed</span>
                  <span className="text-xs font-black text-teal-400 block leading-none font-mono">+{currentMetrics.velocityPercent}%</span>
                </div>
              </div>

              {/* Legal check lines */}
              <div className="absolute top-0 bottom-0 right-0 left-0 border-4 border-[#d4af37]/15 pointer-events-none rounded-xl" />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-sans text-xs">
              <span className="font-bold text-slate-800 block">Optimized LinkedIn Captions Draft:</span>
              <p className="text-slate-600 leading-relaxed font-semibold italic text-[11px]">
                "{socialCaption}"
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
