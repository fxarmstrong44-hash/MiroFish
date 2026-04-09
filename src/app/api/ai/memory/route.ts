import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserMemory, storeMemory, pruneExpiredMemories } from "@/lib/ai/memory";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memory = await getUserMemory(user.id);
  return NextResponse.json({ memory });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, key, value, importance, metadata, ttlDays } = body;

  if (!type || !key || !value) {
    return NextResponse.json({ error: "Missing required fields: type, key, value" }, { status: 400 });
  }

  const entry = await storeMemory(user.id, type, key, value, importance, metadata, ttlDays);
  return NextResponse.json({ entry });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pruned = await pruneExpiredMemories(user.id);
  return NextResponse.json({ pruned });
}
