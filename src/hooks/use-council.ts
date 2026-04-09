"use client";

import { useState } from "react";

interface BrainVote {
  brain: string;
  vote: "buy" | "sell" | "hold";
  confidence: number;
  weight: number;
  reasoning: string;
}

interface CouncilResult {
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

export function useCouncil() {
  const [result, setResult] = useState<CouncilResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCouncil(symbol: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Council failed.");
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, runCouncil };
}
