"use client";

import { useState } from "react";
import { Globe, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Shield, DollarSign, Building } from "lucide-react";
import { EXPANSION_OPTIONS, getRecommendedExpansions } from "@/lib/wealth/global-expansion";

const RISK_ICONS = { low: Shield, medium: TrendingUp, high: AlertTriangle };

export default function WealthPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [capitalInput, setCapitalInput] = useState("500000");
  const [riskLevel, setRiskLevel] = useState(3);

  const capital = Number(capitalInput) || 0;
  const recommended = getRecommendedExpansions(capital, riskLevel);
  const recommendedTitles = new Set(recommended.map((r) => r.title));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Globe className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Global Wealth Expansion</h1>
          <p className="text-xs text-white/40">Offshore investment, currency diversification, and international opportunities</p>
        </div>
      </div>

      {/* Personalized filter */}
      <div className="glass p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-3">Your Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Available Capital (ZAR)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="number"
                value={capitalInput}
                onChange={(e) => setCapitalInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Risk Tolerance ({riskLevel}/5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className="w-full mt-2 accent-[#c9a84c]"
            />
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>Conservative</span><span>Aggressive</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/30 mt-3">
          {recommended.length} of {EXPANSION_OPTIONS.length} options match your profile
        </p>
      </div>

      {/* SA-specific info box */}
      <div className="glass p-5 border-[#c9a84c]/10">
        <div className="flex gap-3">
          <Building className="w-5 h-5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">South African Exchange Control</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              SA residents may invest up to <span className="text-[#c9a84c] font-medium">R1 million per year</span> offshore without SARS tax clearance (Single Discretionary Allowance).
              For amounts up to <span className="text-[#c9a84c] font-medium">R10 million per year</span>, tax clearance is required (Foreign Investment Allowance).
              All foreign income must be declared in your SA tax return. Consult a registered tax practitioner for your specific situation.
            </p>
          </div>
        </div>
      </div>

      {/* Expansion options */}
      <div className="space-y-3">
        {EXPANSION_OPTIONS.map((opt, i) => {
          const isExpanded = expandedIndex === i;
          const isRecommended = recommendedTitles.has(opt.title);
          const RiskIcon = RISK_ICONS[opt.riskLevel];

          return (
            <div
              key={i}
              className={`glass transition-all ${isRecommended ? "border-[#c9a84c]/20" : "opacity-60"}`}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#c9a84c] font-medium">{opt.category}</span>
                    {isRecommended && (
                      <span className="text-[10px] bg-[#c9a84c]/10 text-[#c9a84c] px-1.5 py-0.5 rounded font-medium">RECOMMENDED</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{opt.title}</h3>
                  <p className="text-sm text-white/50 mt-1">{opt.description}</p>
                </div>
                <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1">
                      <RiskIcon className={`w-3 h-3 ${opt.riskLevel === "low" ? "text-emerald-400" : opt.riskLevel === "medium" ? "text-yellow-400" : "text-red-400"}`} />
                      <span className={`text-xs font-medium ${opt.riskLevel === "low" ? "text-emerald-400" : opt.riskLevel === "medium" ? "text-yellow-400" : "text-red-400"}`}>{opt.riskLevel} risk</span>
                    </div>
                    <div className="text-xs text-white/30 mt-0.5">Min: R{opt.minimumCapital.toLocaleString()}</div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-white/5 mt-0">
                  <div className="pt-4 space-y-4">
                    {/* Key details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="glass-subtle p-3">
                        <div className="text-xs text-white/40">Minimum Capital</div>
                        <div className="text-sm font-bold text-white">R{opt.minimumCapital.toLocaleString()}</div>
                      </div>
                      <div className="glass-subtle p-3">
                        <div className="text-xs text-white/40">Currency</div>
                        <div className="text-sm font-bold text-white">{opt.currency}</div>
                      </div>
                      <div className="glass-subtle p-3">
                        <div className="text-xs text-white/40">Risk Level</div>
                        <div className={`text-sm font-bold capitalize ${opt.riskLevel === "low" ? "text-emerald-400" : opt.riskLevel === "medium" ? "text-yellow-400" : "text-red-400"}`}>{opt.riskLevel}</div>
                      </div>
                    </div>

                    {/* Considerations */}
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Key Considerations</h4>
                      <ul className="space-y-2">
                        {opt.considerations.map((c, j) => (
                          <li key={j} className="flex gap-2 text-sm text-white/50">
                            <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {capital < opt.minimumCapital && (
                      <div className="flex gap-2 bg-yellow-400/5 border border-yellow-400/10 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-400">
                          Your current capital (R{capital.toLocaleString()}) is below the minimum of R{opt.minimumCapital.toLocaleString()} for this option.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
