import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, Sliders, ChevronRight, CheckCircle2, RefreshCw, Cpu, Star } from "lucide-react";

interface ListingMock {
  id: string;
  name: string;
  address: string;
  price: string;
  rawImage: string;
  stagedImages: { [key: string]: string };
  roomDescriptions: { [key: string]: string };
}

const LISTINGS_MOCK: ListingMock[] = [
  {
    id: "stage-1",
    name: "905 West Ave Penthouse",
    address: "905 West Ave, Austin, TX 78701",
    price: "$850,000",
    rawImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", // Empty loft
    stagedImages: {
      "Scandinavian Minimalist": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", // Scandi kitchen-living
      "Mid-Century Modern": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", // MCM living
      "Urban Brick Loft": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", // Industrial cozy
      "Luxury Warm Organic": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" // High-end living
    },
    roomDescriptions: {
      "Scandinavian Minimalist": "Bathed in premium northern light, this minimalist open living concept integrates natural white oak furnishings, high-density organic linen sofas, and subtle slate black accents. Perfect for professional remote buyers demanding clean layouts.",
      "Mid-Century Modern": "Classic Austin lifestyle realized! Structured with premium teak sideboard credentials, beautiful tapered leg lounge chairs, and warm brass orbital light fixtures, driving immense visual depth.",
      "Urban Brick Loft": "Industrial-grade sophistication. Distressed brick textures pair with exposed copper conduits, high-contrast black steel fixtures, and deep distressed leather seating clusters yielding supreme executive appeal.",
      "Luxury Warm Organic": "An absolute luxury sanctuary. Curated with fine travertine side tables, white bouclé club seating, organic linen drapes, and high-contrast eucalyptus elements that scream prestige."
    }
  },
  {
    id: "stage-2",
    name: "Lake Austin Waterfront",
    address: "Barton Creek Estate #4",
    price: "$2,800,000",
    rawImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80", // Raw spacious room
    stagedImages: {
      "Scandinavian Minimalist": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      "Mid-Century Modern": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
      "Urban Brick Loft": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "Luxury Warm Organic": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
    },
    roomDescriptions: {
      "Scandinavian Minimalist": "Uncompromised Nordic luxury tracking. Sleek ash veneer wood cladding, floating low-profile credenzas, and integrated smart LED panels to highlight the sweeping tree canopy.",
      "Mid-Century Modern": "A masterful recreation of 1963 Palm Springs grandeur. Features floating walnut dividers, iconic premium leather lounge chairs, and gold geometric statement rugs.",
      "Urban Brick Loft": "Raw sophistication merges with nature. Features massive steel-framed sliding glass doors, charcoal-matte concrete flooring, and deep iron light structures.",
      "Luxury Warm Organic": "Premium resort-grade ambiance. Textured plaster walls, curved white travertine bars, solid oak coffee trunks, and delicate neutral upholstery that complements the pristine lakeside view."
    }
  }
];

