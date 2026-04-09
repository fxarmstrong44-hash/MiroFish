import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { buildScreenerPrompt } from "@/lib/ai/prompts/goldman-sachs";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sector = body.sector ? sanitizeString(body.sector) : undefined;
    const marketCap = body.marketCap ? sanitizeString(body.marketCap) : undefined;
    const query = sanitizeString(body.query || "Find the top 5 stocks matching the screening criteria.");

    const prompt = buildScreenerPrompt(sector, marketCap);

    const result = await routeAI(
      [
        { role: "system", content: prompt },
        { role: "user", content: query },
      ],
      "financial_analysis",
      { temperature: 0.3, maxTokens: 2048 }
    );

    return NextResponse.json({ result: result.content, provider: result.provider });
  } catch (error) {
    console.error("Screener error:", error);
    return NextResponse.json({ error: "Screener failed." }, { status: 500 });
  }
}
