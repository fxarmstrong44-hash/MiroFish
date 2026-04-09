import { NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature." }, { status: 400 });
    }

    const event = constructWebhookEvent(body, signature);
    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { metadata?: { user_id?: string }; subscription?: string };
        const userId = session.metadata?.user_id;
        if (userId) {
          await supabase
            .from("subscriptions")
            .update({
              stripe_subscription_id: session.subscription,
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as { id?: string };
        await supabase
          .from("subscriptions")
          .update({ status: "canceled", tier: "free", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
