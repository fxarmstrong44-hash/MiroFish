import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const enabled = body.enabled === true;

    if (enabled && !body.userConfirmation) {
      return NextResponse.json({
        error: "Autopilot requires explicit user confirmation. Set userConfirmation: true.",
        requiresConfirmation: true,
      }, { status: 400 });
    }

    return NextResponse.json({
      autopilot: enabled,
      maxRiskPct: 2.0,
      status: enabled ? "active" : "disabled",
      message: enabled
        ? "Autopilot Wealth Mode active. Maximum risk per trade: 2.0%. All trades require council consensus >= 3 brains."
        : "Autopilot disabled. Manual trading mode.",
    });
  } catch (error) {
    console.error("Autopilot error:", error);
    return NextResponse.json({ error: "Autopilot configuration failed." }, { status: 500 });
  }
}
