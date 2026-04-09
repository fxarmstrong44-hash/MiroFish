"use client";

import { Sparkles } from "lucide-react";

interface SuggestionProps {
  suggestions?: string[];
  onSelect: (suggestion: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Analyze AAPL \u2014 fundamentals + technical outlook",
  "What's the BTC market sentiment right now?",
  "Run a portfolio risk assessment",
  "Compare MSFT vs GOOG for long-term value",
  "South African market outlook \u2014 JSE top movers",
  "Suggest a diversified portfolio for R500k",
];

export default function Suggestion({ suggestions = DEFAULT_SUGGESTIONS, onSelect }: SuggestionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-white/30">
        <Sparkles className="w-3 h-3" />
        <span>Suggested queries</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
