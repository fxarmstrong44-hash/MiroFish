import { Building2, FileText, Target, BarChart3, Users } from "lucide-react";

const tools = [
  { icon: FileText, title: "Business Plan Generator", desc: "AI-powered business plan with financial projections", status: "Ready" },
  { icon: Target, title: "Market Validation", desc: "Validate your business idea with market data and competition analysis", status: "Ready" },
  { icon: BarChart3, title: "Financial Modeling", desc: "Revenue projections, break-even analysis, and funding requirements", status: "Ready" },
  { icon: Users, title: "Team Builder", desc: "Role definitions, compensation benchmarks, and hiring roadmap", status: "Coming Soon" },
];

export default function BusinessPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#c9a84c]/10"><Building2 className="w-6 h-6 text-[#c9a84c]" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Business Builder Engine</h1>
          <p className="text-xs text-white/40">Build, validate, and scale your business ventures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool, i) => (
          <div key={i} className="glass p-6 hover:border-[#c9a84c]/30 transition cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#c9a84c]/10"><tool.icon className="w-5 h-5 text-[#c9a84c]" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{tool.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${tool.status === "Ready" ? "bg-emerald-400/10 text-emerald-400" : "bg-white/10 text-white/40"}`}>{tool.status}</span>
                </div>
                <p className="text-sm text-white/50 mt-1">{tool.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
