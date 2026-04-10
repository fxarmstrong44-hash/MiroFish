import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's portfolio with positions
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (portfolioError) {
      // Return default paper trading portfolio if none exists
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

    const { data: positions } = await supabase
      .from("positions")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .eq("status", "open");

    const totalPnl = (positions || []).reduce((sum, p) => sum + (p.pnl || 0), 0);
    const totalPnlPct = portfolio.initial_balance > 0
      ? (totalPnl / portfolio.initial_balance) * 100
      : 0;

    return NextResponse.json({
      portfolio: {
        ...portfolio,
        positions: positions || [],
        totalPnl,
        totalPnlPct: Math.round(totalPnlPct * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio." }, { status: 500 });
  }
}
