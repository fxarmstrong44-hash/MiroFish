import { NextResponse } from "next/server";
import { routeAI, type TaskType } from "@/lib/ai/router";
import { sanitizeString } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = sanitizeString(body.message || "");
    const taskType: TaskType = body.taskType || "general";

    if (!message) {
      return NextResponse.json({ error: "Message required." }, { status: 400 });
    }

    const result = await routeAI(
      [
        { role: "system", content: body.systemPrompt || "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
      taskType,
      { temperature: body.temperature, maxTokens: body.maxTokens }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI router error:", error);
    return NextResponse.json({ error: "AI request failed." }, { status: 500 });
  }
}
