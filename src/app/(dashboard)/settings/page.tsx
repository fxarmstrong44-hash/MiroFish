"use client";

import { Settings, CreditCard, User, Shield } from "lucide-react";
import { TIERS } from "@/lib/payments/tiers";

export default function SettingsPage() {
  const currentTier = "free";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Settings className="w-6 h-6 text-[#c9a84c]" /></div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      {/* Profile */}
      <div className="glass p-6">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4"><User className="w-4 h-4" /> Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-xs text-white/50">Full Name</label><input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white mt-1 focus:outline-none focus:border-[#c9a84c]/50" defaultValue="" placeholder="Your name" /></div>
          <div><label className="text-xs text-white/50">Country</label><input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white mt-1 focus:outline-none focus:border-[#c9a84c]/50" defaultValue="South Africa" /></div>
        </div>
        <button className="btn-primary text-sm mt-4">Save Changes</button>
      </div>

      {/* Subscription */}
      <div className="glass p-6">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4" /> Subscription</h2>
        <div className="mb-4">
          <span className="text-sm text-white/50">Current Plan: </span>
          <span className="text-[#c9a84c] font-medium">{TIERS[currentTier].name}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(TIERS).filter((t) => t.id !== "free" && t.id !== "secret").map((tier) => (
            <div key={tier.id} className={`glass-subtle p-4 cursor-pointer hover:border-[#c9a84c]/30 transition ${tier.id === "pro" ? "border-[#c9a84c]/30" : ""}`}>
              <div className="font-medium text-white">{tier.name}</div>
              <div className="text-[#c9a84c] font-bold">${tier.priceUSD}<span className="text-xs text-white/30">/mo</span></div>
              <div className="text-xs text-white/30">R{tier.priceZAR}/mo</div>
              <button className="btn-secondary text-xs w-full mt-3 py-2">Upgrade</button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="glass p-6">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4"><Shield className="w-4 h-4" /> Security</h2>
        <button className="btn-secondary text-sm">Change Password</button>
      </div>
    </div>
  );
}
