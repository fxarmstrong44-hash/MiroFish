"use client";

interface Props {
  buyCount: number;
  sellCount: number;
  holdCount: number;
  consensusScore: number;
  confidence: number;
}

export default function ConsensusMeter({ buyCount, sellCount, holdCount, consensusScore, confidence }: Props) {
  const total = buyCount + sellCount + holdCount;
  const buyPct = total > 0 ? (buyCount / total) * 100 : 0;
  const sellPct = total > 0 ? (sellCount / total) * 100 : 0;
  const holdPct = total > 0 ? (holdCount / total) * 100 : 0;

  const strength = consensusScore >= 70 ? "Very Strong" : consensusScore >= 50 ? "Strong" : consensusScore >= 30 ? "Plausible" : "Weak";

  return (
    <div className="glass p-6">
      <h3 className="text-sm font-medium text-white/50 mb-4">Council Consensus</h3>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 w-10">BUY</span>
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${buyPct}%` }} />
          </div>
          <span className="text-xs text-white/50 w-12 text-right">{buyCount}/{total}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-yellow-400 w-10">HOLD</span>
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${holdPct}%` }} />
          </div>
          <span className="text-xs text-white/50 w-12 text-right">{holdCount}/{total}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-red-400 w-10">SELL</span>
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${sellPct}%` }} />
          </div>
          <span className="text-xs text-white/50 w-12 text-right">{sellCount}/{total}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div>
          <div className="text-xs text-white/40">Consensus Strength</div>
          <div className="text-lg font-bold text-white">{strength}</div>
        </div>
        <div>
          <div className="text-xs text-white/40">Avg Confidence</div>
          <div className="text-lg font-bold text-white">{confidence.toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}
