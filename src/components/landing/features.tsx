"use client";

import {
  Brain,
  Users,
  LineChart,
  Building2,
  Gauge,
  Calculator,
} from "lucide-react";
import Glassmorphism from "@/components/effects/glassmorphism";
import ScrollReveal from "@/components/effects/scroll-reveal";
import { type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "Lucky AI",
    description:
      "Emotionless precision powered by advanced language models. Get clear buy, sell, or hold signals with full reasoning \u2014 no gut feelings, no FOMO.",
    highlight: "Emotionless Precision",
  },
  {
    icon: Users,
    title: "18-Brain Council",
    description:
      "Weighted voting from 18 institutional-grade AI personas. Each modeled after a legendary fund: Bridgewater, Renaissance, Citadel, and more.",
    highlight: "Weighted Voting",
  },
  {
    icon: LineChart,
    title: "Paper Trading",
    description:
      "Risk-free simulator to test strategies with live market data. Build confidence before committing real capital.",
    highlight: "Risk-Free Simulator",
  },
  {
    icon: Building2,
    title: "Institutional Analysis",
    description:
      "Analysis frameworks from Goldman Sachs, Morgan Stanley, JPMorgan, and other top-tier institutions. Wall Street thinking, accessible to everyone.",
    highlight: "Goldman, Morgan Stanley & More",
  },
  {
    icon: Gauge,
    title: "Autopilot Mode",
    description:
      "Automated wealth building with a maximum 2% risk tolerance per position. Set your strategy and let the council execute with discipline.",
    highlight: "Max 2% Risk",
  },
  {
    icon: Calculator,
    title: "Tax Optimizer",
    description:
      "South Africa focused tax optimization. Maximize your after-tax returns with CGT strategies, retirement fund planning, and offshore structuring.",
    highlight: "SA Focused",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 lg:mb-20">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            What Sets Us Apart
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Institutional Power,{" "}
            <span className="text-gold">Personal Scale</span>
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            Every feature built to give you an unfair advantage in the markets.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <Glassmorphism
                intensity="subtle"
                className="p-6 lg:p-8 h-full group hover:border-[rgba(201,168,76,0.3)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>

                {feature.highlight && (
                  <span className="inline-block text-xs font-medium uppercase tracking-wider text-accent/80 mb-2">
                    {feature.highlight}
                  </span>
                )}

                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </Glassmorphism>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
