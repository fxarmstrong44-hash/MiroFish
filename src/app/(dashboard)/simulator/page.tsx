"use client";

import { useState } from "react";
import { LineChart, ArrowUpRight, ArrowDownRight, Loader2, AlertTriangle } from "lucide-react";

export default function SimulatorPage() {
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trade/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), direction, quantity: Number(quantity) }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Simulation failed." });
    } finally {
      setLoading(false);
    }
  }

  const sim = result?.simulation as { probabilityWin?: number; probabilityLoss?: number; recommendation?: string } | undefined;
  const risk = result?.risk as { riskPct?: number; stopLoss?: number; takeProfit?: number; positionSize?: number; requiresOverride?: boolean } | undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10">
          <LineChart className="w-6 h-6 text-[#c9a84c]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Paper Trading Simulator</h1>
          <p className="text-xs text-white/40">Practice with $100,000 virtual capital. Zero risk.</p>
        </div>
      </div>

      {/* Order form */}
      <form onSubmit={handleSimulate} className="glass p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Direction</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDirection("buy")}
                className={`flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition ${direction === "buy" ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" : "bg-white/5 text-white/40 border border-white/10"}`}
              >
                <ArrowUpRight className="w-4 h-4" /> BUY
              </button>
              <button
                type="button"
                onClick={() => setDirection("sell")}
                className={`flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition ${direction === "sell" ? "bg-red-400/20 text-red-400 border border-red-400/30" : "bg-white/5 text-white/40 border border-white/10"}`}
              >
                <ArrowDownRight className="w-4 h-4" /> SELL
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Simulating..." : "Simulate Trade"}
        </button>
      </form>

      {/* Results */}
      {result && !result.error && (
        <div className="space-y-4">
          {/* Probability display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 text-center">
              <div className="text-xs text-white/40 mb-1">Win Probability</div>
              <div className="text-3xl font-bold text-emerald-400">{sim?.probabilityWin ?? 0}%</div>
            </div>
            <div className="glass p-6 text-center">
              <div className="text-xs text-white/40 mb-1">Loss Probability</div>
              <div className="text-3xl font-bold text-red-400">{sim?.probabilityLoss ?? 0}%</div>
            </div>
          </div>

          {/* Risk details */}
          <div className="glass p-6">
            <h3 className="font-semibold text-white mb-3">Risk Assessment</h3>
            {risk?.requiresOverride && (
              <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400">Risk exceeds 2% cap. Override required for execution.</span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><div className="text-xs text-white/40">Risk</div><div className="font-bold text-white">{risk?.riskPct?.toFixed(1) ?? 0}%</div></div>
              <div><div className="text-xs text-white/40">Stop Loss</div><div className="font-bold text-white">${risk?.stopLoss?.toFixed(2) ?? 0}</div></div>
              <div><div className="text-xs text-white/40">Take Profit</div><div className="font-bold text-white">${risk?.takeProfit?.toFixed(2) ?? 0}</div></div>
              <div><div className="text-xs text-white/40">Position Size</div><div className="font-bold text-white">{risk?.positionSize ?? 0}</div></div>
            </div>
            <p className="text-sm text-white/50 mt-3">{sim?.recommendation ?? ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
