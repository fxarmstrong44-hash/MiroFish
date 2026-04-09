"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Brain,
  Zap,
} from "lucide-react";
import Parallax from "@/components/effects/parallax";
import Glassmorphism from "@/components/effects/glassmorphism";

const councilVotes = [
  { name: "Bridgewater", verdict: "buy", confidence: 94 },
  { name: "Goldman Sachs", verdict: "buy", confidence: 88 },
  { name: "Renaissance", verdict: "buy", confidence: 91 },
  { name: "Citadel", verdict: "hold", confidence: 72 },
  { name: "BlackRock", verdict: "buy", confidence: 86 },
];

const verdictIcons: Record<string, typeof TrendingUp> = {
  buy: TrendingUp,
  sell: TrendingDown,
  hold: Minus,
};

const verdictColors: Record<string, string> = {
  buy: "text-green-400",
  sell: "text-red-400",
  hold: "text-yellow-400",
};

const floatingShapes = [
  { size: 120, x: "10%", y: "20%", delay: 0, speed: 0.2, opacity: 0.06 },
  { size: 80, x: "85%", y: "15%", delay: 0.5, speed: -0.15, opacity: 0.04 },
  { size: 60, x: "75%", y: "70%", delay: 1, speed: 0.25, opacity: 0.05 },
  { size: 100, x: "5%", y: "65%", delay: 0.3, speed: -0.2, opacity: 0.04 },
  { size: 40, x: "50%", y: "10%", delay: 0.8, speed: 0.15, opacity: 0.06 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-animated">
      {floatingShapes.map((shape, i) => (
        <Parallax key={i} speed={shape.speed} className="absolute pointer-events-none" >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: shape.opacity, scale: 1 }}
            transition={{ duration: 2, delay: shape.delay, ease: "easeOut" }}
            className="rounded-2xl border border-white/10"
            style={{
              position: "fixed",
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              background: `linear-gradient(135deg, rgba(201, 168, 76, 0.1), transparent)`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        </Parallax>
      ))}

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 168, 76, 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-sm text-white/70">Markets are live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
            >
              Your{" "}
              <span className="text-gold">AI Wealth Council</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0"
            >
              18 legendary investor brains. One unified decision. Zero emotion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="#pricing"
                className="btn-primary text-center text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Free
              </a>
              <a
                href="#features"
                className="btn-secondary text-center text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                See How It Works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-white/40"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Bank-grade security
              </span>
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                18 AI brains
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <Glassmorphism
              intensity="medium"
              className="w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Council Decision
                  </p>
                  <p className="text-lg font-semibold mt-1">AAPL \u2014 Apple Inc.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">
                    Strong Buy
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {councilVotes.map((vote, i) => {
                  const Icon = verdictIcons[vote.verdict];
                  return (
                    <motion.div
                      key={vote.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="text-sm text-white/70">{vote.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${vote.confidence}%` }}
                            transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c]"
                          />
                        </div>
                        <span className="text-xs text-white/50 w-8 text-right">
                          {vote.confidence}%
                        </span>
                        <Icon
                          className={`w-4 h-4 ${verdictColors[vote.verdict]}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Consensus Confidence</p>
                  <p className="text-2xl font-bold text-gold">86.2%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Risk Assessment</p>
                  <p className="text-sm font-medium text-green-400">Low Risk</p>
                </div>
              </div>
            </Glassmorphism>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}
