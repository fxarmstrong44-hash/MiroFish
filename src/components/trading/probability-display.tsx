"use client";

import { TrendingUp, TrendingDown, Info } from "lucide-react";

interface ProbabilityDisplayProps {
  probabilityWin: number;
  probabilityLoss: number;
  confidence: number;
  riskPct: number;
  recommendation?: string;
}

export default function ProbabilityDisplay({
  probabilityWin,
  probabilityLoss,
  confidence,
  riskPct,
  recommendation,
}: ProbabilityDisplayProps) {
  const winAngle = (probabilityWin / 100) * 360;

  return (
    <div className="glass p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Trade Probability</h3>

      {/* Donut chart */}
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="12"
              strokeDasharray={`${(winAngle / 360) * 251.33} 251.33`}
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              strokeWidth="12"
              strokeDasharray={`${((360 - winAngle) / 360) * 251.33} 251.33`}
              strokeDashoffset={`${-(winAngle / 360) * 251.33}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{confidence.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/70">Win Probability</span>
            </div>
            <span className="text-lg font-bold text-emerald-400">{probabilityWin.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm text-white/70">Loss Probability</span>
            </div>
            <span className="text-lg font-bold text-red-400">{probabilityLoss.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-white/40">Portfolio Risk</span>
            <span className={`text-sm font-semibold ${riskPct > 2 ? "text-yellow-400" : "text-white"}`}>
              {riskPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Probability bars */}
      <div className="space-y-2">
        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-400 rounded-l-full transition-all" style={{ width: `${probabilityWin}%` }} />
          <div className="h-full bg-red-400 rounded-r-full transition-all" style={{ width: `${probabilityLoss}%` }} />
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="flex gap-2 bg-blue-400/5 border border-blue-400/10 rounded-lg p-3">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/60 leading-relaxed">{recommendation}</p>
        </div>
      )}
    </div>
  );
}
