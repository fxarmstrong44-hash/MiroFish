export interface DisciplineAssessment {
  score: number; // 0-100
  label: string;
  factors: DisciplineFactor[];
  recommendations: string[];
}

export interface DisciplineFactor {
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export function assessDiscipline(params: {
  stopLossAdherence: number;  // % of trades where SL was respected
  planFollowed: number;        // % of trades following the plan
  overtrading: number;         // trades per day (lower = better)
  revengeTrading: number;      // consecutive losses followed by increased size
  emotionalOverrides: number;  // times user overrode AI recommendation
  holdingPeriodConsistency: number; // % of trades held to target
}): DisciplineAssessment {
  const factors: DisciplineFactor[] = [
    {
      name: "Stop-Loss Adherence",
      score: params.stopLossAdherence,
      weight: 0.25,
      detail: `${params.stopLossAdherence}% of trades honored stop-loss levels.`,
    },
    {
      name: "Plan Adherence",
      score: params.planFollowed,
      weight: 0.2,
      detail: `${params.planFollowed}% of trades followed the pre-set plan.`,
    },
    {
      name: "Trade Frequency",
      score: Math.max(0, 100 - params.overtrading * 10),
      weight: 0.15,
      detail: `${params.overtrading} trades/day avg. Optimal: 1-3.`,
    },
    {
      name: "Revenge Trading",
      score: Math.max(0, 100 - params.revengeTrading * 25),
      weight: 0.2,
      detail: `${params.revengeTrading} revenge trading instances detected.`,
    },
    {
      name: "AI Alignment",
      score: Math.max(0, 100 - params.emotionalOverrides * 15),
      weight: 0.1,
      detail: `${params.emotionalOverrides} emotional overrides of AI recommendations.`,
    },
    {
      name: "Holding Consistency",
      score: params.holdingPeriodConsistency,
      weight: 0.1,
      detail: `${params.holdingPeriodConsistency}% of trades held to target.`,
    },
  ];

  const totalScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const score = Math.round(Math.min(100, Math.max(0, totalScore)));

  const label = score >= 80 ? "Disciplined Operator" :
    score >= 60 ? "Developing Discipline" :
    score >= 40 ? "Needs Improvement" : "At Risk";

  const recommendations: string[] = [];
  for (const factor of factors) {
    if (factor.score < 50) {
      recommendations.push(`Improve ${factor.name}: ${factor.detail}`);
    }
  }

  if (recommendations.length === 0) {
    recommendations.push("Maintain current discipline. Performance metrics are strong.");
  }

  return { score, label, factors, recommendations };
}
