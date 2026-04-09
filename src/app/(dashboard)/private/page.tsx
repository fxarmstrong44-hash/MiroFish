import { Crown, Shield, Zap, Globe, Key } from "lucide-react";

export default function PrivateBankingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Luxury header */}
      <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #1a1510 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 50%, #c9a84c33, transparent 50%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#c9a84c]/20 glow-accent"><Crown className="w-8 h-8 text-[#c9a84c]" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gold">Private Banking</h1>
              <p className="text-sm text-white/40">Vaultr Elite \u2014 By Invitation Only</p>
            </div>
          </div>
          <p className="text-white/60 max-w-lg">Exclusive access to concierge AI, custom strategy building, direct API, and white-glove wealth management tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Zap, title: "Concierge AI", desc: "Dedicated Lucky instance with extended context and priority processing" },
          { icon: Key, title: "Direct API Access", desc: "Programmatic access to all Vaultr endpoints for custom integrations" },
          { icon: Shield, title: "Custom Strategies", desc: "Build and backtest your own strategy compositions with the council" },
          { icon: Globe, title: "Exclusive Intelligence", desc: "Institutional-grade research reports and market intelligence briefings" },
        ].map((feature, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05), rgba(255,255,255,0.02))", border: "1px solid rgba(201,168,76,0.15)" }}>
            <feature.icon className="w-6 h-6 text-[#c9a84c] mb-3" />
            <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
            <p className="text-sm text-white/50">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass p-8 text-center border-[#c9a84c]/20">
        <Crown className="w-12 h-12 text-[#c9a84c]/40 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">$10,000/month</h3>
        <p className="text-white/40 mb-4">R169,884/month \u2014 Includes all Vaultr features plus private banking</p>
        <button className="btn-primary">Apply for Access</button>
      </div>
    </div>
  );
}
