"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export interface Position {
  id: string;
  symbol: string;
  side: "long" | "short";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl: number;
  pnlPct: number;
}

interface PositionTableProps {
  positions: Position[];
  onClose?: (id: string) => void;
}

export default function PositionTable({ positions, onClose }: PositionTableProps) {
  if (positions.length === 0) {
    return (
      <div className="glass p-8 text-center">
        <p className="text-white/40 text-sm">No open positions</p>
        <p className="text-white/20 text-xs mt-1">Execute a trade to see positions here</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Open Positions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40">Symbol</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40">Side</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40">Qty</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40">Entry</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40">Current</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40">SL</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40">TP</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40">P&L</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40"></th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const isProfit = pos.pnl >= 0;
              return (
                <tr key={pos.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-white">{pos.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${
                      pos.side === "long"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-red-400/10 text-red-400"
                    }`}>
                      {pos.side === "long" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {pos.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white/70">{pos.quantity}</td>
                  <td className="px-4 py-3 text-right text-white/70">${pos.entryPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-white">${pos.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-white/40">{pos.stopLoss ? `$${pos.stopLoss.toFixed(2)}` : "\u2014"}</td>
                  <td className="px-4 py-3 text-right text-white/40">{pos.takeProfit ? `$${pos.takeProfit.toFixed(2)}` : "\u2014"}</td>
                  <td className={`px-4 py-3 text-right font-medium ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                    {isProfit ? "+" : ""}{pos.pnl.toFixed(2)} ({isProfit ? "+" : ""}{pos.pnlPct.toFixed(2)}%)
                  </td>
                  <td className="px-4 py-3 text-right">
                    {onClose && (
                      <button
                        onClick={() => onClose(pos.id)}
                        className="text-xs text-white/30 hover:text-red-400 transition"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
