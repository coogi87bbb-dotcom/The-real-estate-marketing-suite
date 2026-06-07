import React, { useState } from "react";
import { UserPlus, Sparkles, Building, Phone, Mail, AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";
import { Tenant } from "../types";

interface CoPilotEngineProps {
  currentTenant: Tenant;
  mortgagePartners: any[];
  onInvitedPartner: () => void;
}

export default function CoPilotEngine({
  currentTenant,
  mortgagePartners,
  onInvitedPartner
}: CoPilotEngineProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");

  const handleInvitePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/mortgage/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: currentTenant.id,
          name,
          email,
          phone
        })
      });

      if (response.ok) {
        setMsg("Invitation dispatched secure link! Partner seat created.");
        setName("");
        setEmail("");
        setPhone("");
        onInvitedPartner();
        setTimeout(() => setMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = mortgagePartners.filter(p => p.tenant_id === currentTenant.id);

  return (
    <div id="copilot-mortgage-module" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* Invitation Portal Forms */}
      <div className="xl:col-span-5 space-y-6">
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
              <UserPlus className="h-4 w-4" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm">Preferred Mortgage Invite Portal</h4>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Invite your preferred local Mortgage Loan Officer (MLO) to share this tenant team workspace. 
            When leads qualify financially, their files auto-delegate to lock in competitive pre-approvals inside Perryman’s Nexus-AI.
          </p>

          {msg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-bold text-xs font-mono">
              ✔ {msg}
            </div>
          )}

          <form onSubmit={handleInvitePartner} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1.5 font-bold">
                Loan Officer Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1.5 font-bold">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. david.miller@trusthomeloans.com"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1.5 font-bold">
                Direct Contact Phone Number
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. (512) 555-0144"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded text-xs transition-all tracking-wide cursor-pointer"
            >
              {loading ? "Allocating Workspace Seat..." : "Dispatch Tenant Seat Invite"}
            </button>
          </form>
        </div>
      </div>

      {/* Shared Space & Interactive triage visualizer */}
      <div className="xl:col-span-7 space-y-6">
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <h4 className="text-slate-900 font-bold text-sm">Active Tri-Party Team Seats (Tenant Level)</h4>
          
          <div className="space-y-3">
            {/* Broker Seat */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-mono text-xs font-bold">
                  BO
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Broker Owner Main Seat</span>
                  <span className="text-[10px] text-slate-500 font-medium">Full administrative and campaign control logs</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-mono rounded font-bold">
                Tenant Owner
              </span>
            </div>

            {/* Realtor Seat */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-mono text-xs font-bold">
                  IA
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Individual Agent Seats</span>
                  <span className="text-[10px] text-slate-500 font-medium font-semibold">Primary operational assignees for handoffs</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-250 text-slate-600 text-[9px] font-mono rounded font-bold">
                Unlimited Seats
              </span>
            </div>

            {/* Invited Mortgage Partners */}
            {filteredPartners.length > 0 ? (
              filteredPartners.map((mp, i) => (
                <div key={i} className="p-3.5 bg-teal-50/50 border border-teal-100 rounded-lg flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100/60 border border-teal-200 flex items-center justify-center text-teal-700 font-mono text-xs font-bold">
                      MP
                    </div>
                    <div>
                      <span className="font-bold text-xs text-teal-850 block">{mp.name}</span>
                      <span className="text-[10px] text-slate-600 font-medium">{mp.email} • {mp.phone}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-mono rounded font-bold uppercase tracking-wide">
                    {mp.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3.5 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs italic font-medium">
                No active Mortgage Loan Officers invited yet for this workspace. Use the portal to trigger an assignment.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Channel Allocation Flow Diagram */}
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Automated Tri-Party Gateway Allocation Flow</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono">
              <span className="text-teal-600 font-bold block mb-1">1. LEAD DISCOVERY</span>
              AI Receptionist extracts FICO range
            </div>
            <div className="text-slate-400 text-lg hidden md:block select-none">→</div>
            <div className="p-2.5 bg-slate-50 border border-teal-100 rounded text-[10px] font-mono text-slate-800">
              <span className="text-teal-650 font-bold block mb-1">2. QUALIFICATION OK</span>
              Income & Credit logged to system
            </div>
            <div className="text-slate-400 text-lg hidden md:block select-none">→</div>
            <div className="p-2.5 bg-slate-905 border border-teal-200 rounded text-[10px] font-mono text-slate-800">
              <span className="text-teal-700 font-bold block mb-1">3. TRI-PARTY GATEWAY</span>
              Broker Owner, Agent & Loan Officer invited
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
