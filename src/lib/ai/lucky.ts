import { routeAI, type AIMessage, type TaskType } from "./router";

const LUCKY_SYSTEM_PROMPT = `You are Lucky, the AI wealth intelligence assistant for Vaultr.

PERSONALITY RULES — ABSOLUTE:
- You are emotionless and precise. Zero emotion in every response.
- Never use exclamation marks, emojis, or emotional language.
- Never say "I think", "I feel", "I believe", "unfortunately", "great news", "exciting".
- Speak in data, facts, probabilities, and actionable directives.
- Format: concise paragraphs, bullet points for data, tables for comparisons.
- Always cite confidence levels as percentages.
- Always cite risk as a percentage of portfolio.

CAPABILITIES:
- Financial analysis (stocks, crypto, forex, commodities, ETFs)
- Portfolio optimization and rebalancing recommendations
- Tax optimization guidance (South Africa focused, global aware)
- Market scanning and opportunity identification
- Risk assessment and position sizing
- Institutional-grade analysis using Goldman Sachs, Morgan Stanley, BlackRock, Citadel, Renaissance Technologies methodologies

RESPONSE FORMAT:
- Lead with the conclusion/recommendation
- Support with 2-3 data points
- End with risk assessment and confidence level
- If uncertain, state probability ranges, never guess

RESTRICTIONS:
- Never provide guaranteed returns or promises
- Always disclose this is AI analysis, not financial advice
- Flag risk above 2% as requiring user override`;

function classifyTask(message: string): TaskType {
  const lower = message.toLowerCase();
  if (lower.includes("price") || lower.includes("market") || lower.includes("news") || lower.includes("current")) {
    return "realtime_data";
  }
  if (lower.includes("analys") || lower.includes("dcf") || lower.includes("screen") || lower.includes("earning")) {
    return "financial_analysis";
  }
  return "reasoning";
}

export async function askLucky(
  userMessage: string,
  conversationHistory: AIMessage[] = [],
  context?: { portfolio?: string; tier?: string; memoryContext?: string }
): Promise<{ response: string; provider: string; model: string }> {
  const taskType = classifyTask(userMessage);

  let contextAddendum = context
    ? `\n\nUSER CONTEXT:\n- Tier: ${context.tier || "free"}\n- Portfolio: ${context.portfolio || "N/A"}`
    : "";

  if (context?.memoryContext) {
    contextAddendum += `\n\n${context.memoryContext}`;
  }

  const messages: AIMessage[] = [
    { role: "system", content: LUCKY_SYSTEM_PROMPT + contextAddendum },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const result = await routeAI(messages, taskType, { temperature: 0.2 });

  // Enforce emotionless output — strip any emotional language that slipped through
  let cleaned = result.content
    .replace(/!\s/g, ". ")
    .replace(/!$/gm, ".")
    .replace(/\b(unfortunately|fortunately|exciting|amazing|wonderful|terrible|horrible|fantastic)\b/gi, "")
    .replace(/\b(I think|I feel|I believe|in my opinion)\b/gi, "Analysis indicates")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { response: cleaned, provider: result.provider, model: result.model };
}
