import { NextResponse } from "next/server";
import { verifyStitchWebhook } from "@/lib/payments/stitch";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-stitch-signature") || "";

    if (!verifyStitchWebhook(body, signature)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createAdminClient();

    if (event.type === "payment.completed") {
      const userId = event.data?.externalReference;
      if (userId) {
        await supabase
          .from("payments")
          .insert({
            user_id: userId,
            amount: event.data.amount?.quantity || 0,
            currency: "ZAR",
            provider: "stitch",
            provider_payment_id: event.data.id,
            status: "completed",
          });

        // Update subscription
        await supabase
          .from("subscriptions")
          .update({
            stitch_payment_id: event.data.id,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stitch webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
