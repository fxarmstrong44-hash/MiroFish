import { NextResponse } from "next/server";
import { getMultipleQuotes } from "@/lib/market/data-layer";
import { routeAI } from "@/lib/ai/router";

const DEFAULT_WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "BTC/USDT", "ETH/USDT", "GOLD"];

export async function GET() {
  try {
    const quotes = await getMultipleQuotes(DEFAULT_WATCHLIST);

    const summary = quotes
      .map((q) => `${q.symbol}: $${q.price} (${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%)`)
      .join("\n");

    const analysis = await routeAI(
      [
        {
          role: "system",
          content: "You are Lucky Vision, a market scanning AI. Identify the top 3 opportunities and top 3 risks from the current market data. Be concise, data-driven, emotionless. Format as bullet points.",
        },
        { role: "user", content: `Current market snapshot:\n${summary}` },
      ],
      "realtime_data",
      { temperature: 0.2, maxTokens: 500 }
    );

    return NextResponse.json({
      quotes,
      analysis: analysis.content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Vision error:", error);
    return NextResponse.json({ error: "Market scan failed." }, { status: 500 });
  }
}
