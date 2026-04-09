import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/payments/stripe";
import { TIERS } from "@/lib/payments/tiers";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tier = sanitizeString(body.tier || "");
    const email = sanitizeString(body.email || "");
    const userId = sanitizeString(body.userId || "");

    const tierConfig = TIERS[tier];
    if (!tierConfig || !tierConfig.stripePriceId) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const session = await createCheckoutSession({
      userId,
      email,
      priceId: tierConfig.stripePriceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?payment=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?payment=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Payment setup failed." }, { status: 500 });
  }
}
