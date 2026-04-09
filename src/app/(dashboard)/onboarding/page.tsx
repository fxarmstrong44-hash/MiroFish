"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Professional"];
const RISK_TOLERANCES = [
  { value: "conservative", label: "Conservative", desc: "Capital preservation first" },
  { value: "moderate", label: "Moderate", desc: "Balanced growth and safety" },
  { value: "aggressive", label: "Aggressive", desc: "Maximum growth potential" },
];
const STRATEGY_PREFERENCES = ["Value Investing", "Growth", "Momentum", "Swing Trading", "Day Trading", "Long-term Hold", "Dividend Income", "Index/ETF"];
const CAPITAL_RANGES = ["Under R50,000", "R50,000 - R250,000", "R250,000 - R1,000,000", "R1,000,000 - R5,000,000", "R5,000,000+"];

const STEPS = ["Profile", "Experience", "Strategy", "Ready"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("South Africa");
  const [experience, setExperience] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [strategies, setStrategies] = useState<string[]>([]);
  const [capitalRange, setCapitalRange] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleStrategy(s: string) {
    setStrategies((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  async function handleComplete() {
    setSaving(true);
    try {
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, country, experience, riskTolerance, strategies, capitalRange }),
      });
    } catch {
      // Continue to dashboard even if save fails
    }
    router.push("/dashboard");
  }

  const canAdvance = step === 0 ? fullName.trim().length > 0 : step === 1 ? experience && riskTolerance : step === 2 ? strategies.length > 0 && capitalRange : true;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                i < step ? "bg-[#c9a84c] text-[#0a0a0f]" : i === step ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-white/5 text-white/30"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 sm:w-20 h-px mx-2 ${i < step ? "bg-[#c9a84c]/50" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <div className="glass p-8">
          {/* Step 0: Profile */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <Sparkles className="w-8 h-8 text-[#c9a84c] mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Welcome to Vaultr</h1>
                <p className="text-sm text-white/40">Let&apos;s personalize your wealth intelligence experience.</p>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50" />
              </div>
            </div>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Investment Experience</h2>
                <p className="text-sm text-white/40">Help the AI council calibrate recommendations to your level.</p>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button key={level} onClick={() => setExperience(level)} className={`py-3 rounded-lg text-sm font-medium transition ${experience === level ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Risk Tolerance</label>
                <div className="space-y-2">
                  {RISK_TOLERANCES.map((r) => (
                    <button key={r.value} onClick={() => setRiskTolerance(r.value)} className={`w-full text-left px-4 py-3 rounded-lg transition ${riskTolerance === r.value ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20" : "bg-white/5 border border-white/10 hover:border-white/20"}`}>
                      <div className="text-sm font-medium text-white">{r.label}</div>
                      <div className="text-xs text-white/40">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Strategy */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Strategy Preferences</h2>
                <p className="text-sm text-white/40">Select all that interest you. The council adapts to your style.</p>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Preferred Strategies</label>
                <div className="grid grid-cols-2 gap-2">
                  {STRATEGY_PREFERENCES.map((s) => (
                    <button key={s} onClick={() => toggleStrategy(s)} className={`py-2.5 rounded-lg text-xs font-medium transition ${strategies.includes(s) ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"}`}>
                      {strategies.includes(s) && <Check className="w-3 h-3 inline mr-1" />}{s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Capital Range</label>
                <div className="space-y-2">
                  {CAPITAL_RANGES.map((c) => (
                    <button key={c} onClick={() => setCapitalRange(c)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${capitalRange === c ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]" : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ready */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-[#c9a84c]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">You&apos;re All Set</h2>
                <p className="text-sm text-white/40">Your AI council is configured and ready. The 18 brains will tailor analysis to your profile.</p>
              </div>
              <div className="glass-subtle p-4 text-left text-sm space-y-2">
                <div className="flex justify-between"><span className="text-white/40">Name</span><span className="text-white">{fullName}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Experience</span><span className="text-white">{experience}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Risk</span><span className="text-white capitalize">{riskTolerance}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Capital</span><span className="text-white">{capitalRange}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Strategies</span><span className="text-white text-right">{strategies.join(", ")}</span></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canAdvance} className="btn-primary flex items-center gap-2 disabled:opacity-30">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? "Setting up..." : "Launch Dashboard"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
