"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Brain, Briefcase, LineChart,
  ScanEye, Bell, Handshake, Users, FileKey, Calculator,
  Globe, Building2, Shield, Settings, Crown, ChevronLeft,
  ChevronRight, Sparkles,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/lucky", icon: MessageSquare, label: "Lucky AI" },
  { href: "/council", icon: Brain, label: "AI Council" },
  { href: "/portfolio", icon: Briefcase, label: "Portfolio" },
  { href: "/simulator", icon: LineChart, label: "Simulator" },
  { href: "/market", icon: ScanEye, label: "Market Scanner" },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { divider: true, label: "Wealth" },
  { href: "/deals", icon: Handshake, label: "Deal Marketplace", tier: "elite" },
  { href: "/network", icon: Users, label: "Network", tier: "elite" },
  { href: "/vault", icon: FileKey, label: "Vault", tier: "elite" },
  { href: "/tax", icon: Calculator, label: "Tax Optimizer", tier: "pro" },
  { href: "/wealth", icon: Globe, label: "Global Wealth", tier: "pro" },
  { href: "/business", icon: Building2, label: "Business Builder", tier: "elite" },
  { href: "/discipline", icon: Shield, label: "Discipline" },
  { divider: true, label: "Account" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/private", icon: Crown, label: "Private Banking", tier: "secret" },
] as const;

export default function Sidebar({ tier = "free" }: { tier?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const tierOrder = ["free", "starter", "pro", "elite", "secret"];
  const userTierIndex = tierOrder.indexOf(tier);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-screen sticky top-0 flex flex-col bg-[#0a0a0f] border-r border-white/5 transition-all duration-300`}
    >
      <div className="p-4 flex items-center gap-2 border-b border-white/5">
        <Sparkles className="w-6 h-6 text-[#c9a84c] flex-shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold text-gold">Vaultr</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item, i) => {
          if ("divider" in item && item.divider) {
            return collapsed ? (
              <div key={i} className="border-t border-white/5 my-2" />
            ) : (
              <div key={i} className="pt-4 pb-1 px-3">
                <span className="text-xs font-medium text-white/30 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            );
          }

          const navItem = item as {
            href: string;
            icon: React.ComponentType<{ className?: string }>;
            label: string;
            tier?: string;
          };

          const requiredTierIndex = navItem.tier ? tierOrder.indexOf(navItem.tier) : 0;
          const locked = requiredTierIndex > userTierIndex;
          const active = pathname === navItem.href;
          const Icon = navItem.icon;

          return (
            <Link
              key={navItem.href}
              href={locked ? "/settings" : navItem.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                  : locked
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              title={collapsed ? navItem.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{navItem.label}</span>
                  {locked && (
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">
                      {navItem.tier?.toUpperCase()}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/5 text-white/40 hover:text-white transition flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
