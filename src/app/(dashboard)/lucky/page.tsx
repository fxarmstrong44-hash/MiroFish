import LuckyChat from "@/components/lucky/chat";
import { Bot } from "lucide-react";

export default function LuckyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10">
          <Bot className="w-6 h-6 text-[#c9a84c]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Lucky AI</h1>
          <p className="text-xs text-white/40">Emotionless. Precise. Data-driven.</p>
        </div>
      </div>
      <LuckyChat />
    </div>
  );
}
