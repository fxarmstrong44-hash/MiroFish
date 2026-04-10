// Stitch Payment Gateway - South Africa
// https://stitch.money

export interface StitchPaymentRequest {
  amount: number; // In cents (ZAR)
  currency: "ZAR";
  reference: string;
  userId: string;
  tier: string;
}

export interface StitchPaymentResult {
  id: string;
  status: "pending" | "completed" | "failed";
  paymentUrl?: string;
  error?: string;
}

async function getStitchAccessToken(): Promise<string> {
  const res = await fetch("https://secure.stitch.money/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.STITCH_CLIENT_ID!,
      client_secret: process.env.STITCH_CLIENT_SECRET!,
      scope: "client_paymentrequest",
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function createStitchPayment(params: StitchPaymentRequest): Promise<StitchPaymentResult> {
  const token = await getStitchAccessToken();

  const mutation = `
    mutation CreatePaymentRequest($input: PaymentRequestInput!) {
      clientPaymentInitiationRequestCreate(input: $input) {
        paymentInitiationRequest {
          id
          url
        }
      }
    }
  `;

  const res = await fetch("https://api.stitch.money/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          amount: { quantity: (params.amount / 100).toFixed(2), currency: "ZAR" },
          payerReference: params.reference,
          beneficiaryReference: `vaultr-${params.tier}`,
          externalReference: params.userId,
        },
      },
    }),
  });

  const data = await res.json();

  if (data.errors) {
    return { id: "", status: "failed", error: data.errors[0]?.message };
  }

  const request = data.data.clientPaymentInitiationRequestCreate.paymentInitiationRequest;
  return {
    id: request.id,
    status: "pending",
    paymentUrl: request.url,
  };
}

export interface StitchWebhookEvent {
  id: string;
  type: "payment.completed" | "payment.failed" | "payment.pending" | "refund.completed";
  data: {
    paymentRequestId: string;
    amount: { quantity: string; currency: string };
    status: string;
    externalReference?: string;
    payer?: { bankId: string; accountNumber: string; name: string };
  };
  createdAt: string;
}

export function verifyStitchWebhook(body: string, signature: string): boolean {
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", process.env.STITCH_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function parseStitchEvent(payload: string): StitchWebhookEvent {
  return JSON.parse(payload) as StitchWebhookEvent;
}

export function getTierFromAmount(amountZAR: number): string | null {
  const tiers: Record<string, number> = {
    starter: 493,
    pro: 1683,
    elite: 5084,
    secret: 169884,
  };

  for (const [tier, price] of Object.entries(tiers)) {
    if (Math.abs(amountZAR - price) < 1) return tier;
  }
  return null;
}
