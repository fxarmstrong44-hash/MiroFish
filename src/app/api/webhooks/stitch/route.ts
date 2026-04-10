import { NextResponse } from "next/server";
import { verifyStitchWebhook, parseStitchEvent, getTierFromAmount } from "@/lib/payments/stitch";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-stitch-signature") || "";

    if (!verifyStitchWebhook(body, signature)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = parseStitchEvent(body);
    const supabase = createAdminClient();

    if (event.type === "payment.completed") {
      const userId = event.data.externalReference;
      const amountZAR = parseFloat(event.data.amount.quantity);
      const tier = getTierFromAmount(amountZAR);

      if (userId) {
        await supabase
          .from("payments")
          .insert({
            user_id: userId,
            amount: amountZAR,
            currency: "ZAR",
            provider: "stitch",
            provider_payment_id: event.data.paymentRequestId,
            status: "completed",
          });

        // Update subscription with resolved tier
        await supabase
          .from("subscriptions")
          .update({
            tier: tier || undefined,
            stitch_payment_id: event.data.paymentRequestId,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    } else if (event.type === "payment.failed") {
      const userId = event.data.externalReference;
      if (userId) {
        await supabase.from("payments").insert({
          user_id: userId,
          amount: parseFloat(event.data.amount.quantity),
          currency: "ZAR",
          provider: "stitch",
          provider_payment_id: event.data.paymentRequestId,
          status: "failed",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stitch webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
