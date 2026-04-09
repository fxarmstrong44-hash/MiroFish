"use client";

import { Check, Crown, Sparkles, Star } from "lucide-react";
import Glassmorphism from "@/components/effects/glassmorphism";
import ScrollReveal from "@/components/effects/scroll-reveal";
import { motion } from "framer-motion";

interface PricingTier {
  name: string;
  priceUSD: number;
  priceZAR: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  luxury?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    priceUSD: 0,
    priceZAR: "R0",
    period: "forever",
    features: [
      "Market data overview",
      "3 Lucky AI queries/day",
      "Limited paper trading",
      "Basic portfolio view",
    ],
    cta: "Get Started",
  },
  {
    name: "Starter",
    priceUSD: 29,
    priceZAR: "R493",
    period: "/month",
    features: [
      "Everything in Free",
      "20 Lucky AI queries/day",
      "Full paper trading simulator",
      "Basic alerts (5 active)",
      "Portfolio tracker",
    ],
    cta: "Start Starter",
  },
  {
    name: "Pro",
    priceUSD: 99,
    priceZAR: "R1,683",
    period: "/month",
    features: [
      "Everything in Starter",
      "Unlimited Lucky AI queries",
      "Full AI Council access",
      "Autopilot Wealth Mode",
      "Institutional analysis",
      "Tax optimization tools",
      "Unlimited alerts",
      "SPARC mode",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Elite",
    priceUSD: 299,
    priceZAR: "R5,084",
    period: "/month",
    features: [
      "Everything in Pro",
      "Deal Marketplace access",
      "Strategic Network",
      "Execution Vault",
      "Global Wealth Expansion",
      "Business Builder Engine",
      "Priority AI processing",
    ],
    cta: "Join Elite",
  },
  {
    name: "Vaultr Elite",
    priceUSD: 10000,
    priceZAR: "R169,884",
    period: "/month",
    features: [
      "Everything in Elite",
      "Private Banking Interface",
      "Concierge AI (dedicated)",
      "Custom strategy builder",
      "Direct API access",
      "White-glove onboarding",
      "Exclusive market intelligence",
    ],
    cta: "Apply for Access",
    luxury: true,
  },
];

function formatPrice(price: number): string {
  if (price === 0) return "$0";
  if (price >= 10000) return `$${(price / 1000).toFixed(0)}k`;
  return `$${price}`;
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201, 168, 76, 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 lg:mb-20">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Choose Your{" "}
            <span className="text-gold">Level of Power</span>
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            From free exploration to institutional-grade wealth building.
            Every tier unlocks more of the council.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 0.08}>
              <div className="h-full">
                {tier.luxury ? (
                  <LuxuryCard tier={tier} />
                ) : tier.highlighted ? (
                  <HighlightedCard tier={tier} />
                ) : (
                  <StandardCard tier={tier} />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <p className="text-center text-sm text-white/30 mt-12">
            All prices in USD. ZAR equivalent shown for South African users.
            Cancel anytime. No hidden fees.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StandardCard({ tier }: { tier: PricingTier }) {
  return (
    <Glassmorphism
      intensity="subtle"
      className="p-6 h-full flex flex-col group hover:border-[rgba(255,255,255,0.2)] transition-all duration-300"
    >
      <CardContent tier={tier} />
      <div className="mt-auto pt-6">
        <a
          href="#"
          className="btn-secondary block text-center w-full py-3 text-sm"
        >
          {tier.cta}
        </a>
      </div>
    </Glassmorphism>
  );
}

function HighlightedCard({ tier }: { tier: PricingTier }) {
  return (
    <div className="relative h-full">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-[#0a0a0f] text-xs font-semibold uppercase tracking-wider">
          <Star className="w-3 h-3" />
          Most Popular
        </span>
      </div>
      <Glassmorphism
        intensity="strong"
        className="p-6 h-full flex flex-col border-[rgba(201,168,76,0.3)] glow-accent"
      >
        <CardContent tier={tier} accentPrice />
        <div className="mt-auto pt-6">
          <a
            href="#"
            className="btn-primary block text-center w-full py-3 text-sm"
          >
            {tier.cta}
          </a>
        </div>
      </Glassmorphism>
    </div>
  );
}

function LuxuryCard({ tier }: { tier: PricingTier }) {
  return (
    <div className="relative h-full">
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-60"
        style={{
          background:
            "linear-gradient(135deg, #c9a84c 0%, #f0d78c 25%, #c9a84c 50%, #8b7332 75%, #c9a84c 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className="relative rounded-2xl h-full flex flex-col p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(10, 10, 15, 0.95) 40%)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            By Invitation
          </span>
        </div>

        <CardContent tier={tier} accentPrice />

        <div className="mt-auto pt-6">
          <a
            href="#"
            className="block text-center w-full py-3 text-sm font-semibold rounded-xl transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, #c9a84c, #f0d78c)",
              color: "#0a0a0f",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {tier.cta}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

function CardContent({
  tier,
  accentPrice = false,
}: {
  tier: PricingTier;
  accentPrice?: boolean;
}) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>

      <div className="mb-1">
        <span
          className={`text-3xl font-bold ${accentPrice ? "text-gold" : ""}`}
        >
          {formatPrice(tier.priceUSD)}
        </span>
        <span className="text-white/40 text-sm ml-1">{tier.period}</span>
      </div>
      <p className="text-xs text-white/30 mb-6">{tier.priceZAR}/mo</p>

      <ul className="space-y-2.5 flex-1">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-white/60"
          >
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
