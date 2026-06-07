import React, { useState } from "react";
import { Sparkles, DollarSign, Locate, RefreshCw, Send, CheckCircle2, Globe, Megaphone } from "lucide-react";
import { Tenant, AdCampaign } from "../types";

interface AdArchitectProps {
  currentTenant: Tenant;
  campaigns: AdCampaign[];
  onRefresh: () => void;
}

export default function AdArchitect({ currentTenant, campaigns, onRefresh }: AdArchitectProps) {
  const [loading, setLoading] = useState(false);
  const [propertyId, setPropertyId] = useState("MLS-882103");
  const [listingUrl, setListingUrl] = useState("https://austinhomereports.com/listing/bouldin-bungalow");
  const [listingDetails, setListingDetails] = useState("3 Bedroom, 2 Bath Mid-century modern in Bouldin Creek, Austin. Recently updated kitchen, huge backyard oak tree canopy, priced at $795,000.");
  const [budget, setBudget] = useState(1000);
  const [targetAudience, setTargetAudience] = useState<"First-Time Buyers" | "Luxury Upgraders" | "Investors">("First-Time Buyers");
  const [responseCamp, setResponseCamp] = useState<AdCampaign | null>(null);

  const calculateTechFee = (amt: number) => {
    return Number((amt * 0.10).toFixed(2)); // Strict 10% tech-fee
  };

  const calculateTotal = (amt: number) => {
    return Number((amt * 1.10).toFixed(2));
  };

  const handleCreateArchitectAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) return;
    setLoading(true);
    setResponseCamp(null);

    try {
      const response = await fetch("/api/campaign/generate-architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: currentTenant.id,
          property_id: propertyId,
          original_url: listingUrl,
          budget: budget,
          details: listingDetails + ` (Optimized specifically for targeting: ${targetAudience})`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResponseCamp(data.campaign);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Switch demonstration scenarios quickly for the user
  const loadListingPreset = (id: string, url: string, desc: string, aud: any) => {
    setPropertyId(id);
    setListingUrl(url);
    setListingDetails(desc);
    setTargetAudience(aud);
  };

  const activeTenantCampaigns = campaigns.filter(c => c.tenant_id === currentTenant.id);

  return (
    <div id="ad-architect-module" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* MLS Entry & Budget Panel */}
      <div className="xl:col-span-5 space-y-6">
        <div className="border border-slate-200/80 bg-white rounded-xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Megaphone className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">AI Ad Architect</h4>
              <p className="text-[10px] text-slate-500">Autonomous Meta Campaign Generator</p>
            </div>
          </div>

          {/* Quick presets selectors */}
          <div className="space-y-2">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Listing presets demonstrations
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => loadListingPreset("MLS-882103", "https://mls.com/listing/bouldin-creek", "3B/2B Mid-century modern in Bouldin Creek, Austin. Recently updated kitchen, priced at $795k.", "First-Time Buyers")}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono rounded transition-colors cursor-pointer"
              >
                Bouldin Creek Bungalow
              </button>
              <button
                type="button"
                onClick={() => loadListingPreset("MLS-912140", "https://mls.com/listing/lake-austin", "5B/6B Lake Austin luxury waterfront sanctuary with secure multi-level pools, gated layout. Priced at $3.5M.", "Luxury Upgraders")}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono rounded transition-colors cursor-pointer"
              >
                Waterfront Sanctuary
              </button>
              <button
                type="button"
                onClick={() => loadListingPreset("MLS-102144", "https://mls.com/listing/fremont-duplex", "Seattle Bellevue lakeside investment duplex with secure renters lease tracking logs. Priced at $1.5M.", "Investors")}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono rounded transition-colors cursor-pointer"
              >
                Fremont Duplex
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateArchitectAd} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1.5">
                MLS Property ID
              </label>
              <input
                type="text"
                required
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="e.g. MLS-9024A"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1.5">
                Listing URL string
              </label>
              <input
                type="url"
                required
                value={listingUrl}
                onChange={(e) => setListingUrl(e.target.value)}
                placeholder="https://example.com/listings"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1.5">
                Listing details to programmatically target
              </label>
              <textarea
                value={listingDetails}
                onChange={(e) => setListingDetails(e.target.value)}
                rows={3}
                placeholder="3B/2B contemporary kitchen, high ceilings..."
                className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans leading-relaxed resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1.5">
                  Target Demographic
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded text-slate-700 text-xs px-3 py-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="First-Time Buyers">First-Time Buyers</option>
                  <option value="Luxury Upgraders">Luxury Upgraders</option>
                  <option value="Investors">Property Investors</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1.5">
                  Campaign Ad Spend ($)
                </label>
                <input
                  type="number"
                  min={50}
                  max={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            {/* Tech fee accounting calculator */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Meta API Placement Budget:</span>
                <span className="text-slate-900 font-bold">${budget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-teal-600 flex items-center gap-0.5 font-bold">
                  ⚡ Nexus-AI Automation Tech-Fee (10%):
                </span>
                <span className="text-teal-600 font-bold">${calculateTechFee(budget).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1">
                <span>Stripe Consolidated Total:</span>
                <span>${calculateTotal(budget).toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-2.5 bg-teal-650 hover:bg-teal-555 disabled:opacity-50 text-white font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-650/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin w-full text-center" />
                  Generating targeted Meta Campaign Copies...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Broadcast & Deploy Campaign with 10% Fee
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Campaign Output & Logs */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Ad Copy output visualization */}
        <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
          <h4 className="text-slate-900 font-bold text-sm mb-4">Ad Architect Placement Preview</h4>

          {responseCamp ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-medium">
                  <span className="text-teal-600 flex items-center gap-1 font-bold">
                    <Globe className="h-3 w-3" /> Meta Live Placement Preview
                  </span>
                  <span>MLS ID: {responseCamp.property_id}</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold text-[11px] font-mono tracking-wider uppercase block">
                    ✔ Generated Headline
                  </span>
                  <h5 className="text-slate-900 font-extrabold text-sm tracking-tight">{responseCamp.headline}</h5>
                </div>

                <div className="space-y-1.5">
                  <span className="text-teal-600 font-bold text-[11px] font-mono tracking-wider uppercase block">
                    👥 Target Ad Copies Generated (Demographic Optimized)
                  </span>
                  <p className="text-slate-800 text-xs leading-relaxed font-sans bg-white p-4 border border-slate-200 rounded">
                    "{responseCamp.ad_copy}"
                  </p>
                </div>

                {/* Local zipcodes suggestions based on MLS price */}
                <div className="space-y-2">
                  <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1">
                    <Locate className="h-3 w-3 text-teal-650" /> Suggested Optimization Zipcodes Targeting
                  </span>
                  <div className="flex gap-1.5">
                    {responseCamp.zipcodes.map((z, i) => (
                      <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 font-mono text-[10px] rounded border border-teal-100">
                        Target Area: {z}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Ad Spend: ${responseCamp.budget}</span>
                  <span className="text-teal-700 flex items-center gap-1 bg-teal-50 border border-teal-150 text-teal-700 px-2.5 py-0.5 rounded font-bold">
                    <CheckCircle2 className="h-3 w-3 text-teal-600" /> Active Meta API sync
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded bg-slate-50">
              <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                Trigger the "Broadcast & Deploy Campaign" on the left, and watch the system call the Gemini API on the server to auto-generate demographic targeted ad copy.
              </p>
            </div>
          )}
        </div>

        {/* Existing Active Ad Placements */}
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Active Ad Campaigns (Tenant: {currentTenant.name})</h4>
          
          <div className="space-y-3">
            {activeTenantCampaigns.map((camp) => (
              <div key={camp.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-4">
                <div className="space-y-1.5 grow">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{camp.headline}</span>
                    <span className="px-1.5 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-mono rounded font-bold select-none">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-650 leading-normal font-sans italic font-medium">
                    "{camp.ad_copy}"
                  </p>
                  <div className="flex gap-1.5 pt-1">
                    {camp.zipcodes.map((z, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-white text-slate-500 text-[9px] font-mono border border-slate-200 rounded">
                        {z}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0 font-mono text-[10px] text-slate-500">
                  <div className="text-slate-900 font-bold">Budget: ${camp.budget}</div>
                  <div>Fee (10%): ${camp.tech_fee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
