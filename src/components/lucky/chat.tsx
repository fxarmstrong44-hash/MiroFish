"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import Suggestion from "./suggestion";

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

export default function LuckyChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Vaultr AI active. State your query \u2014 asset symbol, market question, or analysis request. Precision responses only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/lucky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "Analysis unavailable.", provider: data.provider },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Retry query." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 1 && !loading && (
          <Suggestion onSelect={(s) => { setInput(s); }} />
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#c9a84c]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-white"
                  : "glass text-white/90"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.provider && (
                <div className="text-[10px] text-white/30 mt-2">via {msg.provider}</div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white/60" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[#c9a84c] animate-spin" />
            </div>
            <div className="glass px-4 py-3 text-sm text-white/50">Analyzing...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 pt-4 border-t border-white/5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Lucky anything \u2014 AAPL analysis, BTC outlook, portfolio review..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50 transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary px-4 disabled:opacity-30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