export default function VirtualStaging() {
  const [selectedListing, setSelectedListing] = useState<ListingMock>(LISTINGS_MOCK[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>("Scandinavian Minimalist");
  const [showStaged, setShowStaged] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [promptTags, setPromptTags] = useState<string[]>([
    "Add gold coffee tables",
    "Replace flooring with light white oak",
    "Add abstract green canvas art",
    "Insert luxury white bouclé sofa"
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Custom Render States
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderLogs, setRenderLogs] = useState<string[]>([]);
  const [savedCounter, setSavedCounter] = useState<number>(2500);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleRunRestage = () => {
    setIsRendering(true);
    setRenderProgress(10);
    setRenderLogs(["Initializing Neural Restage Pipeline...", "Isolating raw room volume perspective grids..."]);
    
    const logsSequence = [
      { p: 35, log: "Synthesizing deep spatial shadows and depth structures..." },
      { p: 65, log: `Applying aesthetic texture mapping for [${selectedStyle}] furniture set...` },
      { p: 85, log: "Injecting custom modifier tokens from prompt instructions..." },
      { p: 100, log: "Neural lighting compilation completed in 1.2 seconds. Synced across MLS." }
    ];

    logsSequence.forEach((step, idx) => {
      setTimeout(() => {
        setRenderProgress(step.p);
        setRenderLogs(prev => [...prev, step.log]);
        if (step.p === 100) {
          setIsRendering(false);
          setShowStaged(true);
          setSavedCounter(prev => prev + 2500); // Saves agent $2,500 physically
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div id="virtual-staging-module" className="space-y-6">
      
      {/* Module Title and Hero Pitch */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-amber-500/10 text-amber-600 rounded-md font-mono text-[9px] uppercase font-bold border border-amber-500/20">
                AI Media Enrichment
              </span>
              <span className="text-slate-400 font-mono text-[9.5px]">Premium Feature</span>
            </div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-slate-800">
              Interactive 3D Virtual Staging Studio
            </h2>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              Banish cold, vacant listing photos. Auto-stitch high-fidelity luxury environments and save up to <span className="text-teal-600 font-bold">$2,500 per property</span> in physical staging and photographer mobilization.
            </p>
          </div>

          <div className="bg-[#0F172A] text-[#f4f0e6] p-3 rounded-xl border border-slate-800 text-center font-mono min-w-[170px] shadow">
            <span className="text-[9px] text-[#ffd700] uppercase block tracking-wider font-extrabold">Total Wallet Cash Saved</span>
            <span className="text-lg font-bold block text-teal-400 font-mono">${savedCounter.toLocaleString()}</span>
            <span className="text-[8px] text-slate-400 font-mono">VS physical standard fees</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Selectors and AI Modifiers Customizations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section: Select active listing */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
              1. Choose Raw MLS Space
            </h3>

            <div className="space-y-2">
              {LISTINGS_MOCK.map((listing) => {
                const isSelected = selectedListing.id === listing.id;
                return (
                  <button
                    key={listing.id}
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowStaged(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-slate-50 border-teal-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <span className={`block text-xs font-bold ${isSelected ? "text-teal-600" : "text-slate-900"}`}>
                        {listing.name}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate font-mono">
                        {listing.address}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                      {listing.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Style selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
              2. Select Furniture Aesthetic
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {Object.keys(selectedListing.stagedImages).map((style) => {
                const isSelected = selectedStyle === style;
                return (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-2.5 rounded-xl border text-center transition-all text-[11px] font-semibold ${
                      isSelected
                        ? "bg-slate-900 text-white border-transparent shadow shadow-slate-900/40 font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Interactive Prompt Modifiers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider font-mono">
                3. Micro-Design Adjustments
              </h3>
              <Cpu className="h-3.5 w-3.5 text-teal-600 animate-spin" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {promptTags.map((tag) => {
                const isApplied = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 text-[10.5px] rounded-lg transition-all font-sans font-medium flex items-center gap-1 ${
                      isApplied
                        ? "bg-teal-50 text-teal-700 border border-teal-350"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tag}</span>
                    {isApplied && <CheckCircle2 className="h-3 w-3 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Or Type Custom Render Prompt:</span>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Add high-contrast geometric wallpaper..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-700 font-sans"
              />
            </div>

            <button
              onClick={handleRunRestage}
              disabled={isRendering}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRendering ? "animate-spin" : ""}`} />
              <span>{isRendering ? "Rendering Neural Restage..." : "Compile AI Staging Render"}</span>
            </button>
          </div>

        </div>

        {/* Right Side: Visual Dual-Canvas Slider Comparison and Copy highlights */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Comparison Slider Frame */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Current Interactive Screen:</span>
                <h4 className="text-sm font-bold text-slate-900 font-sans">
                  {selectedListing.name} - <span className="text-teal-600">{selectedStyle} Style</span>
                </h4>
              </div>

              {/* Toggle controls */}
              <div className="flex gap-1.5 self-end">
                <button
                  onClick={() => setShowStaged(false)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    !showStaged
                      ? "bg-slate-900 border-transparent text-white"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  Raw Room (Vacant)
                </button>
                <button
                  onClick={() => setShowStaged(true)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    showStaged
                      ? "bg-teal-600 border-transparent text-white"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  ✨ AI Staged
                </button>
              </div>
            </div>

            {/* Visual Screen Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-100 group shadow-inner">
              <img
                src={showStaged ? selectedListing.stagedImages[selectedStyle] : selectedListing.rawImage}
                alt="Property View"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 ease-in-out"
              />

              {/* Overlays */}
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10.5px] font-semibold border border-slate-700 font-mono shadow-md">
                {showStaged ? "💎 RENDER STAGE: ACTIVE LUXURY" : "🏚️ STATUS: VACANT LOFT"}
              </div>

              <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold border border-slate-800 font-sans shadow-md">
                Resolution: 4K Neural Stitch
              </div>

              {/* Staging details list shown on staged view */}
              {showStaged && (
                <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap max-w-[80%]">
                  <span className="bg-teal-500/90 text-white px-2 py-0.5 rounded text-[9px] font-bold shadow-sm backdrop-blur-sm">
                    {selectedStyle} Setup
                  </span>
                  {selectedTags.map(t => (
                    <span key={t} className="bg-amber-500/90 text-white px-2 py-0.5 rounded text-[9px] font-bold shadow-sm backdrop-blur-sm">
                      + {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Render Log Console (shows up when rendering) */}
            {isRendering && (
              <div className="bg-[#0b1411] border border-[#d4af37]/30 rounded-xl p-4 font-mono text-[10.5px] text-slate-300 space-y-1.5 animate-pulse">
                <span className="text-[#ffd700] text-[9.5px] tracking-wide font-extrabold uppercase flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 animate-spin" />
                  Neural Stage Processor Log Level 4:
                </span>
                <div className="space-y-1 text-[#85bb65]">
                  {renderLogs.map((log, idx) => (
                    <p key={idx} className="leading-snug">✓ {log}</p>
                  ))}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-[#d4af37] h-full transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Staging Room Copy highlight section (solves MLS listing description copywriting) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="h-4 w-4 text-[#ffd700]" />
              <span>AI Synthesized Room Brochure Description:</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 relative">
              <span className="absolute -top-2 leading-none left-4 bg-teal-50 text-teal-700 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-teal-200">
                MLS Ready Copy
              </span>
              <p className="text-slate-650 text-xs leading-relaxed font-medium italic">
                "{selectedListing.roomDescriptions[selectedStyle]}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
              <span className="text-[10.5px] text-slate-500 font-medium">
                Copy automatically optimized with high-conversion emotional hooks for MLS marketing flyers.
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedListing.roomDescriptions[selectedStyle]);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Copy Description to Clipboard
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
