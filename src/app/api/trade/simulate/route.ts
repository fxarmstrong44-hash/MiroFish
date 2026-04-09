import { NextResponse } from "next/server";
import { assessRisk } from "@/lib/ai/risk-engine";
import { simulateTrade } from "@/lib/ai/simulation-engine";
import { sanitizeString } from "@/lib/security/sanitize";
import { getQuote } from "@/lib/market/data-layer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const symbol = sanitizeString(body.symbol || "").toUpperCase();
    const direction = body.direction === "sell" ? "sell" as const : "buy" as const;
    const quantity = Number(body.quantity) || 1;
    const portfolioValue = Number(body.portfolioValue) || 100000;

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required." }, { status: 400 });
    }

    const quote = await getQuote(symbol);
    const price = quote?.price || Number(body.price) || 0;

    if (!price) {
      return NextResponse.json({ error: "Could not determine price." }, { status: 400 });
    }

    const volatility = quote ? Math.abs(quote.changePct) * 5 : 15;

    const risk = assessRisk({
      portfolioValue,
      entryPrice: price,
      direction,
      confidence: body.confidence || 50,
      volatility,
    });

    const simulation = simulateTrade({
      confidence: body.confidence || 50,
      consensusScore: body.consensusScore || 50,
      riskPct: risk.riskPct,
      volatility,
    });

    return NextResponse.json({
      symbol,
      direction,
      quantity,
      price,
      totalValue: price * quantity,
      risk,
      simulation,
      isSimulated: true,
    });
  } catch (error) {
    console.error("Simulate error:", error);
    return NextResponse.json({ error: "Simulation failed." }, { status: 500 });
  }
}
