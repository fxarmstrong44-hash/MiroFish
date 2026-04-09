import { Bot, User } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  timestamp?: Date;
}

export default function Message({ role, content, provider, timestamp }: MessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-[#c9a84c]" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === "user"
            ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-white"
            : "glass text-white/90"
        }`}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        <div className="flex items-center gap-2 mt-1.5">
          {provider && <span className="text-[10px] text-white/25">via {provider}</span>}
          {timestamp && (
            <span className="text-[10px] text-white/20">
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>
      {role === "user" && (
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white/60" />
        </div>
      )}
    </div>
  );
}
