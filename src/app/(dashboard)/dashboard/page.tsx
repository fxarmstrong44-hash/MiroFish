"use client";

import BWIGauge from "@/components/dashboard/bwi-gauge";
import PortfolioCard from "@/components/dashboard/portfolio-card";
import { Brain, MessageSquare, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { href: "/lucky", icon: MessageSquare, label: "Ask Lucky", desc: "AI analysis on any asset" },
  { href: "/council", icon: Brain, label: "Run Council", desc: "18-brain consensus vote" },
  { href: "/simulator", icon: TrendingUp, label: "Paper Trade", desc: "Practice risk-free" },
  { href: "/discipline", icon: Shield, label: "Discipline", desc: "Check your score" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Your wealth intelligence overview</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PortfolioCard label="Portfolio Value" value="100,000.00" change={0} />
        <PortfolioCard label="Today P&L" value="0.00" change={0} />
        <PortfolioCard label="Open Positions" value="0" prefix="" />
        <PortfolioCard label="Win Rate" value="--" prefix="" />
      </div>

      {/* BWI + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BWIGauge score={25} />

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="glass p-5 hover:border-[#c9a84c]/30 transition group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#c9a84c]/10 group-hover:bg-[#c9a84c]/20 transition">
                  <action.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <div className="font-medium text-white">{action.label}</div>
                  <div className="text-sm text-white/50 mt-0.5">{action.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-white/30">
          <p>No activity yet. Start by asking Lucky for a market analysis.</p>
          <Link href="/lucky" className="btn-primary inline-block mt-4 text-sm">
            Open Lucky AI
          </Link>
        </div>
      </div>
    </div>
  );
}
