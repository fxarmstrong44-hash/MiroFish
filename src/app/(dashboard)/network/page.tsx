import { Users, Search } from "lucide-react";

export default function NetworkPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Users className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Strategic Network</h1>
          <p className="text-xs text-white/40">Connect with investors matched by capital, experience, and strategy</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input placeholder="Search by strategy, capital range, sector..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Thabo M.", strategy: "Value Investing", capital: "R1M+", score: 72 },
          { name: "Sarah K.", strategy: "Momentum Trading", capital: "$50K+", score: 65 },
          { name: "James O.", strategy: "Dividend Growth", capital: "R500K+", score: 81 },
        ].map((user, i) => (
          <div key={i} className="glass p-5 hover:border-[#c9a84c]/30 transition cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-sm font-bold text-[#c9a84c]">{user.name[0]}</div>
              <div><div className="font-medium text-white">{user.name}</div><div className="text-xs text-white/40">{user.strategy}</div></div>
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>Capital: {user.capital}</span>
              <span className="text-[#c9a84c]">VWI: {user.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
