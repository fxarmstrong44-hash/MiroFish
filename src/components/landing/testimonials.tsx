"use client";

import { Brain, TrendingUp, Shield, Zap, Globe, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/effects/scroll-reveal";
import { motion } from "framer-motion";

const STATS = [
  { value: "18", label: "AI Brains", sublabel: "Institutional-grade models", icon: Brain },
  { value: "2%", label: "Max Risk Cap", sublabel: "Per position, always enforced", icon: Shield },
  { value: "10", label: "Institutional Prompts", sublabel: "Goldman, Bridgewater, Citadel & more", icon: BarChart3 },
  { value: "5", label: "SA-Specific Tools", sublabel: "Tax, offshore, ZAR strategies", icon: Globe },
];

const CAPABILITIES = [
  {
    title: "Multi-Model AI Routing",
    description: "Queries automatically route to the best model — OpenAI for financial analysis, Claude for deep reasoning, Perplexity for real-time market data.",
    icon: Zap,
  },
  {
    title: "Win/Loss Probability Engine",
    description: "Before every trade: see exact win and loss probabilities calculated from technical indicators, sentiment analysis, and historical patterns.",
    icon: TrendingUp,
  },
  {
    title: "SA Tax Optimization",
    description: "Built for South African investors. R40,000 annual CGT exclusion, 40% inclusion rate calculations, tax-loss harvesting suggestions, and SARS compliance.",
    icon: Globe,
  },
  {
    title: "Offshore Wealth Expansion",
    description: "Navigate the R10 million foreign investment allowance, JSE-listed global ETFs, multi-currency portfolios, and international property with guided AI analysis.",
    icon: BarChart3,
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Stats grid */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for <span className="text-gold">Serious Investors</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Institutional-grade intelligence. South African-focused tools. Zero emotion.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {STATS.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="glass p-6 text-center group hover:border-[#c9a84c]/30 transition-all">
                <stat.icon className="w-6 h-6 text-[#c9a84c]/60 mx-auto mb-3 group-hover:text-[#c9a84c] transition" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="text-3xl font-bold text-gold mb-1"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm font-medium text-white">{stat.label}</div>
                <div className="text-xs text-white/30 mt-1">{stat.sublabel}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Deep capabilities */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">Under the hood</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              What Makes Vaultr <span className="text-gold">Different</span>
            </h3>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="glass p-6 flex gap-4 group hover:border-[#c9a84c]/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a84c]/20 transition">
                  <cap.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">{cap.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{cap.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
