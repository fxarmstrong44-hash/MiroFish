"use client";

const SAMPLE_TICKERS = [
  { symbol: "BTC", price: "67,234", change: 2.4 },
  { symbol: "ETH", price: "3,456", change: -0.8 },
  { symbol: "AAPL", price: "189.23", change: 1.1 },
  { symbol: "TSLA", price: "245.67", change: -2.3 },
  { symbol: "USD/ZAR", price: "18.42", change: 0.3 },
  { symbol: "GOLD", price: "2,342", change: 0.5 },
  { symbol: "S&P500", price: "5,234", change: 0.7 },
  { symbol: "NAS100", price: "18,567", change: 1.2 },
];

export default function MarketTicker() {
  return (
    <div className="overflow-hidden border-b border-white/5 bg-white/[0.02]">
      <div className="flex animate-[scroll_30s_linear_infinite] gap-8 py-2 px-4 whitespace-nowrap">
        {[...SAMPLE_TICKERS, ...SAMPLE_TICKERS].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="font-medium text-white/70">{t.symbol}</span>
            <span className="text-white/50">${t.price}</span>
            <span className={t.change >= 0 ? "text-emerald-400" : "text-red-400"}>
              {t.change >= 0 ? "+" : ""}{t.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
