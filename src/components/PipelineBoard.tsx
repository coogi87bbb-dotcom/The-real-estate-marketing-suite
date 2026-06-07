import React, { useState } from "react";
import { Search, MapPin, DollarSign, Award, ShieldAlert, Key, MessageSquare, ArrowRight, User, Phone, CheckCircle2, AlertTriangle } from "lucide-react";
import { Lead, LeadStage, ChatLog } from "../types";

interface PipelineBoardProps {
  leads: Lead[];
  chatLogs: ChatLog[];
  onRefresh: () => void;
  onUpdateStage: (leadId: string, stage: LeadStage) => void;
}

export default function PipelineBoard({
  leads,
  chatLogs,
  onRefresh,
  onUpdateStage
}: PipelineBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  const stages: LeadStage[] = [
    LeadStage.NEW,
    LeadStage.AI_NURTURING,
    LeadStage.QUALIFIED,
    LeadStage.MORTGAGE_REVIEW,
    LeadStage.SCHEDULED,
    LeadStage.HANDED_OFF
  ];

  // Filter leads based on query
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.property_preferences.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.listing_interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLeadsByStage = (stage: LeadStage) => {
    return filteredLeads.filter((l) => l.stage === stage);
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setChatInput("");
  };

  // Submit secure text message simulation & trigger automated smart response
  const handleSendChatMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !chatInput.trim() || sendingChat) return;

    setSendingChat(true);
    const textToSend = chatInput;
    setChatInput("");

    try {
      // send message as 'lead' simulating customer text input
      const response = await fetch("/api/leads/add-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          message: textToSend,
          sender: "lead"
        })
      });

      if (response.ok) {
        onRefresh();
        // Read clean updating states
        const stateRes = await fetch("/api/state");
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          const freshLead = stateData.leads.find((l: any) => l.id === selectedLead.id);
          if (freshLead) setSelectedLead(freshLead);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingChat(false);
    }
  };

  const handleDragStageChange = async (leadId: string, idx: number) => {
    const nextStage = stages[idx];
    if (nextStage) {
      onUpdateStage(leadId, nextStage);
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, stage: nextStage });
      }
    }
  };

  return (
    <div id="interactive-pipeline-module" className="space-y-6">
      
      {/* Filtering Header Menu */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm font-sans">
        <div className="flex items-center gap-3 w-full md:w-80">
          <div className="bg-slate-50 border border-slate-205 rounded-lg flex items-center px-3 py-2 w-full">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter leads name, interest, or pref..."
              className="bg-transparent border-none text-xs text-slate-800 outline-none w-full ml-2 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[10px] font-bold">LAYOUT TYPE:</span>
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === "kanban" ? "bg-teal-600 text-white font-semibold shadow-sm shadow-teal-900/10" : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Kanban Stages
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === "table" ? "bg-teal-600 text-white font-semibold shadow-sm shadow-teal-900/10" : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Data Grid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 font-sans">
        
        {/* Main board or grid */}
        <div className="xl:col-span-8">
          {viewMode === "kanban" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {stages.map((stage, idx) => {
                const stageLeads = getLeadsByStage(stage);
                return (
                  <div key={stage} className="bg-slate-100/50 border border-slate-200 rounded-xl p-3 flex flex-col h-[520px] shadow-sm">
                    <div className="pb-2 border-b border-slate-200/80 flex justify-between items-center mb-3">
                      <span className="text-[9.5px] uppercase font-mono tracking-wider font-extrabold text-slate-500 truncate">
                        {stage}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-650 text-[10px] font-mono rounded-full font-bold">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2 overflow-y-auto flex-1 pr-0.5">
                      {stageLeads.map((lead) => {
                        const isSelected = selectedLead?.id === lead.id;
                        return (
                          <div
                            key={lead.id}
                            onClick={() => handleSelectLead(lead)}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "border-teal-500 bg-teal-50/20 shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className="font-extrabold text-xs text-slate-900 block truncate">{lead.name}</span>
                            <span className="text-[10px] font-mono text-slate-500 block truncate mt-0.5">
                              {lead.property_preferences}
                            </span>
                            
                            <div className="mt-3 flex items-center justify-between text-[9px] font-mono border-t border-slate-150 pt-2 text-slate-550">
                              <span className="text-teal-650 font-bold">FICO: {lead.credit_score}</span>
                              <span className="text-emerald-600 font-extrabold">${(lead.income / 1000).toFixed(0)}k/yr</span>
                            </div>

                            {/* Controls to move stage simply inside sandbox */}
                            <div className="mt-2.5 pt-2 border-t border-slate-150 flex justify-between gap-1 items-center">
                              <span className="text-[8px] text-slate-400 uppercase font-mono font-bold">Move stage</span>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDragStageChange(lead.id, idx - 1);
                                  }}
                                  className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] border border-slate-250 rounded disabled:opacity-30 hover:bg-slate-200 cursor-pointer"
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === stages.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDragStageChange(lead.id, idx + 1);
                                  }}
                                  className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] border border-slate-250 rounded disabled:opacity-30 hover:bg-slate-200 cursor-pointer"
                                >
                                  ▶
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Data Grid Table
            <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="text-[10px] uppercase font-mono bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th className="p-3.5 pl-5">Lead Name</th>
                      <th className="p-3.5">Assigned Stage</th>
                      <th className="p-3.5">FICO score</th>
                      <th className="p-3.5">Income (yr)</th>
                      <th className="p-3.5">Listing Interest</th>
                      <th className="p-3.5 pr-5">Last Interaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => handleSelectLead(lead)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-teal-50/15" : "hover:bg-slate-50/80"
                          }`}
                        >
                          <td className="p-3.5 pl-5 font-bold text-slate-900">{lead.name}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200 rounded font-semibold">
                              {lead.stage}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 font-semibold">{lead.credit_score}</td>
                          <td className="p-3.5 font-mono text-emerald-600 font-extrabold">${lead.income.toLocaleString()}</td>
                          <td className="p-3.5 truncate max-w-[140px] text-slate-500 font-medium">{lead.listing_interest}</td>
                          <td className="p-3.5 pr-5 font-mono text-slate-400">
                            {new Date(lead.last_interaction_time).toLocaleTimeString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Lead profile Drawer & Simulator messages */}
        <div className="xl:col-span-4">
          {selectedLead ? (
            <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-6 shadow-sm">
              
              {/* Profile card */}
              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex justify-between items-start gap-1">
                  <div>
                    <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">{selectedLead.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {selectedLead.id}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-mono rounded font-semibold">
                    {selectedLead.stage}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2 text-[11px] font-mono text-slate-650">
                  <div className="bg-slate-50 p-2 border border-slate-200 rounded">
                    <span className="text-slate-400 block font-bold text-[9px]">ANNUAL INCOME:</span>
                    <span className="text-emerald-600 font-extrabold">${selectedLead.income.toLocaleString()}/yr</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200 rounded">
                    <span className="text-slate-400 block font-bold text-[9px]">CREDIT SCORE:</span>
                    <span className="text-teal-650 font-extrabold">{selectedLead.credit_score} FICO</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-655 space-y-1">
                  <div>
                    <span className="text-slate-400 font-bold text-[9px]">INTEREST LISTINGS:</span>
                    <p className="text-slate-700 mt-0.5 font-sans leading-normal font-medium">{selectedLead.listing_interest}</p>
                  </div>
                  <div className="mt-2 text-slate-655">
                    <span className="text-slate-400 font-bold text-[9px]">CRITERIA PREFERENCES:</span>
                    <p className="text-slate-700 mt-0.5 font-sans leading-normal font-medium">{selectedLead.property_preferences}</p>
                  </div>
                </div>
              </div>

              {/* Stateful interactive Conversation track logs */}
              <div className="space-y-4 font-sans">
                <h5 className="text-[10px] uppercase font-mono tracking-wider text-teal-620 font-extrabold block">
                  Tri-Party Conversation Logs (Real-time)
                </h5>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 h-[240px] overflow-y-auto space-y-3 flex flex-col justify-end">
                  <div className="space-y-3 overflow-y-auto max-h-full pr-1">
                    {chatLogs
                      .filter((c) => c.lead_id === selectedLead.id)
                      .map((chat) => {
                        const isAI = chat.sender === "ai";
                        const isMortgage = chat.sender === "mortgage";
                        const isAgent = chat.sender === "agent";

                        return (
                          <div
                            key={chat.id}
                            className={`p-2.5 rounded-lg text-xs max-w-[85%] font-sans leading-relaxed shadow-sm border ${
                              isAI
                                ? "bg-white border-slate-200 text-slate-800 self-start"
                                : isMortgage
                                  ? "bg-teal-50 border-teal-200 text-teal-900 self-start shrink-0"
                                  : isAgent
                                    ? "bg-blue-50 border-blue-200 text-blue-900 self-end shrink-0"
                                    : "bg-slate-800 border-slate-900 text-white self-end ml-auto"
                            }`}
                          >
                            <span className="block text-[8px] uppercase font-mono text-slate-450 mb-1 font-bold">
                              {chat.sender === "lead" ? "CLIENT QUOTE" : chat.sender.toUpperCase()} • {new Date(chat.timestamp).toLocaleTimeString()}
                            </span>
                            <p className="font-medium">{chat.message}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Simulated Customer Text response input */}
                <form onSubmit={handleSendChatMsg} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Simulate client texting: e.g. income is 150k..."
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 outline-none grow font-medium placeholder:text-slate-400 focus:border-teal-500 transition-colors"
                  />
                  <button
                    disabled={sendingChat || !chatInput.trim()}
                    type="submit"
                    className="px-4 py-2.5 bg-teal-650 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
                <span className="block text-[9px] text-slate-400 font-semibold font-sans tracking-tight">
                  💡 Type FICO range or annual salaries to trigger active tri-party eligibility unlocks.
                </span>
              </div>

            </div>
          ) : (
            <div className="border border-slate-200 bg-white rounded-xl p-12 text-center text-slate-500 text-xs shadow-sm font-medium">
              Select or click on a lead card/row on the left to see full profile metrics and co-pilot triage conversations.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
