"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

export default function DashboardHeader({ userName }: { userName?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {searchOpen ? (
          <input
            type="text"
            placeholder="Search assets, features..."
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50 w-72"
            autoFocus
            onBlur={() => setSearchOpen(false)}
          />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="text-white/40 hover:text-white transition"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-white/40 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c9a84c] rounded-full" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
            <User className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <span className="text-white/70 hidden sm:block">{userName || "Trader"}</span>
        </div>
      </div>
    </header>
  );
}
