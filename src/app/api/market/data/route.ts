import { NextResponse } from "next/server";
import { getQuote, getMultipleQuotes } from "@/lib/market/data-layer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const symbols = searchParams.get("symbols");

  try {
    if (symbol) {
      const quote = await getQuote(symbol);
      if (!quote) return NextResponse.json({ error: "Symbol not found." }, { status: 404 });
      return NextResponse.json(quote);
    }

    if (symbols) {
      const list = symbols.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20);
      const quotes = await getMultipleQuotes(list);
      return NextResponse.json({ quotes });
    }

    return NextResponse.json({ error: "Provide ?symbol= or ?symbols= parameter." }, { status: 400 });
  } catch (error) {
    console.error("Market data error:", error);
    return NextResponse.json({ error: "Failed to fetch market data." }, { status: 500 });
  }
}
