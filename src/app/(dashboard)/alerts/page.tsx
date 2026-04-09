"use client";

import { useState } from "react";
import { Bell, Plus, Trash2 } from "lucide-react";

interface Alert { id: string; symbol: string; type: string; condition: string; is_active: boolean }

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState("price");
  const [condition, setCondition] = useState("");

  async function addAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol) return;
    const res = await fetch("/api/market/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: symbol.toUpperCase(), type, condition: { value: condition } }),
    });
    const data = await res.json();
    setAlerts((prev) => [...prev, { id: data.id, symbol: symbol.toUpperCase(), type, condition, is_active: true }]);
    setSymbol(""); setCondition("");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Bell className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-xs text-white/40">Price alerts, opportunity signals, and market news</p>
        </div>
      </div>

      <form onSubmit={addAlert} className="glass p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol (AAPL)" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50">
            <option value="price">Price Alert</option>
            <option value="opportunity">Opportunity Signal</option>
            <option value="news">Market News</option>
          </select>
          <input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Condition (e.g., > 200)" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50" />
        </div>
        <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Alert</button>
      </form>

      <div className="glass overflow-hidden">
        <div className="p-4 border-b border-white/5"><h2 className="font-semibold text-white">Active Alerts ({alerts.length})</h2></div>
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-white/30">No alerts configured. Add one above.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <span className="font-medium text-white">{a.symbol}</span>
                  <span className="text-xs text-white/40 ml-2">{a.type} — {a.condition}</span>
                </div>
                <button onClick={() => setAlerts((p) => p.filter((x) => x.id !== a.id))} className="text-white/30 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
