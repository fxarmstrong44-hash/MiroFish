import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch active alerts
    const { data: alerts, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    let triggered = 0;

    for (const alert of alerts || []) {
      // In production: compare alert.condition against live market data
      // If condition met, trigger notification and mark alert
      const conditionMet = false; // Placeholder - check real prices

      if (conditionMet) {
        await supabase
          .from("alerts")
          .update({ triggered_at: new Date().toISOString(), is_active: false })
          .eq("id", alert.id);

        await supabase.from("notifications").insert({
          user_id: alert.user_id,
          title: `Alert triggered: ${alert.symbol || "Portfolio"}`,
          body: `Your ${alert.type} alert has been triggered.`,
          type: alert.type,
        });

        triggered++;
      }
    }

    return NextResponse.json({
      checked: alerts?.length || 0,
      triggered,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Alert cron error:", error);
    return NextResponse.json({ error: "Alert check failed." }, { status: 500 });
  }
}
