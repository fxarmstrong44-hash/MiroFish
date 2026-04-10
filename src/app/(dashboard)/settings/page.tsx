"use client";

import { useState } from "react";
import { Settings, CreditCard, User, Shield, Brain, Trash2, RefreshCw, CheckCircle } from "lucide-react";
import { TIERS } from "@/lib/payments/tiers";

export default function SettingsPage() {
  const currentTier = "free";
  const [securityScore, setSecurityScore] = useState<number | null>(null);
  const [securityGrade, setSecurityGrade] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [memoryCount, setMemoryCount] = useState<number | null>(null);
  const [pruning, setPruning] = useState(false);

  async function runSecurityScan() {
    setScanning(true);
    try {
      const res = await fetch("/api/security");
      const data = await res.json();
      setSecurityScore(data.report.score);
      setSecurityGrade(data.report.grade);
    } catch {
      setSecurityScore(-1);
    }
    setScanning(false);
  }

  async function loadMemoryStats() {
    try {
      const res = await fetch("/api/ai/memory");
      const data = await res.json();
      const mem = data.memory;
      const total = (mem.preferences?.length || 0) + (mem.recentAnalyses?.length || 0) +
        (mem.tradingPatterns?.length || 0) + (mem.insights?.length || 0) + (mem.contextWindow?.length || 0);
      setMemoryCount(total);
    } catch {
      setMemoryCount(0);
    }
  }

  async function pruneMemory() {
    setPruning(true);
    try {
      await fetch("/api/ai/memory", { method: "DELETE" });
      await loadMemoryStats();
    } catch {
      // ignore
    }
    setPruning(false);
  }

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

      {/* AI Memory */}
      <div className="glass p-6">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4"><Brain className="w-4 h-4" /> AI Memory</h2>
        <p className="text-sm text-white/50 mb-4">
          Lucky AI stores your preferences, past analyses, and trading patterns to provide personalized recommendations.
        </p>
        <div className="flex items-center gap-3">
          <button onClick={loadMemoryStats} className="btn-secondary text-sm flex items-center gap-2">
            <RefreshCw className="w-3 h-3" /> Load Stats
          </button>
          <button onClick={pruneMemory} disabled={pruning} className="btn-secondary text-sm flex items-center gap-2 text-yellow-400 border-yellow-400/20">
            <Trash2 className="w-3 h-3" /> {pruning ? "Pruning..." : "Prune Expired"}
          </button>
        </div>
        {memoryCount !== null && (
          <div className="mt-3 glass-subtle p-3 text-sm">
            <span className="text-white/50">Total memories stored: </span>
            <span className="text-white font-medium">{memoryCount}</span>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="glass p-6">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-4"><Shield className="w-4 h-4" /> Security</h2>
        <div className="flex items-center gap-3 mb-4">
          <button className="btn-secondary text-sm">Change Password</button>
          <button onClick={runSecurityScan} disabled={scanning} className="btn-secondary text-sm flex items-center gap-2">
            {scanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            {scanning ? "Scanning..." : "Run Security Audit"}
          </button>
        </div>
        {securityScore !== null && securityScore >= 0 && (
          <div className="glass-subtle p-4">
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold ${securityScore >= 90 ? "text-emerald-400" : securityScore >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                {securityGrade}
              </div>
              <div>
                <div className="text-sm text-white">Security Score: {securityScore}/100</div>
                <div className="text-xs text-white/40">
                  {securityScore >= 90 ? "Excellent - no critical issues" : securityScore >= 70 ? "Good - minor issues found" : "Needs attention - review findings"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
