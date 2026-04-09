import { Handshake, Plus } from "lucide-react";

export default function DealsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Handshake className="w-6 h-6 text-[#c9a84c]" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Deal Marketplace</h1>
            <p className="text-xs text-white/40">Browse and post investment opportunities</p>
          </div>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Post Deal</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "SA Real Estate Fund", category: "Property", minCapital: "R500,000", returns: "12-18% p.a." },
          { title: "Tech Startup Pre-Seed", category: "Venture", minCapital: "$25,000", returns: "10-50x potential" },
          { title: "Mining Equipment Lease", category: "Resources", minCapital: "R200,000", returns: "15% p.a." },
        ].map((deal, i) => (
          <div key={i} className="glass p-5 hover:border-[#c9a84c]/30 transition cursor-pointer">
            <div className="text-xs text-[#c9a84c] font-medium mb-1">{deal.category}</div>
            <h3 className="font-semibold text-white mb-2">{deal.title}</h3>
            <div className="flex justify-between text-xs text-white/40">
              <span>Min: {deal.minCapital}</span>
              <span className="text-emerald-400">{deal.returns}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
