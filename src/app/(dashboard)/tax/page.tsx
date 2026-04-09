"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";
import { calculateSATax, type TaxCalculation } from "@/lib/wealth/tax-optimizer";

export default function TaxPage() {
  const [gains, setGains] = useState("");
  const [losses, setLosses] = useState("");
  const [result, setResult] = useState<TaxCalculation | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const calc = calculateSATax({ gains: Number(gains) || 0, losses: Number(losses) || 0 });
    setResult(calc);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Calculator className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Tax Optimizer</h1>
          <p className="text-xs text-white/40">South Africa capital gains tax calculator and optimization</p>
        </div>
      </div>

      <form onSubmit={calculate} className="glass p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Total Capital Gains (ZAR)</label>
            <input type="number" value={gains} onChange={(e) => setGains(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50" />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Total Capital Losses (ZAR)</label>
            <input type="number" value={losses} onChange={(e) => setLosses(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50" />
          </div>
        </div>
        <button type="submit" className="btn-primary text-sm">Calculate Tax</button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass p-4"><div className="text-xs text-white/40">Net Gain</div><div className="font-bold text-white">R{result.netGain.toLocaleString()}</div></div>
            <div className="glass p-4"><div className="text-xs text-white/40">Annual Exclusion</div><div className="font-bold text-emerald-400">R{result.annualExclusion.toLocaleString()}</div></div>
            <div className="glass p-4"><div className="text-xs text-white/40">Taxable Gain</div><div className="font-bold text-white">R{result.taxableGain.toLocaleString()}</div></div>
            <div className="glass p-4"><div className="text-xs text-white/40">Estimated Tax</div><div className="font-bold text-red-400">R{result.estimatedTax.toLocaleString()}</div></div>
          </div>
          <div className="glass p-6">
            <h3 className="font-semibold text-white mb-3">Optimization Suggestions</h3>
            <ul className="space-y-2">
              {result.optimizations.map((opt, i) => (
                <li key={i} className="text-sm text-white/60 flex gap-2"><span className="text-[#c9a84c]">-</span>{opt}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
