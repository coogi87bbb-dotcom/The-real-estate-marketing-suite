import React from "react";
import { TrendingUp, Clock, Percent, Megaphone, HelpCircle, Activity, Award } from "lucide-react";
import { Tenant } from "../types";

interface ControlCenterProps {
  currentTenant: Tenant;
}

export default function ControlCenter({ currentTenant }: ControlCenterProps) {
  // Analytical metrics calculations based on active plan rules
  const pricingCampaignCountMultiplier = currentTenant.subscription_tier === "Enterprise Brokerage" ? 5 : currentTenant.subscription_tier === "Pro Team" ? 2 : 1;
  const leadVelocity = (3.4 * pricingCampaignCountMultiplier).toFixed(1);
  const conversionRate = currentTenant.subscription_tier === "Enterprise Brokerage" ? "6.8%" : "4.2%";
  const responseLatency = currentTenant.subscription_tier === "Enterprise Brokerage" ? "1.2s" : "1.8s";
  const roiMultiplier = currentTenant.subscription_tier === "Enterprise Brokerage" ? "5.4x" : "4.2x";

  // Mock hourly velocity metrics for SVG graph rendering
  const velocityPoints = [
    { hour: "08:00", count: 12 },
    { hour: "10:00", count: 24 },
    { hour: "12:00", count: 45 },
    { hour: "14:00", count: 32 },
    { hour: "16:00", count: 58 },
    { hour: "18:00", count: 74 },
    { hour: "20:00", count: 41 }
  ];

  return (
    <div id="control-center-module" className="space-y-8">
      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Met 1: Inbound Lead Velocity */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Inbound Velocity</span>
            <Activity className="h-4 w-4 text-teal-600 shrink-0" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              {leadVelocity} <span className="text-slate-400 text-xs font-normal">/ hr</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-0.5 font-mono">
              <span className="text-teal-600 font-bold">+12%</span> vs last period
            </p>
          </div>
        </div>

        {/* Met 2: AI Response Latency */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">AI Latency</span>
            <Clock className="h-4 w-4 text-teal-600 shrink-0" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              {responseLatency}
            </div>
            <p className="text-[10px] text-teal-600 mt-1 font-mono uppercase tracking-wider font-bold">
              Low-latency node
            </p>
          </div>
        </div>

        {/* Met 3: Conversion Rate */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Inbound Conv. %</span>
            <Percent className="h-4 w-4 text-teal-600 shrink-0" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              {conversionRate}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-0.5 font-mono">
              Across teams
            </p>
          </div>
        </div>

        {/* Met 4: Active paid campaigns */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Paid Placements</span>
            <Megaphone className="h-4 w-4 text-teal-600 shrink-0" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              {currentTenant.active_campaigns_count} <span className="text-slate-400 text-xs font-normal">Active</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono font-medium">
              Budget: ${currentTenant.ad_spend_budget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Met 5: Ad spend ROI */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Ad Spend ROI</span>
            <TrendingUp className="h-4 w-4 text-teal-600 shrink-0" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              {roiMultiplier}
            </div>
            <p className="text-[10px] text-teal-600 mt-1 flex items-center gap-0.5 font-mono font-bold font-semibold">
              Proven attribution
            </p>
          </div>
        </div>

      </div>

      {/* Analytical visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lead Velocity Hourly line graph */}
        <div className="lg:col-span-8 border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-slate-900 font-extrabold text-sm">Lead Velocity Distribution</h4>
              <p className="text-[10px] text-slate-500 font-medium">Inbound qualification triggers tracked hourly</p>
            </div>
            <span className="text-[10.5px] font-mono text-teal-600 font-bold">Austin Apex Router</span>
          </div>

          <div className="h-[240px] w-full relative flex items-end">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none opacity-10">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="border-b border-slate-450 w-full" />
              ))}
            </div>

            {/* Render Custom high fidelity Line chart visually */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Glow filter */}
              <defs>
                <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d="M 5,95 Q 15,70 30,55 T 50,30 T 70,15 T 85,45 T 95,95 Z"
                fill="url(#gradient-area)"
                className="transition-all duration-1000"
              />

              {/* Line path */}
              <path
                d="M 5,95 Q 15,70 30,55 T 50,30 T 70,15 T 85,45 T 95,65"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Columns labels */}
            <div className="absolute bottom-1 inset-x-0 flex justify-between px-3 text-[9px] font-mono text-slate-400 font-bold">
              {velocityPoints.map((p, idx) => (
                <span key={idx}>{p.hour}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Circular conversion funnel helper block */}
        <div className="lg:col-span-4 border border-slate-200 bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-slate-900 font-extrabold text-sm mb-2">Automated Funnel Attribution</h4>
            <p className="text-[11px] text-slate-500 mb-6 font-medium">Real-time status allocations mapping from lead entry to mortgage approvals</p>

            <div className="space-y-4 font-mono text-[10.5px]">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>1. Inbound Ingress</span>
                  <span>100% (30 leads logged)</span>
                </div>
                <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded overflow-hidden">
                  <div className="bg-teal-600 h-full w-[100%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>2. Qualified / AI Nurtures</span>
                  <span>75% (22 leads)</span>
                </div>
                <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded overflow-hidden">
                  <div className="bg-teal-500 h-full w-[75%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>3. Mortgage Approvals</span>
                  <span>35% (11 leads)</span>
                </div>
                <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded overflow-hidden">
                  <div className="bg-blue-600 h-full w-[35%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <Award className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-semibold text-slate-500">Enterprise priority seat syncing</span>
          </div>
        </div>

      </div>
    </div>
  );
}
