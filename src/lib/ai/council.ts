import { routeAI, type AIMessage } from "./router";

export interface Brain {
  name: string;
  style: string;
  weight: number;
  focus: string;
}

export interface BrainVote {
  brain: string;
  vote: "buy" | "sell" | "hold";
  confidence: number;
  weight: number;
  reasoning: string;
}

export interface CouncilDecision {
  symbol: string;
  direction: "buy" | "sell" | "hold";
  votes: BrainVote[];
  consensusScore: number;
  confidence: number;
  riskPct: number;
  explanation: string;
  probabilityWin: number;
  probabilityLoss: number;
}

export const COUNCIL_BRAINS: Brain[] = [
  { name: "Warren Buffett", style: "Value investing, long-term compounding, moats", weight: 1.5, focus: "fundamentals" },
  { name: "Ray Dalio", style: "Macro, all-weather, risk parity", weight: 1.5, focus: "macro" },
  { name: "George Soros", style: "Reflexivity, forex, macro bets", weight: 1.3, focus: "forex" },
  { name: "Peter Lynch", style: "Growth at reasonable price, sector rotation", weight: 1.2, focus: "growth" },
  { name: "Cathie Wood", style: "Disruptive innovation, high growth tech", weight: 1.0, focus: "innovation" },
  { name: "Jim Simons", style: "Quantitative, statistical arbitrage, patterns", weight: 2.0, focus: "quant" },
  { name: "Jesse Livermore", style: "Momentum, tape reading, trend following", weight: 1.0, focus: "momentum" },
  { name: "Benjamin Graham", style: "Deep value, margin of safety, fundamentals", weight: 1.3, focus: "value" },
  { name: "Charlie Munger", style: "Mental models, quality businesses, patience", weight: 1.2, focus: "quality" },
  { name: "Michael Burry", style: "Contrarian, deep research, asymmetric bets", weight: 1.1, focus: "contrarian" },
  { name: "Paul Tudor Jones", style: "Macro trading, risk management, technicals", weight: 1.2, focus: "macro_trading" },
  { name: "Stanley Druckenmiller", style: "Concentrated bets, macro, growth", weight: 1.3, focus: "concentrated" },
  { name: "John Templeton", style: "Global value, emerging markets, contrarian", weight: 1.1, focus: "global" },
  { name: "Carl Icahn", style: "Activist investing, corporate catalysts", weight: 1.0, focus: "activist" },
  { name: "David Tepper", style: "Distressed debt, event-driven, bold bets", weight: 1.0, focus: "distressed" },
  { name: "Howard Marks", style: "Market cycles, risk assessment, credit", weight: 1.2, focus: "cycles" },
  { name: "Ken Griffin", style: "Market making, multi-strategy, speed", weight: 1.3, focus: "multi_strategy" },
  { name: "Seth Klarman", style: "Deep value, patience, capital preservation", weight: 1.2, focus: "preservation" },
];

function buildBrainPrompt(brain: Brain, symbol: string, marketData: string): AIMessage[] {
  return [
    {
      role: "system",
      content: `You are simulating the investment thinking of ${brain.name}. Investment style: ${brain.style}. Focus: ${brain.focus}.

Analyze the given asset and provide your vote. You must respond in EXACTLY this JSON format:
{"vote": "buy"|"sell"|"hold", "confidence": 0-100, "reasoning": "2-3 sentences max"}

Be precise. No emotion. Data-driven analysis only.`,
    },
    {
      role: "user",
      content: `Analyze ${symbol} for a trading decision.\n\nMarket Data:\n${marketData}`,
    },
  ];
}

async function getBrainVote(brain: Brain, symbol: string, marketData: string): Promise<BrainVote> {
  try {
    const result = await routeAI(
      buildBrainPrompt(brain, symbol, marketData),
      "financial_analysis",
      { temperature: 0.3, maxTokens: 300 }
    );

    const parsed = JSON.parse(result.content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
    return {
      brain: brain.name,
      vote: parsed.vote,
      confidence: parsed.confidence,
      weight: brain.weight,
      reasoning: parsed.reasoning,
    };
  } catch {
    return {
      brain: brain.name,
      vote: "hold",
      confidence: 0,
      weight: brain.weight,
      reasoning: "Analysis unavailable — defaulting to hold.",
    };
  }
}

export async function runCouncil(symbol: string, marketData: string): Promise<CouncilDecision> {
  // Run all 18 brains in parallel
  const votes = await Promise.all(
    COUNCIL_BRAINS.map((brain) => getBrainVote(brain, symbol, marketData))
  );

  // Weighted vote tallying
  const tally = { buy: 0, sell: 0, hold: 0 };
  let totalWeight = 0;
  let totalConfidence = 0;

  for (const vote of votes) {
    tally[vote.vote] += vote.weight;
    totalWeight += vote.weight;
    totalConfidence += vote.confidence * vote.weight;
  }

  const direction = tally.buy > tally.sell && tally.buy > tally.hold
    ? "buy"
    : tally.sell > tally.buy && tally.sell > tally.hold
    ? "sell"
    : "hold";

  const agreeingVotes = votes.filter((v) => v.vote === direction);
  const consensusScore = (agreeingVotes.length / votes.length) * 100;
  const confidence = totalWeight > 0 ? totalConfidence / totalWeight : 0;

  // Consensus strength: 3+ = plausible, 5+ = strong, 12+ = very strong
  const consensusLabel =
    agreeingVotes.length >= 12 ? "Very Strong" :
    agreeingVotes.length >= 5 ? "Strong" :
    agreeingVotes.length >= 3 ? "Plausible" : "Weak";

  // Probability estimation
  const probabilityWin = Math.min(95, (confidence * 0.6) + (consensusScore * 0.4));
  const probabilityLoss = 100 - probabilityWin;

  // Risk estimation
  const avgConfidence = confidence;
  const riskPct = Math.max(0.5, 5 - (avgConfidence / 25));

  // Build explanation
  const topReasons = agreeingVotes
    .sort((a, b) => b.weight * b.confidence - a.weight * a.confidence)
    .slice(0, 3)
    .map((v) => `${v.brain}: ${v.reasoning}`)
    .join(" | ");

  const explanation = `Direction: ${direction.toUpperCase()} | Consensus: ${consensusLabel} (${agreeingVotes.length}/18 brains) | Confidence: ${confidence.toFixed(1)}% | Risk: ${riskPct.toFixed(1)}% | Win Probability: ${probabilityWin.toFixed(0)}% | Key Analysis: ${topReasons}`;

  return {
    symbol,
    direction,
    votes,
    consensusScore,
    confidence,
    riskPct,
    explanation,
    probabilityWin,
    probabilityLoss,
  };
}
