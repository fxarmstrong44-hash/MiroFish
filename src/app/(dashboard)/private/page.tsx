"use client";

import LuxuryLayout from "@/components/private-banking/luxury-layout";
import Concierge from "@/components/private-banking/concierge";
import { Shield, Zap, Key, Globe, Code, TrendingUp, Briefcase, Crown } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Concierge AI", desc: "Dedicated Lucky instance with extended context window, priority processing, and institutional-grade depth" },
  { icon: Key, title: "Direct API Access", desc: "Programmatic access to all Vaultr endpoints \u2014 build custom integrations, dashboards, and automations" },
  { icon: Shield, title: "Custom Strategies", desc: "Build, backtest, and deploy bespoke strategy compositions with the full 18-brain council" },
  { icon: Globe, title: "Exclusive Intelligence", desc: "Institutional research reports, macro briefings, and pre-market analysis delivered daily" },
  { icon: Code, title: "Webhook Alerts", desc: "Real-time webhook delivery for trade signals, council consensus changes, and portfolio events" },
  { icon: TrendingUp, title: "Advanced Analytics", desc: "Sharpe ratio tracking, drawdown analysis, correlation matrices, and factor attribution" },
  { icon: Briefcase, title: "Tax & Estate Planning", desc: "Dedicated offshore optimization, trust structuring, and multi-jurisdictional tax advisory" },
  { icon: Crown, title: "White-Glove Onboarding", desc: "Personal strategy consultation and portfolio architecture review with AI-assisted optimization" },
];

export default function PrivateBankingPage() {
  return (
    <LuxuryLayout
      title="Private Banking"
      subtitle="Vaultr Elite \u2014 By Invitation Only. Institutional-grade wealth intelligence, concierge AI, and exclusive tools reserved for our most discerning clients."
    >
      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.05), rgba(255,255,255,0.02))",
              border: "1px solid rgba(201,168,76,0.12)",
            }}
          >
            <feature.icon className="w-5 h-5 text-[#c9a84c] mb-3" />
            <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Concierge chat */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Private Concierge</h2>
        <Concierge />
      </div>

      {/* Pricing CTA */}
      <div
        className="rounded-2xl p-8 text-center border border-[#c9a84c]/15"
        style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))" }}
      >
        <Crown className="w-12 h-12 text-[#c9a84c]/30 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gold mb-2">$10,000/month</h3>
        <p className="text-white/40 text-sm mb-6">R169,884/month \u2014 All Vaultr features plus private banking, concierge AI, and direct API</p>
        <button className="btn-primary px-8 py-3">Apply for Access</button>
      </div>
    </LuxuryLayout>
  );
}
