"use client";

import { getBWILabel, getBWIColor } from "@/lib/wealth/bwi";

export default function BWIGauge({ score }: { score: number }) {
  const label = getBWILabel(score);
  const color = getBWIColor(score);
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="glass p-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-white/50 mb-4">Vaultr Wealth Index</h3>
      <div className="relative w-40 h-20 overflow-hidden mb-2">
        <div className="absolute inset-0 border-[6px] border-white/10 rounded-t-full" />
        <div
          className="absolute inset-0 border-[6px] border-transparent rounded-t-full"
          style={{
            borderTopColor: color,
            borderLeftColor: score > 25 ? color : "transparent",
            borderRightColor: score > 75 ? color : "transparent",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-16 origin-bottom transition-transform duration-1000"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            background: `linear-gradient(to top, ${color}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="text-3xl font-bold" style={{ color }}>
        {score}
      </div>
      <div className="text-sm font-medium text-white/60">{label}</div>
    </div>
  );
}
