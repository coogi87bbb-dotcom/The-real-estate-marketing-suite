import React, { useState } from "react";
import { CreditCard, Check, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";
import { Tenant, BillingStatus } from "../types";

interface StripeBillingProps {
  currentTenant: Tenant;
  onSubscriptionUpdated: () => void;
  onRefresh: () => void;
}

export default function StripeBilling({
  currentTenant,
  onSubscriptionUpdated,
  onRefresh
}: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"Starter" | "Pro Team" | "Enterprise Brokerage">(
    currentTenant.subscription_tier
  );
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("***");
  const [successMsg, setSuccessMsg] = useState("");

  const plans = [
    {
      name: "Starter" as const,
      price: "$299",
      period: "mo",
      description: "For individual elite agents scaling local ad outreach.",
      features: [
        "1 Autonomous Voice Sign Receptionist Node",
        "AI Ad Architect (10% standard fee per campaign)",
        "30 Days lead tracking pipeline with notes",
        "Standard Fair Housing copy checker interceptor"
      ]
    },
    {
      name: "Pro Team" as const,
      price: "$599",
      period: "mo",
      description: "For active broker teams and mortgage co-piloting slots.",
      features: [
        "5 Autonomous Voice Receptionist Nodes",
        "Full Co-Pilot invitation portal for Mortgage Partners",
        "Autonomous Walkthrough video studio background queue",
        "Advanced RESPA legal pre-send advisor rewrites",
        "Predictive Relocation Index map & drafts builder"
      ],
      popular: true
    },
    {
      name: "Enterprise Brokerage" as const,
      price: "$1,999",
      period: "mo",
      description: "The complete automated full-funnel enterprise suite.",
      features: [
        "UNLIMITED Autonomous Voice Receptionist Nodes",
        "Dual-Agent + Mortgage automatic tri-party channel triage",
        "Fastest rendering queue priority (average under 60s)",
        "Premium localized historical transactional public maps",
        "Dedicated compliance audit logs",
        "Whiteglove system admin portal configuration settings"
      ]
    }
  ];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: currentTenant.id,
          card_holder: currentTenant.name,
          plan: selectedPlan
        })
      });

      if (response.ok) {
        setSuccessMsg(`Stripe payment secure token processed! Billing status set to ACTIVE for ${selectedPlan}.`);
        onSubscriptionUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateDelinquency = async () => {
    setLoading(true);
    try {
      await fetch("/api/tenant/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: currentTenant.id,
          data: { billing_status: BillingStatus.DELINQUENT }
        })
      });
      onSubscriptionUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="stripe-billing-module" className="space-y-8">
      {/* Delinquency Alert and Info */}
      {currentTenant.billing_status === BillingStatus.DELINQUENT ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-red-100 text-red-700 rounded-lg shrink-0 border border-red-200">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-red-900 font-extrabold text-base flex items-center gap-2">
                Tenant Subscription Status: Delinquent / Unpaid
              </h3>
              <p className="text-red-700 text-xs mt-1 max-w-2xl font-semibold leading-relaxed">
                Site-wide dashboard features have been locked. Webhook triggers are suspended. 
                Use the secure Stripe component below to authorize a payment of your active plan and reactivate instant access.
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-red-650 hover:bg-red-600 text-white text-xs rounded-lg transition-all shrink-0 font-mono font-bold cursor-pointer shadow-sm shadow-red-900/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Check Payment Gateway
          </button>
        </div>
      ) : (
        <div className="bg-emerald-55 border border-emerald-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-250 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-emerald-950 font-extrabold text-base">
                Billing Account Status Healthy
              </h3>
              <p className="text-emerald-850 text-xs mt-1 max-w-2xl font-semibold leading-relaxed">
                Your Stripe sub-accounts are syncing perfectly. You have {currentTenant.active_campaigns_count} active lead generation campaign(s). Autopilot features fully active.
              </p>
            </div>
          </div>
          <button
            onClick={simulateDelinquency}
            disabled={loading}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs rounded-lg font-mono font-bold transition-all duration-200 shrink-0 cursor-pointer"
          >
            Simulate Stripe Card decline (Delinquency)
          </button>
        </div>
      )}

      {/* Pricing Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isSelected = selectedPlan === p.name;
          const isCurrent = currentTenant.subscription_tier === p.name;
          return (
            <div
              key={p.name}
              className={`rounded-xl border relative flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-sm ${
                isCurrent
                  ? "border-teal-500 bg-teal-50/20 shadow-md shadow-teal-550/5"
                  : "border-slate-205 bg-white"
              }`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-bl-lg font-bold">
                  Recommended
                </div>
              )}
              
              <div className="p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-1">
                  {p.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold font-sans text-slate-900">{p.price}</span>
                  <span className="text-slate-400 text-sm font-semibold">/{p.period}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-semibold">
                  {p.description}
                </p>

                <div className="border-t border-slate-100 my-4" />

                <ul className="space-y-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-755 font-semibold leading-normal">
                      <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(p.name)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold font-sans transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-sm hover:bg-teal-555 font-bold"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {isCurrent ? "Active Tier Selection" : `Select ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Information Form */}
      <div className="bg-white border border-slate-205 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-sm">Stripe Payment Gateway Checkout</h4>
            <p className="text-xs text-slate-500 font-medium">Secure testing sandbox. Any 16-digit card will suffice.</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-lg text-xs font-mono font-bold">
            ✔ {successMsg}
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">
              Selected Product Subscription Plan
            </label>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center text-sm shadow-inner">
              <span className="font-extrabold text-slate-800">{selectedPlan}</span>
              <span className="font-mono text-slate-500 text-xs font-bold">
                {selectedPlan === "Starter" ? "$299/mo" : selectedPlan === "Pro Team" ? "$599/mo" : "$1,999/mo"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              required
              defaultValue={currentTenant.name}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3.5 py-2.5 text-slate-800 font-sans font-semibold focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="e.g. John Broker Owner"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">
                Card Number
              </label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-teal-500 transition-colors font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">
                Expiry
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-teal-500 transition-colors font-mono font-bold"
                placeholder="MM/YY"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold select-none">
              ⚡ Stripe Secure Sandbox
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-teal-650 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-2 shadow-sm shadow-teal-900/10 cursor-pointer"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Pay & Activate Now"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
