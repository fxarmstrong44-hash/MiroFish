import { NextResponse } from "next/server";
import { assessRisk, validateAutopilotTrade } from "@/lib/ai/risk-engine";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const symbol = sanitizeString(body.symbol || "").toUpperCase();
    const direction = body.direction === "sell" ? "sell" as const : "buy" as const;
    const quantity = Number(body.quantity) || 1;
    const price = Number(body.price) || 0;
    const isAutopilot = body.autopilot === true;

    if (!symbol || !price) {
      return NextResponse.json({ error: "Symbol and price required." }, { status: 400 });
    }

    const risk = assessRisk({
      portfolioValue: body.portfolioValue || 100000,
      entryPrice: price,
      direction,
      confidence: body.confidence || 50,
      volatility: body.volatility || 15,
      userOverride: body.userOverride,
    });

    if (isAutopilot) {
      const autopilotCheck = validateAutopilotTrade(risk.riskPct);
      if (!autopilotCheck.allowed) {
        return NextResponse.json({ error: autopilotCheck.reason, blocked: true }, { status: 403 });
      }
    }

    if (!risk.allowed) {
      return NextResponse.json({
        error: risk.reason,
        requiresOverride: true,
        riskPct: risk.riskPct,
      }, { status: 403 });
    }

    // In production: execute via broker API and save to Supabase
    const trade = {
      id: crypto.randomUUID(),
      symbol,
      direction,
      quantity,
      price,
      fee: price * quantity * 0.001,
      stopLoss: risk.stopLoss,
      takeProfit: risk.takeProfit,
      riskPct: risk.riskPct,
      positionSize: risk.positionSize,
      executed_at: new Date().toISOString(),
      is_simulated: body.simulated !== false,
    };

    return NextResponse.json(trade);
  } catch (error) {
    console.error("Execute error:", error);
    return NextResponse.json({ error: "Trade execution failed." }, { status: 500 });
  }
}
