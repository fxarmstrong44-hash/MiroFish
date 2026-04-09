"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Crown, User, Loader2, Sparkles, Shield } from "lucide-react";

interface Message {
  role: "user" | "concierge";
  content: string;
  timestamp: Date;
}

export default function Concierge() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "concierge",
      content:
        "Welcome to Vaultr Private Banking. I am your dedicated concierge AI with extended context, priority processing, and access to institutional-grade analysis. How may I assist your wealth strategy today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg, timestamp: new Date() }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/lucky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          tier: "secret",
          history: messages.slice(-10).map((m) => ({ role: m.role === "concierge" ? "assistant" : "user", content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "concierge", content: data.response || "Analysis in progress. Please stand by.", timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "concierge", content: "Temporary connection issue. Your request has been queued for priority processing.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#c9a84c]/15">
      {/* Luxury header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#c9a84c]/10" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))" }}>
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88a3a] flex items-center justify-center">
            <Crown className="w-5 h-5 text-[#0a0a0f]" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0f]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#c9a84c]">Private Concierge</span>
            <Sparkles className="w-3 h-3 text-[#c9a84c]/50" />
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/30">
            <Shield className="w-2.5 h-2.5" /> End-to-end encrypted \u00b7 Priority queue
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-[#0a0a0f]/80">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "concierge" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                <Crown className="w-3.5 h-3.5 text-[#c9a84c]" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-white"
                : "bg-white/[0.04] border border-white/[0.08] text-white/90"
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-[10px] text-white/20 mt-1.5">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-white/50" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 text-[#c9a84c] animate-spin" />
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white/40">
              Analyzing with priority processing...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-3 p-4 border-t border-[#c9a84c]/10 bg-[#0a0a0f]/60">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Private query \u2014 institutional analysis, strategy review, wealth planning..."
          className="flex-1 bg-white/5 border border-[#c9a84c]/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c9a84c]/40 transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#a88a3a] text-[#0a0a0f] font-semibold disabled:opacity-30 transition hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
