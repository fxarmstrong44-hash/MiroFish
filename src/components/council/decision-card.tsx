"use client";

import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from "lucide-react";

interface Props {
  symbol: string;
  direction: "buy" | "sell" | "hold";
  confidence: number;
  riskPct: number;
  probabilityWin: number;
  probabilityLoss: number;
  explanation: string;
}

export default function DecisionCard({
  symbol, direction, confidence, riskPct, probabilityWin, probabilityLoss, explanation,
}: Props) {
  const dirConfig = {
    buy: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: ArrowUpRight, label: "BUY" },
    sell: { color: "text-red-400", bg: "bg-red-400/10", icon: ArrowDownRight, label: "SELL" },
    hold: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Minus, label: "HOLD" },
  };

  const config = dirConfig[direction];
  const Icon = config.icon;

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{symbol}</h3>
          <div className={`flex items-center gap-1 text-sm font-medium ${config.color}`}>
            <Icon className="w-4 h-4" />
            {config.label}
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-lg font-bold ${config.bg} ${config.color}`}>
          {confidence.toFixed(0)}%
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-subtle p-3 text-center">
          <div className="text-xs text-white/40">Win Probability</div>
          <div className="text-xl font-bold text-emerald-400">{probabilityWin.toFixed(0)}%</div>
        </div>
        <div className="glass-subtle p-3 text-center">
          <div className="text-xs text-white/40">Loss Probability</div>
          <div className="text-xl font-bold text-red-400">{probabilityLoss.toFixed(0)}%</div>
        </div>
      </div>
      {riskPct > 2 && (
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-yellow-400">Risk {riskPct.toFixed(1)}% exceeds 2% cap. Override required.</span>
        </div>
      )}
      <div className="text-xs text-white/40 flex items-center gap-2 mb-2">
        <span>Risk: {riskPct.toFixed(1)}%</span>
        <span className="text-white/20">|</span>
        <span>Confidence: {confidence.toFixed(1)}%</span>
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{explanation}</p>
    </div>
  );
}
