"use client";

import { Star } from "lucide-react";
import ScrollReveal from "@/components/effects/scroll-reveal";

const TESTIMONIALS = [
  {
    name: "Thabo M.",
    role: "Portfolio Manager, Johannesburg",
    content:
      "The 18-brain AI council changed how I approach every trade. Having institutional-grade analysis at my fingertips \u2014 consensus voting, risk filtering, probability scoring \u2014 it's like having a hedge fund team for a fraction of the cost.",
    rating: 5,
    tier: "Pro",
  },
  {
    name: "Sarah K.",
    role: "Independent Trader, Cape Town",
    content:
      "Lucky AI keeps me disciplined. No emotion, just data. My win rate jumped 23% in the first month because I stopped revenge-trading and started following the council's consensus.",
    rating: 5,
    tier: "Elite",
  },
  {
    name: "David R.",
    role: "Tech Entrepreneur, Durban",
    content:
      "The SA tax optimizer alone saved me R48,000 this year. Add the offshore investment guidance and global wealth expansion tools \u2014 Vaultr pays for itself ten times over.",
    rating: 5,
    tier: "Pro",
  },
  {
    name: "Naledi P.",
    role: "Wealth Advisor, Pretoria",
    content:
      "I recommend Vaultr to all my HNWI clients. The Private Banking tier gives them concierge-level AI, direct API access, and custom strategies that rival what Goldman charges millions for.",
    rating: 5,
    tier: "Secret",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by <span className="text-gold">South African Traders</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              From independent traders to wealth advisors \u2014 Vaultr delivers institutional intelligence to everyone.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="glass p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-white/70 leading-relaxed flex-1">\u201c{t.content}\u201d</p>

                {/* Author */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                  <span className="text-[10px] bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded-md font-medium">
                    {t.tier}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
