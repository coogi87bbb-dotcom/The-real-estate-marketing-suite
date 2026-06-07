import React, { useState } from "react";
import { Phone, Plus, Settings2, Sparkles, Check, Play, User, RefreshCw } from "lucide-react";
import { PhoneNode, Tenant } from "../types";

interface VoiceReceptionistProps {
  currentTenant: Tenant;
  phoneNodes: PhoneNode[];
  onRefresh: () => void;
  onAddedNode: () => void;
}

export default function VoiceReceptionist({
  currentTenant,
  phoneNodes,
  onRefresh,
  onAddedNode
}: VoiceReceptionistProps) {
  const [selectedNode, setSelectedNode] = useState<PhoneNode | null>(phoneNodes[0] || null);
  const [loading, setLoading] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [persona, setPersona] = useState(selectedNode?.voice_persona || "Kore (Friendly Texan)");
  const [script, setScript] = useState(selectedNode?.greeting_script || "");
  const [fallback, setFallback] = useState(selectedNode?.fallback_routing || "");
  const [savedMsg, setSavedMsg] = useState("");

  const voicePersonas = [
    "Kore (Friendly Texan) - Deep, resonant warmth, perfect for southern hospitality",
    "Zephyr (Modern Technical) - Fast, precise, corporate elegance suited for luxury",
    "Puck (Energetic Creator) - Bright, playful, conversational for friendly bungalows",
    "Charon (Calm Professional) - Steady, grounding voice for mortgage partners",
    "Kore (Classic English) - Polished, authoritative accent for historic estates"
  ];

  // Select a node and update locals
  const handleSelectNode = (node: PhoneNode) => {
    setSelectedNode(node);
    setPersona(node.voice_persona);
    setScript(node.greeting_script);
    setFallback(node.fallback_routing);
    setSavedMsg("");
  };

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/voice/generate-node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: currentTenant.id,
          label: newLabel
        })
      });

      if (response.ok) {
        setNewLabel("");
        onAddedNode();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;
    setLoading(true);
    setSavedMsg("");

    try {
      const response = await fetch("/api/voice/save-node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: selectedNode.id,
          greeting_script: script,
          voice_persona: persona,
          fallback_routing: fallback
        })
      });

      if (response.ok) {
        setSavedMsg("Settings successfully synchronized! Autopilot webhook updated.");
        onRefresh();
        setTimeout(() => setSavedMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="voice-receptionist-module" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* Node Select & Sign Generator */}
      <div className="xl:col-span-5 space-y-6">
        <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5">
          <h4 className="text-zinc-200 font-semibold mb-4 text-sm flex items-center justify-between">
            <span>Virtual Yard Sign Numbers</span>
            <span className="font-mono text-[9px] text-zinc-500">Retell / Vapi Node Ingress</span>
          </h4>

          {/* Create Node Form */}
          <form onSubmit={handleCreateNode} className="flex gap-2 mb-6">
            <input
              type="text"
              required
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. 104 West Oak Flyer yard sign"
              className="bg-zinc-900 border border-zinc-850 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 grow font-sans"
            />
            <button
              disabled={loading || !newLabel.trim()}
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Allocate Sign
            </button>
          </form>

          {/* List Numbers */}
          <div className="space-y-2.5">
            {phoneNodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => handleSelectNode(n)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected ? "border-indigo-600 bg-indigo-950/20" : "border-zinc-850 bg-zinc-900 hover:bg-zinc-850"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-xs text-zinc-200 block">{n.label}</span>
                    <span className="text-[10px] font-mono text-indigo-400 block font-semibold">{n.phone_number}</span>
                    <span className="text-[9px] text-zinc-500 font-sans block">{n.voice_persona}</span>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-zinc-850 text-zinc-400 text-[9px] font-mono rounded border border-zinc-800">
                      {n.calls_count} calls logged
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Communication Log Simulation */}
        <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-4">
          <h5 className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">Live Sign Audio Node Monitors</h5>
          
          <div className="space-y-2.5">
            <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5 animate-pulse">
                ● LINE ACTIVE
              </span>
              <span className="text-zinc-400">Sign QR Ingress Austin #node-1</span>
              <span className="text-zinc-500">Duration: 42s</span>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">● STANDBY</span>
              <span className="text-zinc-400">West Lake Hills Flyer #node-2</span>
              <span className="text-zinc-500">-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Prompt customization canvas */}
      <div className="xl:col-span-7">
        {selectedNode ? (
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-900/30 text-indigo-400 rounded-lg">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-zinc-200 font-semibold">{selectedNode.label} Configuration</h4>
                <p className="text-[11px] text-zinc-500">Virtual Sign: {selectedNode.phone_number}</p>
              </div>
            </div>

            {savedMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 rounded text-xs font-mono">
                ✔ {savedMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                  AI Phone Receptionist Voice Persona
                </label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 text-zinc-200 text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {voicePersonas.map((vp) => (
                    <option key={vp} value={vp}>
                      {vp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                    Live Sign greeting script prompt canvas
                  </label>
                  <span className="text-[9px] text-indigo-400 flex items-center gap-0.5 font-mono">
                    <Sparkles className="h-2.5 w-2.5" />
                    Autopilot synthesis
                  </span>
                </div>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={4}
                  required
                  placeholder="Enter script details or instructions..."
                  className="w-full bg-zinc-900 border border-zinc-850 p-3.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none rounded-lg"
                />
                <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                  Our Vapi node converts this text directly to low-latency streaming PCM audio. Use simple punctuation to enforce micro-pauses.
                </p>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                  Fallback Routing Backup Phone Number (Agent Backup)
                </label>
                <input
                  type="text"
                  required
                  value={fallback}
                  onChange={(e) => setFallback(e.target.value)}
                  placeholder="e.g. +1(512) 555-0100"
                  className="w-full bg-zinc-900 border border-zinc-850 rounded px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-700/30 text-indigo-300 font-semibold rounded text-xs transition-all flex items-center gap-1.5 font-mono"
                >
                  <Play className="h-3.5 w-3.5 fill-indigo-400" />
                  Audition synthesized voice
                </button>

                <button
                  disabled={loading}
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded text-xs transition-all"
                >
                  {loading ? "Synchronizing Vapi Node..." : "Save Receptionist Prompts"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-12 text-center text-zinc-500">
            Select a virtual yard sign number to access the configuration prompt canvas.
          </div>
        )}
      </div>
    </div>
  );
}
