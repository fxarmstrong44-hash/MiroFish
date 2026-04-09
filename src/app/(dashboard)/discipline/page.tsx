"use client";

import { Shield } from "lucide-react";
import { assessDiscipline } from "@/lib/wealth/discipline";

export default function DisciplinePage() {
  const assessment = assessDiscipline({
    stopLossAdherence: 80,
    planFollowed: 70,
    overtrading: 2,
    revengeTrading: 1,
    emotionalOverrides: 2,
    holdingPeriodConsistency: 65,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Shield className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Behavior & Discipline Engine</h1>
          <p className="text-xs text-white/40">Track emotional trading patterns and build discipline</p>
        </div>
      </div>

      <div className="glass p-6 text-center">
        <div className="text-5xl font-bold text-[#c9a84c]">{assessment.score}</div>
        <div className="text-lg text-white/60 mt-1">{assessment.label}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessment.factors.map((f) => (
          <div key={f.name} className="glass p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/70">{f.name}</span>
              <span className="text-sm font-bold text-white">{f.score.toFixed(0)}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${f.score >= 70 ? "bg-emerald-400" : f.score >= 40 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${f.score}%` }} />
            </div>
            <p className="text-xs text-white/40 mt-2">{f.detail}</p>
          </div>
        ))}
      </div>

      <div className="glass p-6">
        <h3 className="font-semibold text-white mb-3">Recommendations</h3>
        <ul className="space-y-2">
          {assessment.recommendations.map((r, i) => (
            <li key={i} className="text-sm text-white/60 flex gap-2"><span className="text-[#c9a84c]">-</span>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
