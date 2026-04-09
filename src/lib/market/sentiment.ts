import { routeAI } from "../ai/router";

export interface SentimentResult {
  symbol: string;
  score: number; // -100 to 100
  label: "very_bearish" | "bearish" | "neutral" | "bullish" | "very_bullish";
  sources: string[];
  summary: string;
}

export async function analyzeSentiment(symbol: string, newsHeadlines: string[]): Promise<SentimentResult> {
  if (newsHeadlines.length === 0) {
    return { symbol, score: 0, label: "neutral", sources: [], summary: "No recent news data available." };
  }

  const result = await routeAI(
    [
      {
        role: "system",
        content: `Analyze the sentiment of these news headlines for ${symbol}. Respond in JSON:
{"score": -100 to 100, "label": "very_bearish"|"bearish"|"neutral"|"bullish"|"very_bullish", "summary": "1-2 sentences"}`,
      },
      {
        role: "user",
        content: newsHeadlines.join("\n"),
      },
    ],
    "financial_analysis",
    { temperature: 0.1, maxTokens: 200 }
  );

  try {
    const parsed = JSON.parse(result.content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
    return {
      symbol,
      score: parsed.score,
      label: parsed.label,
      sources: newsHeadlines.slice(0, 5),
      summary: parsed.summary,
    };
  } catch {
    return { symbol, score: 0, label: "neutral", sources: newsHeadlines.slice(0, 3), summary: "Sentiment analysis inconclusive." };
  }
}
