import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAuthSecurity, checkCSPHeaders, checkRateLimiting, type SecurityReport } from "@/lib/security/security-review";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run security checks (non-file-based checks only for runtime)
  const findings = [
    ...checkAuthSecurity(),
    ...checkCSPHeaders(),
    ...checkRateLimiting(),
  ];

  const summary = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    info: findings.filter((f) => f.severity === "info").length,
  };

  const deductions = summary.critical * 25 + summary.high * 10 + summary.medium * 5 + summary.low * 2;
  const score = Math.max(0, 100 - deductions);
  const grade =
    score >= 95 ? "A+" : score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  const report: SecurityReport = {
    timestamp: new Date().toISOString(),
    score,
    grade,
    findings,
    summary,
  };

  return NextResponse.json({ report });
}
