"use client";

import { type ReactNode } from "react";
import { Crown, Sparkles } from "lucide-react";

interface LuxuryLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function LuxuryLayout({ children, title, subtitle }: LuxuryLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Premium header with gold gradient border */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gold shimmer border */}
        <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-[#c9a84c]/60 via-[#f0d78c]/40 to-[#c9a84c]/60" />
        <div
          className="relative rounded-3xl p-10"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 30%, #1a1510 70%, #0f0f1a 100%)",
          }}
        >
          {/* Ambient gold glow */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #f0d78c, transparent 70%)" }}
          />

          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 border border-[#c9a84c]/20 animate-glow">
              <Crown className="w-10 h-10 text-[#c9a84c]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gold">{title}</h1>
                <Sparkles className="w-5 h-5 text-[#c9a84c]/60" />
              </div>
              {subtitle && <p className="text-white/40 text-sm max-w-xl">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
