import { NextResponse } from "next/server";
import { createStitchPayment } from "@/lib/payments/stitch";
import { TIERS } from "@/lib/payments/tiers";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tier = sanitizeString(body.tier || "");
    const userId = sanitizeString(body.userId || "");

    const tierConfig = TIERS[tier];
    if (!tierConfig || tierConfig.priceZAR <= 0) {
      return NextResponse.json({ error: "Invalid tier for ZAR payment." }, { status: 400 });
    }

    const result = await createStitchPayment({
      amount: tierConfig.priceZAR * 100, // cents
      currency: "ZAR",
      reference: `vaultr-${tier}-${Date.now()}`,
      userId,
      tier,
    });

    if (result.status === "failed") {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ paymentUrl: result.paymentUrl, id: result.id });
  } catch (error) {
    console.error("Stitch payment error:", error);
    return NextResponse.json({ error: "ZAR payment setup failed." }, { status: 500 });
  }
}
