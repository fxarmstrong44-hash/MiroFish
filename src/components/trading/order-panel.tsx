"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

interface OrderPanelProps {
  symbol?: string;
  onSubmit?: (order: { symbol: string; direction: "buy" | "sell"; quantity: number; orderType: string; limitPrice?: number }) => void;
  loading?: boolean;
}

export default function OrderPanel({ symbol: initialSymbol = "", onSubmit, loading = false }: OrderPanelProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("1");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim() || loading) return;
    onSubmit?.({
      symbol: symbol.toUpperCase(),
      direction,
      quantity: Number(quantity),
      orderType,
      limitPrice: orderType === "limit" ? Number(limitPrice) : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Place Order</h3>

      {/* Symbol */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="AAPL, BTC, EUR/USD"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50"
        />
      </div>

      {/* Direction */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDirection("buy")}
          className={`py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition ${
            direction === "buy"
              ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
              : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" /> BUY
        </button>
        <button
          type="button"
          onClick={() => setDirection("sell")}
          className={`py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition ${
            direction === "sell"
              ? "bg-red-400/15 text-red-400 border border-red-400/30"
              : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          <ArrowDownRight className="w-3.5 h-3.5" /> SELL
        </button>
      </div>

      {/* Order Type */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Order Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(["market", "limit"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`py-2 rounded-lg text-xs font-medium transition ${
                orderType === type
                  ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                  : "bg-white/5 text-white/40 border border-white/10"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="text-xs text-white/40 mb-1 block">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0.001"
          step="any"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50"
        />
      </div>

      {/* Limit Price */}
      {orderType === "limit" && (
        <div>
          <label className="text-xs text-white/40 mb-1 block">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            step="any"
            placeholder="0.00"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !symbol.trim()}
        className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
          direction === "buy"
            ? "bg-emerald-500 hover:bg-emerald-400 text-white"
            : "bg-red-500 hover:bg-red-400 text-white"
        } disabled:opacity-40`}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Processing..." : `${direction.toUpperCase()} ${symbol.toUpperCase() || "..."}`}
      </button>
    </form>
  );
}
