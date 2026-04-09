"use client";

import { useState, useEffect } from "react";
import { ScanEye, Loader2, TrendingUp, TrendingDown } from "lucide-react";

export default function MarketPage() {
  const [data, setData] = useState<{ quotes: { symbol: string; price: number; changePct: number }[]; analysis: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/vision")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><ScanEye className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Lucky Vision</h1>
          <p className="text-xs text-white/40">Real-time market scanner and opportunity identification</p>
        </div>
      </div>

      {loading ? (
        <div className="glass p-12 text-center"><Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin mx-auto" /><p className="text-white/40 mt-2">Scanning markets...</p></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data?.quotes?.map((q) => (
              <div key={q.symbol} className="glass p-4">
                <div className="text-sm font-medium text-white">{q.symbol}</div>
                <div className="text-lg font-bold text-white">${q.price?.toLocaleString()}</div>
                <div className={`flex items-center gap-1 text-sm ${q.changePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {q.changePct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {q.changePct >= 0 ? "+" : ""}{q.changePct?.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
          {data?.analysis && (
            <div className="glass p-6">
              <h2 className="font-semibold text-white mb-3">AI Analysis</h2>
              <div className="text-sm text-white/70 whitespace-pre-wrap">{data.analysis}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
