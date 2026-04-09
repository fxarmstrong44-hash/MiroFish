"use client";

import { useState } from "react";

interface ChartProps {
  symbol: string;
  data?: { time: string; open: number; high: number; low: number; close: number }[];
}

const TIMEFRAMES = ["1H", "4H", "1D", "1W", "1M"] as const;

export default function Chart({ symbol, data = [] }: ChartProps) {
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]>("1D");

  // Extract price range for SVG scaling
  const prices = data.length > 0 ? data.map((d) => d.close) : [100, 102, 98, 105, 103, 107, 110, 108, 112, 109];
  const min = Math.min(...prices) * 0.998;
  const max = Math.max(...prices) * 1.002;
  const range = max - min || 1;

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 60, bottom: 30, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Build SVG line path
  const points = prices.map((price, i) => {
    const x = padding.left + (i / (prices.length - 1)) * chartW;
    const y = padding.top + (1 - (price - min) / range) * chartH;
    return { x, y, price };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <div className="glass p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-lg font-bold text-white">{symbol}</span>
          <span className="ml-3 text-2xl font-bold" style={{ color }}>
            ${prices[prices.length - 1].toFixed(2)}
          </span>
          <span className="ml-2 text-sm" style={{ color }}>
            {isUp ? "+" : ""}
            {((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                timeframe === tf
                  ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => {
          const y = padding.top + pct * chartH;
          const price = max - pct * range;
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <text x={width - padding.right + 8} y={y + 4} fill="rgba(255,255,255,0.3)" fontSize="10">
                ${price.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Current price dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={color} />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="8" fill={color} fillOpacity="0.2" />
      </svg>
    </div>
  );
}
