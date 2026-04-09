"use client";

import { useState } from "react";
import BrainCard from "@/components/council/brain-card";
import ConsensusMeter from "@/components/council/consensus-meter";
import DecisionCard from "@/components/council/decision-card";
import { Brain, Loader2, Search } from "lucide-react";

interface BrainVote {
  brain: string;
  vote: "buy" | "sell" | "hold";
  confidence: number;
  weight: number;
  reasoning: string;
}

interface Decision {
  symbol: string;
  direction: "buy" | "sell" | "hold";
  votes: BrainVote[];
  consensusScore: number;
  confidence: number;
  riskPct: number;
  explanation: string;
  probabilityWin: number;
  probabilityLoss: number;
}

export default function CouncilPage() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);

  async function runCouncil(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim() || loading) return;
    setLoading(true);
    setDecision(null);

    try {
      const res = await fetch("/api/ai/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol.toUpperCase() }),
      });
      const data = await res.json();
      setDecision(data);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }

  const buyCount = decision?.votes.filter((v) => v.vote === "buy").length ?? 0;
  const sellCount = decision?.votes.filter((v) => v.vote === "sell").length ?? 0;
  const holdCount = decision?.votes.filter((v) => v.vote === "hold").length ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10">
          <Brain className="w-6 h-6 text-[#c9a84c]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Council</h1>
          <p className="text-xs text-white/40">18 legendary investor brains. Weighted consensus voting.</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={runCouncil} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter symbol (AAPL, BTC, TSLA...)"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50 transition"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {loading ? "Voting..." : "Run Council"}
        </button>
      </form>

      {loading && (
        <div className="glass p-12 text-center">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin mx-auto mb-4" />
          <p className="text-white/50">18 brains are analyzing {symbol.toUpperCase()}...</p>
          <p className="text-xs text-white/30 mt-1">This takes 15-30 seconds</p>
        </div>
      )}

      {decision && (
        <>
          {/* Decision + Consensus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DecisionCard
              symbol={decision.symbol}
              direction={decision.direction}
              confidence={decision.confidence}
              riskPct={decision.riskPct}
              probabilityWin={decision.probabilityWin}
              probabilityLoss={decision.probabilityLoss}
              explanation={decision.explanation}
            />
            <ConsensusMeter
              buyCount={buyCount}
              sellCount={sellCount}
              holdCount={holdCount}
              consensusScore={decision.consensusScore}
              confidence={decision.confidence}
            />
          </div>

          {/* Individual Votes */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Individual Brain Votes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {decision.votes.map((vote) => (
                <BrainCard
                  key={vote.brain}
                  name={vote.brain}
                  vote={vote.vote}
                  confidence={vote.confidence}
                  weight={vote.weight}
                  reasoning={vote.reasoning}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
