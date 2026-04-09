import { NextResponse } from "next/server";
import { getMultipleQuotes } from "@/lib/market/data-layer";

export async function GET() {
  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "BTC/USDT", "ETH/USDT"];

  try {
    const quotes = await getMultipleQuotes(symbols);
    const movers = quotes
      .filter((q) => Math.abs(q.changePct) > 3)
      .map((q) => ({
        symbol: q.symbol,
        price: q.price,
        changePct: q.changePct,
        type: q.changePct > 0 ? "gainer" : "loser",
      }));

    return NextResponse.json({ movers, scannedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Market scan error:", error);
    return NextResponse.json({ error: "Scan failed." }, { status: 500 });
  }
}
