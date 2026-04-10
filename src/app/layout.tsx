import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Vaultr — AI Wealth Intelligence",
  description: "Institutional-grade AI trading intelligence. 18-brain council, real-time market analysis, and automated wealth building.",
  keywords: ["AI trading", "wealth management", "investment", "portfolio", "South Africa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#f0f0f5]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
