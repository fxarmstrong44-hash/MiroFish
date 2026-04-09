import { Globe } from "lucide-react";
import { EXPANSION_OPTIONS } from "@/lib/wealth/global-expansion";

export default function WealthPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Globe className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Global Wealth Expansion</h1>
          <p className="text-xs text-white/40">Offshore investment, currency diversification, and international opportunities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPANSION_OPTIONS.map((opt, i) => (
          <div key={i} className="glass p-6 hover:border-[#c9a84c]/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#c9a84c] font-medium">{opt.category}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${opt.riskLevel === "low" ? "bg-emerald-400/10 text-emerald-400" : opt.riskLevel === "medium" ? "bg-yellow-400/10 text-yellow-400" : "bg-red-400/10 text-red-400"}`}>{opt.riskLevel} risk</span>
            </div>
            <h3 className="font-semibold text-white mb-1">{opt.title}</h3>
            <p className="text-sm text-white/50 mb-3">{opt.description}</p>
            <div className="text-xs text-white/30">Min: R{opt.minimumCapital.toLocaleString()}</div>
            <ul className="mt-3 space-y-1">
              {opt.considerations.slice(0, 2).map((c, j) => (
                <li key={j} className="text-xs text-white/40 flex gap-1"><span className="text-[#c9a84c]">-</span>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
