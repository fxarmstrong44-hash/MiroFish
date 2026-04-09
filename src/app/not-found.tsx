import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-[#c9a84c]" />
        </div>
        <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
        <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-sm text-white/40 mb-8">
          This route doesn&apos;t exist in the Vaultr universe. The AI council has no data on this path.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
            Go to Dashboard
          </Link>
          <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
