import React, { useState } from "react";
import { Sparkles, Calendar, TrendingUp, Mail, Send, CheckCircle, MapPin, RefreshCw } from "lucide-react";
import { PastClient } from "../types";

interface RetentionEngineProps {
  pastClients: PastClient[];
  onRefresh: () => void;
}

export default function RetentionEngine({ pastClients, onRefresh }: RetentionEngineProps) {
  const [selectedClient, setSelectedClient] = useState<PastClient | null>(pastClients[0] || null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [draftResult, setDraftResult] = useState<string>("");
  const [sentClients, setSentClients] = useState<string[]>([]);
  const [successNotif, setSuccessNotif] = useState("");

  // Select client & generate targeted retention check-in text via Gemini
  const handleSelectClient = (client: PastClient) => {
    setSelectedClient(client);
    setDraftResult("");
  };

  const handleGenerateDraft = async (client: PastClient) => {
    setLoadingDraft(true);
    setDraftResult("");
    try {
      // Calculate active ownership length
      const years = new Date().getFullYear() - new Date(client.close_date).getFullYear();
      const response = await fetch("/api/retention/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: client.name,
          address: client.address,
          estimated_equity: client.estimated_equity,
          years: years
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDraftResult(data.draft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDraft(false);
    }
  };

  const executeSend = (clientId: string) => {
    setSentClients([...sentClients, clientId]);
    setSuccessNotif(`Autopilot dispatched check-in to ${pastClients.find(c => c.id === clientId)?.name}!`);
    setTimeout(() => setSuccessNotif(""), 4000);
  };

  return (
    <div id="retention-engine-module" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* List & Trigger Sidebar */}
      <div className="xl:col-span-4 space-y-6">
        <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-slate-900 font-bold text-sm">Past Client Profiles (Predictive Relocation Index)</h4>
            <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-mono text-[10px] rounded border border-teal-100 font-bold animate-pulse">
              AI Priority
            </span>
          </div>
          
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
            Our predictive models identify homeowner profiles approaching typical moving cycles (5-7 years) cross-referenced with local capital equity gains.
          </p>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {pastClients.map((c) => {
              const years = new Date().getFullYear() - new Date(c.close_date).getFullYear();
              const isSelected = selectedClient?.id === c.id;
              const isSent = sentClients.includes(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectClient(c)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/20"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-bold text-xs text-slate-900 block">{c.name}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded font-bold ${
                      c.moving_probability >= 85
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {c.moving_probability}% relocate index
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono font-medium block mt-1">{c.address}</span>

                  <div className="flex items-center justify-between text-[10px] font-mono mt-3 pt-2.5 border-t border-slate-150">
                    <span className="text-slate-550 flex items-center gap-1 font-semibold">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      Bought: {years} years ago
                    </span>
                    <span className="text-teal-650 flex items-center gap-0.5 font-bold">
                      <TrendingUp className="h-3 w-3" />
                      +${(c.estimated_equity / 1000).toFixed(0)}k equity
                    </span>
                  </div>

                  {isSent && (
                    <div className="mt-2 text-[9px] text-emerald-700 flex items-center gap-1 font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      <CheckCircle className="h-2.5 w-2.5" /> Dispatched
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Map Render View */}
      <div className="xl:col-span-8 space-y-6">
        <div className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2.5">
              <h4 className="text-slate-900 font-bold text-sm">Interactive Austin Relocation Bubble Map</h4>
              <span className="text-slate-400 font-mono text-[10px] font-bold">Austin Public Property Registrar</span>
            </div>

            {/* Custom stylized map overlay representation (Vector representation of city zones & clients) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-[280px] relative overflow-hidden flex items-center justify-center shadow-inner">
              {/* Background grids */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-30 pointer-events-none">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-slate-200/80" />
                ))}
              </div>

              {/* Colorado River representation */}
              <svg className="absolute inset-0 w-full h-full opacity-45 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,160 Q 180,180 320,120 T 640,190 T 1200,100" fill="none" stroke="#2563eb" strokeOpacity="0.15" strokeWidth="22" strokeLinecap="round" />
                <path d="M 0,160 Q 180,180 320,120 T 640,190 T 1200,100" fill="none" stroke="#0ea5e9" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" />
              </svg>

              {/* Texas capitol marker */}
              <div className="absolute top-[130px] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center pointer-events-none">
                <div className="w-2 h-2 bg-slate-400 rounded-full mx-auto" />
                <span className="font-mono text-[8px] text-slate-500 font-bold block mt-0.5">Capitol Downtown</span>
              </div>

              {/* West Lake Hills label */}
              <span className="absolute top-[80px] left-[15%] font-mono text-[9px] text-slate-400 font-semibold">West Lake Hills</span>
              <span className="absolute bottom-[60px] right-[25%] font-mono text-[9px] text-slate-400 font-semibold">East Austin</span>

              {/* Client Bubble Markers mapped out dynamically */}
              {pastClients.map((client) => {
                // map coordinates to local CSS percentages (Austin coordinates bounding box)
                // Austin lat: 30.25 to 30.32, long: -97.8 to -97.7
                const latMin = 30.25;
                const latMax = 30.32;
                const lngMin = -97.80;
                const lngMax = -97.70;

                const pctY = 100 - ((client.latitude - latMin) / (latMax - latMin)) * 100;
                const pctX = ((client.longitude - lngMin) / (lngMax - lngMin)) * 100;

                const isSelected = selectedClient?.id === client.id;
                const isHigh = client.moving_probability >= 85;

                return (
                  <div
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    style={{
                      top: `${Math.min(90, Math.max(10, pctY))}%`,
                      left: `${Math.min(90, Math.max(10, pctX))}%`
                    }}
                    className={`absolute -translate-x-[50%] -translate-y-[50%] cursor-pointer group z-10`}
                  >
                    {/* Ring highlight */}
                    <div className={`absolute -inset-3.5 rounded-full animate-ping duration-1000 pointer-events-none opacity-40 ${
                      isSelected ? "bg-teal-500" : isHigh ? "bg-red-500" : "bg-amber-500"
                    }`} />

                    {/* Circle marker */}
                    <div className={`w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-teal-500 border-white scale-125 shadow-lg shadow-teal-600/30"
                        : isHigh
                          ? "bg-red-500 hover:scale-110"
                          : "bg-amber-500 hover:scale-110"
                    }`} />

                    {/* Pop tooltip */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-mono rounded px-2.5 py-1 z-50 whitespace-nowrap shadow-md">
                      <span className="font-bold">{client.name}</span> ({client.moving_probability}% Relo)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action trigger component builder */}
          {selectedClient && (
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    Targeting: <span className="text-teal-700 font-extrabold">{selectedClient.name}</span>
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                    Address: {selectedClient.address} • Close Date: {new Date(selectedClient.close_date).toLocaleDateString()}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loadingDraft}
                  onClick={() => handleGenerateDraft(selectedClient)}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-150 border border-teal-200 text-teal-700 text-xs rounded transition-all duration-200 flex items-center gap-1.5 self-start font-mono font-bold cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  {loadingDraft ? "AI Drafting..." : "Generate check-in draft"}
                </button>
              </div>

              {/* Draft text showcase */}
              {draftResult ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Automated Draft check-in message
                    </label>
                    <textarea
                      value={draftResult}
                      onChange={(e) => setDraftResult(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-slate-205 rounded p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans leading-relaxed font-medium"
                    />
                  </div>

                  <div className="flex justify-between items-center bg-teal-50/50 p-2.5 rounded border border-teal-100">
                    <span className="text-[9px] text-slate-500 font-mono font-bold">
                      Calculated tech-fee: $0 (included in subscription)
                    </span>
                    <button
                      type="button"
                      onClick={() => executeSend(selectedClient.id)}
                      disabled={sentClients.includes(selectedClient.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-555 disabled:opacity-50 text-white font-bold rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {sentClients.includes(selectedClient.id) ? "Sent" : "Send Outbound"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded bg-white">
                  <Mail className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">
                    Click "Generate check-in draft" to have Gemini build custom transactional messages based on property equity & years lived.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Notifications */}
        {successNotif && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-mono font-bold tracking-wide text-left animate-bounce">
            ✔ {successNotif}
          </div>
        )}
      </div>
    </div>
  );
}
