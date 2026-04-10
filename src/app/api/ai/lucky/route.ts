import { NextResponse } from "next/server";
import { askLucky } from "@/lib/ai/lucky";
import { sanitizeString } from "@/lib/security/sanitize";
import { createClient } from "@/lib/supabase/server";
import { getUserMemory, buildMemoryContext, extractAndStoreMemories } from "@/lib/ai/memory";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = sanitizeString(body.message || "");
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    if (!message) {
      return NextResponse.json({ error: "Message required." }, { status: 400 });
    }

    // Load user memory for personalization
    let memoryContext = "";
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        const memory = await getUserMemory(user.id);
        memoryContext = buildMemoryContext(memory);
      }
    } catch {
      // Continue without memory if auth fails
    }

    const result = await askLucky(message, history, {
      tier: body.tier || "free",
      portfolio: body.portfolio,
      memoryContext,
    });

    // Store memories from this exchange
    if (userId && result.response) {
      extractAndStoreMemories(userId, message, result.response).catch(() => {});
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lucky AI error:", error);
    return NextResponse.json(
      { response: "Analysis temporarily unavailable. Retry.", provider: "error", model: "none" },
      { status: 500 }
    );
  }
}
