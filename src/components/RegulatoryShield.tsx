import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Check, RefreshCw, AlertCircle } from "lucide-react";

interface RegulatoryShieldProps {
  onCheckFinished?: (clean: boolean, resultText: string) => void;
}

export default function RegulatoryShield({ onCheckFinished }: RegulatoryShieldProps) {
  const [inputText, setInputText] = useState(
    "Perfect for young Christian families looking for an exclusive neighborhood! Only mature couples allowed here nearby local parks."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState<"idle" | "clean" | "flagged">("idle");
  const [holdDetails, setHoldDetails] = useState<{ phrase: string; reason: string; rewrite: string } | null>(null);

  const handleInterceptCheck = async () => {
    setAnalyzing(true);
    setStatus("idle");
    setHoldDetails(null);

    try {
      const response = await fetch("/api/compliance/intercept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_copy: inputText })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.clean) {
          setStatus("clean");
          if (onCheckFinished) onCheckFinished(true, inputText);
        } else {
          setStatus("flagged");
          setHoldDetails({
            phrase: data.phrase,
            reason: data.reason,
            rewrite: data.rewrite
          });
          if (onCheckFinished) onCheckFinished(false, data.rewrite);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const applyRewrite = () => {
    if (holdDetails) {
      setInputText(holdDetails.rewrite);
      setStatus("clean");
      setHoldDetails(null);
    }
  };

  // Preset quick triggers for user demonstration
  const loadPreset = (type: number) => {
    if (type === 1) {
      setInputText("This exclusive gated estate represents a wealthy only community, safe from noise.");
    } else if (type === 2) {
      setInputText("Spacious Travis Heights layout with big yard. Quiet streets perfect for all qualified buyers.");
    } else if (type === 3) {
      setInputText("No Section 8 accepted here, perfect cozy bachelors studio apartment.");
    }
    setStatus("idle");
    setHoldDetails(null);
  };

  return (
    <div id="regulatory-shield-module" className="border border-slate-200 bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            AI Compliance Shield Interceptor
          </h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Real-time validation algorithm checking text copies against Fair Housing (HUD) and RESPA criteria.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset(1)}
            type="button"
            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-600 rounded text-[10px] font-mono transition-colors cursor-pointer"
          >
            Load Steer Violation
          </button>
          <button
            onClick={() => loadPreset(3)}
            type="button"
            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-600 rounded text-[10px] font-mono transition-colors cursor-pointer"
          >
            Income Violation
          </button>
          <button
            onClick={() => loadPreset(2)}
            type="button"
            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-600 rounded text-[10px] font-mono transition-colors cursor-pointer"
          >
            Load Clean Ad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Box */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 mb-1.5">
              Copywriter / Text Interceptor Box
            </label>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              rows={5}
              placeholder="Enter ad copywriting or client messaging here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-800 font-sans font-medium focus:outline-none focus:border-teal-500 transition-colors leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono font-medium tracking-tight">
              Pre-send status is verified continuously
            </span>

            <button
              onClick={handleInterceptCheck}
              disabled={analyzing || !inputText.trim()}
              className="px-5 py-2 bg-teal-650 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-900/10"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Shield checking copy...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Run Pre-Send Validation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Verification Report */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="border border-slate-200 bg-slate-50 rounded-lg p-4 h-full flex flex-col justify-between">
            <div>
              <h5 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 mb-3">
                Pre-Send Analysis Log
              </h5>

              {status === "idle" && (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">
                    Input copy on the left and click "Run Pre-Send Validation" to check for illegal text terms.
                  </p>
                </div>
              )}

              {status === "clean" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-mono font-bold shadow-sm">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    STATUS: PASSED COMPLIANCE
                  </div>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed font-semibold">
                    This copy contains zero restricted terms. Highly compliant under Fair Housing HUD Guidelines & RESPA rules. Safe for active broadcast.
                  </p>
                </div>
              )}

              {status === "flagged" && holdDetails && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-mono font-bold shadow-xs animate-fade-in">
                    <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                    STATUS: COMPLIANCE HOLD TRIGGERED
                  </div>

                  <div className="text-[11.5px] space-y-1.5 bg-red-50/50 border border-red-100 p-3 rounded-lg">
                    <span className="text-red-700 font-bold block font-mono uppercase text-[9.5px]">
                      RESTRICTED TERM: "{holdDetails.phrase}"
                    </span>
                    <p className="text-slate-650 leading-relaxed font-semibold">{holdDetails.reason}</p>
                  </div>

                  <div className="border-t border-slate-200 pt-3 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-teal-650 font-bold block">
                      ✔ Recommended Rewrite (Powered by Gemini)
                    </span>
                    <p className="text-slate-800 text-xs italic leading-relaxed font-semibold bg-white p-2 border border-slate-150 rounded">
                      "{holdDetails.rewrite}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {status === "flagged" && holdDetails && (
              <button
                type="button"
                onClick={applyRewrite}
                className="w-full mt-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded transition-all duration-200 cursor-pointer shadow-sm shadow-teal-900/10"
              >
                Apply Legal Rewrite & Clean Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
