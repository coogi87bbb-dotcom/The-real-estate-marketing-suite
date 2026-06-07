import React, { useState } from "react";
import { Film, Play, Eye, Cpu, RefreshCw, Layers, CheckCircle2, Volume2, Sparkles, Plus } from "lucide-react";
import { VideoQueueItem, VideoTemplate } from "../types";

interface VideoStudioProps {
  videoQueue: VideoQueueItem[];
  onRefresh: () => void;
}

export default function VideoStudio({ videoQueue, onRefresh }: VideoStudioProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoQueueItem | null>(videoQueue[0] || null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("Cinematic Swiss Modern");
  const [addingAddress, setAddingAddress] = useState("");
  const [addingStatus, setAddingStatus] = useState<"Just Listed" | "Price Dropped">("Just Listed");
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Swiss-grid designed kinetic walkthrough templates
  const videoTemplates: VideoTemplate[] = [
    { id: "tmpl-1", name: "Cinematic Swiss Modern", aspectRatio: "16:9", musicMood: "Ambient Lofi Synth", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
    { id: "tmpl-2", name: "Yard sign Tik Tok Vertical", aspectRatio: "9:16", musicMood: "Upbeat Electro Sax", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" },
    { id: "tmpl-3", name: "Broker Premium Panoramic", aspectRatio: "16:9", musicMood: "Modern Orchestral Drone", thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
    { id: "tmpl-4", name: "Mini Walkthrough Reels", aspectRatio: "9:16", musicMood: "Hip Hop Chill Beats", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0" }
  ];

  const handleSimulateStatus = async (videoId: string) => {
    setSimulatingId(videoId);
    try {
      const response = await fetch("/api/video/simulate-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: videoId })
      });

      if (response.ok) {
        onRefresh();
        // Automatically select the newly generated video to see the script!
        const stateRes = await fetch("/api/state");
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          const freshItem = stateData.videoQueue.find((v: any) => v.id === videoId);
          if (freshItem) {
            setSelectedVideo(freshItem);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingId(null);
    }
  };

  const handleAddCustomWalkthrough = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingAddress.trim()) return;
    setLoadingAdd(true);

    try {
      const response = await fetch("/api/video/add-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addingAddress,
          status: addingStatus
        })
      });

      if (response.ok) {
        setAddingAddress("");
        onRefresh();
        // Run simulation immediately
        const data = await response.json();
        if (data.item?.id) {
          await handleSimulateStatus(data.item.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div id="video-studio-module" className="grid grid-cols-1 xl:grid-cols-12 gap-8 font-sans">
      
      {/* Template Select Grid */}
      <div className="xl:col-span-4 space-y-6">
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <h4 className="text-slate-900 font-extrabold text-sm font-sans uppercase tracking-tight">Kinetic Walkthrough Templates</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {videoTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => setTemplateName(t.name)}
                className={`group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200 ${
                  templateName === t.name ? "border-teal-600 ring-2 ring-teal-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="aspect-[4/3] relative bg-slate-100">
                  <img src={t.thumbnail} alt={t.name} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-2 left-2 text-[8px] font-mono border border-slate-700/50 bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase font-bold">
                    {t.aspectRatio}
                  </span>
                </div>
                <div className="p-2.5 bg-white">
                  <span className="font-extrabold text-[11px] text-slate-800 block leading-tight truncate">{t.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5 font-semibold">{t.musicMood}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual MLS Feed Auto-trigger Simulation Form */}
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">Simulate MLS status flag changes</h4>
          <p className="text-[11px] text-slate-505 leading-normal font-medium">
            Manually trigger a property state flip below to simulate monitoring the local MLS. 
            Nexus-AI programmatically intercepts the status, queues kinetic stitching, and builds the ad copy.
          </p>

          <form onSubmit={handleAddCustomWalkthrough} className="space-y-3">
            <div>
              <label className="block text-[9px] font-mono text-slate-450 uppercase mb-1 font-bold">
                Property Address string
              </label>
              <input
                type="text"
                required
                value={addingAddress}
                onChange={(e) => setAddingAddress(e.target.value)}
                placeholder="e.g. 101 Lake Austin waterfront"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddingStatus("Just Listed")}
                className={`flex-1 py-1.5 text-[10px] font-mono rounded font-semibold border cursor-pointer transition-colors ${
                  addingStatus === "Just Listed"
                    ? "bg-teal-50 border-teal-500 text-teal-700 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                Just Listed
              </button>
              <button
                type="button"
                onClick={() => setAddingStatus("Price Dropped")}
                className={`flex-1 py-1.5 text-[10px] font-mono rounded font-semibold border cursor-pointer transition-colors ${
                  addingStatus === "Price Dropped"
                    ? "bg-teal-50 border-teal-500 text-teal-700 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                Price Dropped
              </button>
            </div>

            <button
              disabled={loadingAdd || !addingAddress.trim()}
              type="submit"
              className="w-full py-2 bg-teal-650 hover:bg-teal-600 text-white font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {loadingAdd ? "Stitching video walkthrough..." : "Simulate status drop in MLS"}
            </button>
          </form>
        </div>
      </div>

      {/* Video template preview screen & logs */}
      <div className="xl:col-span-8 space-y-6">
        <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm font-sans">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-slate-900 font-extrabold text-sm">Active walkthrough rendering screen</h4>
            <span className="font-mono text-[9px] text-teal-700 border border-teal-200 bg-teal-50 px-2.5 py-1 rounded font-bold">
              WALKTHROUGH: {templateName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Player block */}
            <div className="md:col-span-7">
              <div className="bg-slate-100 border border-slate-200 rounded-xl aspect-[16/9] relative overflow-hidden flex items-center justify-center group shadow-md">
                {selectedVideo?.url ? (
                  <>
                    <img
                      src={selectedVideo.url}
                      alt="walkthrough"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

                    {/* Simulation overlays */}
                    <div className="absolute top-4 left-4 flex gap-1 z-15">
                      <span className="px-2 py-0.5 bg-red-650 text-white text-[9px] font-mono rounded font-extrabold uppercase tracking-wider shadow">
                        {selectedVideo.status}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-white text-[9px] font-mono rounded shadow font-bold">
                        Walkthrough Active
                      </span>
                    </div>

                    {/* Kinetic Text Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-15 bg-slate-950/70 backdrop-blur-sm p-3.5 rounded border border-slate-800/40 animate-pulse">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-bold block mb-1">
                        Kinetic Text overlay
                      </span>
                      <p className="text-white text-xs font-semibold leading-relaxed">
                        {selectedVideo.voiceover_script || "Rendering text content..."}
                      </p>
                    </div>

                    <button className="w-11 h-11 bg-white hover:bg-slate-50 text-slate-950 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all z-20 cursor-pointer">
                      <Play className="h-5 w-5 fill-slate-800 text-slate-800 ml-1" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Film className="h-10 w-10 text-slate-400 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-500 font-mono">
                      Select a compiled walkthrough file from the monitoring logs on the right to view active templates.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compiled walk script review */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg h-full space-y-4">
                <div>
                  <h5 className="text-[10px] uppercase font-mono tracking-wider text-teal-700 font-extrabold mb-1">
                    ✔ Voiceover & walkthrough metadata
                  </h5>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-semibold">
                    AI programmatically matches the listing images to render Swiss-Modern kinetic text sweeps.
                  </p>
                </div>

                {selectedVideo ? (
                  <div className="space-y-3 font-mono text-[10px] text-slate-600">
                    <div>
                      <span className="text-slate-400 font-bold block">MLS ADDRESS TARGET:</span>
                      <p className="text-slate-800 font-sans font-extrabold text-xs mt-0.5">{selectedVideo.address}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block">MUSIC & VOICES MOOD:</span>
                      <p className="text-slate-700 mt-0.5 flex items-center gap-1 font-bold">
                        <Volume2 className="h-3.5 w-3.5 text-teal-700 animate-pulse" />
                        80kbps Wav Ambient
                      </p>
                    </div>

                    {selectedVideo.voiceover_script && (
                      <div className="border-t border-slate-200 pt-2.5 bg-white p-2.5 rounded-lg shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider text-teal-700 font-bold block mb-1">Voiceover audio script output</span>
                        <p className="text-slate-800 font-mono text-[10px] leading-relaxed font-bold italic">
                          "{selectedVideo.voiceover_script}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-6">
                    No active property details selected.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Media Background Compilation Queue Monitors */}
        <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h5 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">
              Autonomous walk media processing Log
            </h5>
            <span className="text-[10px] font-mono text-slate-400 font-bold">MLS Rendering Queue</span>
          </div>

          <div className="space-y-3">
            {videoQueue.map((item) => {
              const isSimulating = simulatingId === item.id;
              const isCompleted = item.progress === 100;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isCompleted) setSelectedVideo(item);
                  }}
                  className={`p-3.5 bg-slate-50 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer transition-all ${
                    selectedVideo?.id === item.id ? "ring-2 ring-teal-500 border-teal-500 bg-teal-50/10 shadow-sm" : "border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="space-y-1 grow">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{item.address}</span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded font-bold uppercase ${
                        item.status === "Price Dropped" ? "bg-red-50 text-red-750 border border-red-200" : "bg-emerald-50 text-emerald-750 border border-emerald-200"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Walk length: {item.duration_sec}s • Aspect Ratio: 16:9 • Status: <span className="font-bold text-slate-700">{item.status_text}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0 font-mono">
                    {/* Render Progress track */}
                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.progress}%` }}
                        className={`h-full transition-all duration-300 ${
                          isCompleted ? "bg-emerald-500" : "bg-teal-500 animate-pulse"
                        }`}
                      />
                    </div>

                    <span className="font-mono text-xs text-slate-700 font-bold">{item.progress}%</span>

                    {!isCompleted ? (
                      <button
                        type="button"
                        disabled={isSimulating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateStatus(item.id);
                        }}
                        className="px-2.5 py-1 bg-teal-650 hover:bg-teal-600 disabled:opacity-50 text-white text-[10px] rounded font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {isSimulating ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Cpu className="h-3 w-3" />
                        )}
                        Compile Walk
                      </button>
                    ) : (
                      <span className="text-emerald-800 flex items-center gap-0.5 text-[9px] uppercase font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-700 animate-pulse" /> Ready
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
