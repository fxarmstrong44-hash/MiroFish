import { NextResponse } from "next/server";

export async function GET() {
  // In production: check all active alerts against current prices
  // Trigger notifications via Supabase Realtime + Resend email
  return NextResponse.json({
    checked: 0,
    triggered: 0,
    timestamp: new Date().toISOString(),
  });
}
