"use client";

import { Briefcase, Plus, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#c9a84c]/10">
            <Briefcase className="w-6 h-6 text-[#c9a84c]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Portfolio Tracker</h1>
            <p className="text-xs text-white/40">Paper Trading Account</p>
          </div>
        </div>
        <Link href="/simulator" className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Trade
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Balance", value: "$100,000.00", icon: TrendingUp, color: "text-white" },
          { label: "Open P&L", value: "$0.00", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Realized P&L", value: "$0.00", icon: TrendingDown, color: "text-white/50" },
          { label: "Positions", value: "0", icon: Briefcase, color: "text-white" },
        ].map((item) => (
          <div key={item.label} className="glass p-4">
            <div className="text-xs text-white/40">{item.label}</div>
            <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Positions table */}
      <div className="glass overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Open Positions</h2>
        </div>
        <div className="p-8 text-center text-white/30">
          <p>No open positions. Use the Simulator to place your first paper trade.</p>
        </div>
      </div>

      {/* Trade history */}
      <div className="glass overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Trade History</h2>
        </div>
        <div className="p-8 text-center text-white/30">
          <p>No trades yet.</p>
        </div>
      </div>
    </div>
  );
}
