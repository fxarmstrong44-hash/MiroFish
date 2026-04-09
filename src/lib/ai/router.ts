import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type AIProvider = "openai" | "claude" | "perplexity";
export type TaskType = "financial_analysis" | "reasoning" | "realtime_data" | "general";

const providerMap: Record<TaskType, AIProvider> = {
  financial_analysis: "openai",
  reasoning: "claude",
  realtime_data: "perplexity",
  general: "claude",
};

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "missing" });
}
function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "missing" });
}
function getPerplexity() {
  return new OpenAI({ apiKey: process.env.PERPLEXITY_API_KEY || "missing", baseURL: "https://api.perplexity.ai" });
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  usage?: { inputTokens: number; outputTokens: number };
}

export async function routeAI(
  messages: AIMessage[],
  taskType: TaskType = "general",
  options?: { temperature?: number; maxTokens?: number }
): Promise<AIResponse> {
  const provider = providerMap[taskType];
  const temp = options?.temperature ?? 0.3;
  const maxTokens = options?.maxTokens ?? 2048;

  switch (provider) {
    case "openai": {
      const res = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        messages,
        temperature: temp,
        max_tokens: maxTokens,
      });
      return {
        content: res.choices[0].message.content ?? "",
        provider: "openai",
        model: "gpt-4o",
        usage: {
          inputTokens: res.usage?.prompt_tokens ?? 0,
          outputTokens: res.usage?.completion_tokens ?? 0,
        },
      };
    }
    case "claude": {
      const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
      const userMsgs = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      const res = await getAnthropic().messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system: systemMsg,
        messages: userMsgs,
      });
      const textBlock = res.content.find((b) => b.type === "text");
      return {
        content: textBlock ? textBlock.text : "",
        provider: "claude",
        model: "claude-sonnet-4-20250514",
        usage: {
          inputTokens: res.usage.input_tokens,
          outputTokens: res.usage.output_tokens,
        },
      };
    }
    case "perplexity": {
      const res = await getPerplexity().chat.completions.create({
        model: "llama-3.1-sonar-large-128k-online",
        messages,
        temperature: temp,
        max_tokens: maxTokens,
      });
      return {
        content: res.choices[0].message.content ?? "",
        provider: "perplexity",
        model: "llama-3.1-sonar-large-128k-online",
        usage: {
          inputTokens: res.usage?.prompt_tokens ?? 0,
          outputTokens: res.usage?.completion_tokens ?? 0,
        },
      };
    }
  }
}
