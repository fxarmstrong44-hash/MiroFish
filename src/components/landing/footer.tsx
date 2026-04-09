import { Sparkles } from "lucide-react";
import Link from "next/link";

const LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "AI Council", href: "/council" },
    { label: "Paper Trading", href: "/simulator" },
  ],
  Tools: [
    { label: "Tax Optimizer", href: "/tax" },
    { label: "Lucky AI", href: "/lucky" },
    { label: "Market Scanner", href: "/market" },
    { label: "Wealth Expansion", href: "/wealth" },
  ],
  Company: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Settings", href: "/settings" },
    { label: "Private Banking", href: "/private" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#c9a84c]" />
              <span className="text-lg font-bold text-gold">Vaultr</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">
              AI-powered wealth intelligence. 18 brains. Zero emotion. Built for South African investors.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">{heading}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/30 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Vaultr. All rights reserved. Not financial advice.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/20">
            <span>South Africa</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
