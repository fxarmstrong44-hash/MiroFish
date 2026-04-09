import { NextResponse } from "next/server";

export async function GET() {
  // In production: fetch from Supabase for authenticated user
  return NextResponse.json({
    portfolio: {
      id: "default",
      name: "Paper Trading",
      is_simulated: true,
      virtual_balance: 100000,
      initial_balance: 100000,
      positions: [],
      totalPnl: 0,
      totalPnlPct: 0,
    },
  });
}
