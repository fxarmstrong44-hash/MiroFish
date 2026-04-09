"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  change?: number;
  prefix?: string;
}

export default function PortfolioCard({ label, value, change, prefix = "$" }: Props) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="glass p-5">
      <div className="text-sm text-white/50 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">
        {prefix}{value}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? "+" : ""}{change.toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
}
