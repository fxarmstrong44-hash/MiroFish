import { NextResponse } from "next/server";
import { askLucky } from "@/lib/ai/lucky";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = sanitizeString(body.message || "");
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    if (!message) {
      return NextResponse.json({ error: "Message required." }, { status: 400 });
    }

    const result = await askLucky(message, history, {
      tier: body.tier || "free",
      portfolio: body.portfolio,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lucky AI error:", error);
    return NextResponse.json(
      { response: "Analysis temporarily unavailable. Retry.", provider: "error", model: "none" },
      { status: 500 }
    );
  }
}
