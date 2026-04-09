import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    alerts: [],
    message: "No active alerts. Configure alerts in the dashboard.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, type, condition } = body;

    if (!symbol || !type) {
      return NextResponse.json({ error: "Symbol and type required." }, { status: 400 });
    }

    // In production, save to Supabase
    return NextResponse.json({
      id: crypto.randomUUID(),
      symbol,
      type,
      condition,
      is_active: true,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Alert creation error:", error);
    return NextResponse.json({ error: "Failed to create alert." }, { status: 500 });
  }
}
