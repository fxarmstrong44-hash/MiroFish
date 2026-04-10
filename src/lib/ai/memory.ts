/**
 * Vaultr Claude Memory System
 * Persistent context management for Lucky AI conversations.
 */

import { createClient } from "@/lib/supabase/server";

export interface MemoryEntry {
  id: string;
  user_id: string;
  type: "preference" | "analysis" | "trade" | "insight" | "context";
  key: string;
  value: string;
  metadata?: Record<string, unknown>;
  importance: number;
  created_at: string;
  expires_at?: string;
}

export interface UserMemory {
  preferences: MemoryEntry[];
  recentAnalyses: MemoryEntry[];
  tradingPatterns: MemoryEntry[];
  insights: MemoryEntry[];
  contextWindow: MemoryEntry[];
}

const MAX_CONTEXT_ENTRIES = 50;
const MAX_PREFERENCE_ENTRIES = 20;

export async function storeMemory(
  userId: string,
  type: MemoryEntry["type"],
  key: string,
  value: string,
  importance: number = 5,
  metadata?: Record<string, unknown>,
  ttlDays?: number
): Promise<MemoryEntry | null> {
  const supabase = await createClient();
  const entry = {
    id: `${userId}:${type}:${key}`,
    user_id: userId,
    type,
    key,
    value,
    importance: Math.min(10, Math.max(1, importance)),
    metadata: metadata || {},
    created_at: new Date().toISOString(),
    expires_at: ttlDays ? new Date(Date.now() + ttlDays * 86400000).toISOString() : null,
  };

  const { data, error } = await supabase
    .from("user_memory")
    .upsert(entry, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Memory store error:", error.message);
    return null;
  }
  return data;
}

export async function getUserMemory(userId: string): Promise<UserMemory> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: entries } = await supabase
    .from("user_memory")
    .select("*")
    .eq("user_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("importance", { ascending: false })
    .limit(100);

  const memories = (entries || []) as MemoryEntry[];

  return {
    preferences: memories.filter((m) => m.type === "preference").slice(0, MAX_PREFERENCE_ENTRIES),
    recentAnalyses: memories.filter((m) => m.type === "analysis").slice(0, 10),
    tradingPatterns: memories.filter((m) => m.type === "trade").slice(0, 10),
    insights: memories.filter((m) => m.type === "insight").slice(0, 10),
    contextWindow: memories.filter((m) => m.type === "context").slice(0, MAX_CONTEXT_ENTRIES),
  };
}

export function buildMemoryContext(memory: UserMemory): string {
  const sections: string[] = [];

  if (memory.preferences.length > 0) {
    sections.push(
      "USER PREFERENCES:\n" +
        memory.preferences.map((p) => `- ${p.key}: ${p.value}`).join("\n")
    );
  }

  if (memory.recentAnalyses.length > 0) {
    sections.push(
      "RECENT ANALYSES:\n" +
        memory.recentAnalyses.map((a) => `- ${a.key}: ${a.value}`).join("\n")
    );
  }

  if (memory.tradingPatterns.length > 0) {
    sections.push(
      "TRADING PATTERNS:\n" +
        memory.tradingPatterns.map((t) => `- ${t.key}: ${t.value}`).join("\n")
    );
  }

  if (memory.insights.length > 0) {
    sections.push(
      "KEY INSIGHTS:\n" +
        memory.insights.map((i) => `- ${i.key}: ${i.value}`).join("\n")
    );
  }

  return sections.join("\n\n");
}

export async function extractAndStoreMemories(
  userId: string,
  userMessage: string,
  aiResponse: string
): Promise<void> {
  const symbolPattern = /\b([A-Z]{2,5})\b/g;
  const excluded = new Set(["AI", "SA", "OR", "AN", "IF", "IT", "IS", "IN", "ON", "TO", "OF", "AT", "BY", "DO", "NO", "SO", "UP", "WE", "AM", "AS", "BE", "HE", "ME", "US", "THE", "AND", "FOR", "NOT", "BUT", "ALL", "CAN", "HER", "WAS", "ONE", "OUR"]);
  const symbols = [...new Set(userMessage.match(symbolPattern) || [])].filter((s) => !excluded.has(s));

  for (const symbol of symbols.slice(0, 3)) {
    await storeMemory(userId, "context", `mentioned:${symbol}`, `User asked about ${symbol}`, 3, undefined, 30);
  }

  const riskKeywords: Record<string, string[]> = {
    conservative: ["safe", "conservative", "low risk", "capital preservation"],
    moderate: ["balanced", "moderate", "steady growth"],
    aggressive: ["aggressive", "high risk", "maximum growth"],
  };

  const lowerMessage = userMessage.toLowerCase();
  for (const [level, keywords] of Object.entries(riskKeywords)) {
    if (keywords.some((k) => lowerMessage.includes(k))) {
      await storeMemory(userId, "preference", "risk_preference", level, 8);
      break;
    }
  }

  if (aiResponse.length > 200) {
    const summary = aiResponse.slice(0, 200).replace(/\n/g, " ");
    await storeMemory(userId, "analysis", `analysis:${Date.now()}`, summary, 4, undefined, 14);
  }
}

export async function pruneExpiredMemories(userId: string): Promise<number> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("user_memory")
    .delete()
    .eq("user_id", userId)
    .lt("expires_at", now)
    .select("id");

  return data?.length || 0;
}
