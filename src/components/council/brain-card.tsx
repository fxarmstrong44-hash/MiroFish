"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  name: string;
  vote: "buy" | "sell" | "hold";
  confidence: number;
  weight: number;
  reasoning: string;
}

export default function BrainCard({ name, vote, confidence, weight, reasoning }: Props) {
  const voteConfig = {
    buy: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: TrendingUp },
    sell: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: TrendingDown },
    hold: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: Minus },
  };

  const config = voteConfig[vote];
  const Icon = config.icon;

  return (
    <div className={`glass p-4 border ${config.border}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-medium text-white text-sm">{name}</div>
          <div className="text-xs text-white/40">Weight: {weight}x</div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
          <Icon className="w-3 h-3" />
          {vote.toUpperCase()}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              vote === "buy" ? "bg-emerald-400" : vote === "sell" ? "bg-red-400" : "bg-yellow-400"
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className="text-xs text-white/50">{confidence}%</span>
      </div>
      <p className="text-xs text-white/50 line-clamp-2">{reasoning}</p>
    </div>
  );
}
