import { NextResponse } from "next/server";
import { runCouncil } from "@/lib/ai/council";
import { getQuote } from "@/lib/market/data-layer";
import { simulateTrade } from "@/lib/ai/simulation-engine";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const symbol = sanitizeString(body.symbol || "").toUpperCase();

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required." }, { status: 400 });
    }

    // Get market data
    const quote = await getQuote(symbol);
    const marketData = quote
      ? `Price: $${quote.price}, Change: ${quote.changePct}%, Volume: ${quote.volume}, High: $${quote.high}, Low: $${quote.low}, Open: $${quote.open}, Prev Close: $${quote.previousClose}`
      : `Symbol: ${symbol} — No real-time data available. Analyze based on general knowledge.`;

    // Run council
    const decision = await runCouncil(symbol, marketData);

    // Run simulation
    const simulation = simulateTrade({
      confidence: decision.confidence,
      consensusScore: decision.consensusScore,
      riskPct: decision.riskPct,
      volatility: quote ? Math.abs(quote.changePct) * 5 : 15,
    });

    return NextResponse.json({
      ...decision,
      probabilityWin: simulation.probabilityWin,
      probabilityLoss: simulation.probabilityLoss,
      simulation,
    });
  } catch (error) {
    console.error("Council error:", error);
    return NextResponse.json({ error: "Council analysis failed." }, { status: 500 });
  }
}
