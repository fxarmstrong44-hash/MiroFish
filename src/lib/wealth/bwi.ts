// Vaultr Wealth Index (VWI) — Power Score Calculator
// BWI = (0.3 × portfolio_growth) + (0.2 × discipline_score) + (0.2 × network_value) + (0.15 × consistency) + (0.15 × capital_preservation)

export interface BWIInputs {
  portfolioGrowthPct: number;    // Portfolio return %
  disciplineScore: number;        // 0-100
  networkConnections: number;     // Number of active connections
  consistencyScore: number;       // 0-100 (trading plan adherence)
  capitalPreservationPct: number; // % of capital preserved during drawdowns
}

export function calculateBWI(inputs: BWIInputs): number {
  // Normalize portfolio growth to 0-100 scale (cap at 100% annual)
  const normalizedGrowth = Math.min(100, Math.max(0, (inputs.portfolioGrowthPct + 50) * (100 / 150)));

  // Normalize network (cap at 50 connections = max score)
  const normalizedNetwork = Math.min(100, (inputs.networkConnections / 50) * 100);

  const bwi =
    (0.3 * normalizedGrowth) +
    (0.2 * inputs.disciplineScore) +
    (0.2 * normalizedNetwork) +
    (0.15 * inputs.consistencyScore) +
    (0.15 * inputs.capitalPreservationPct);

  return Math.round(Math.min(100, Math.max(0, bwi)));
}

export function getBWILabel(score: number): string {
  if (score >= 90) return "Titan";
  if (score >= 75) return "Emperor";
  if (score >= 60) return "Commander";
  if (score >= 40) return "Soldier";
  if (score >= 20) return "Recruit";
  return "Initiate";
}

export function getBWIColor(score: number): string {
  if (score >= 90) return "#FFD700"; // Gold
  if (score >= 75) return "#C0C0C0"; // Silver
  if (score >= 60) return "#CD7F32"; // Bronze
  if (score >= 40) return "#4ECDC4"; // Teal
  return "#6B7280"; // Gray
}
