export interface AuditEntry {
  timestamp: string;
  severity: "info" | "warning" | "critical";
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const auditLog: AuditEntry[] = [];

export function logAudit(entry: Omit<AuditEntry, "timestamp">): void {
  auditLog.push({ ...entry, timestamp: new Date().toISOString() });
}

export function getAuditLog(limit = 100): AuditEntry[] {
  return auditLog.slice(-limit);
}

// Check for common security issues
export function runSecurityCheck(): AuditEntry[] {
  const findings: AuditEntry[] = [];

  const envVars = [
    "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "PERPLEXITY_API_KEY",
    "STRIPE_SECRET_KEY", "STITCH_CLIENT_SECRET", "SUPABASE_SERVICE_ROLE_KEY",
  ];

  for (const key of envVars) {
    if (!process.env[key]) {
      findings.push({
        timestamp: new Date().toISOString(),
        severity: "warning",
        category: "config",
        message: `Missing environment variable: ${key}`,
      });
    }
  }

  // Verify no secrets in NEXT_PUBLIC_ vars
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("NEXT_PUBLIC_") && value && value.length > 50) {
      if (key !== "NEXT_PUBLIC_SUPABASE_URL" && key !== "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        findings.push({
          timestamp: new Date().toISOString(),
          severity: "critical",
          category: "secrets",
          message: `Potentially sensitive value exposed in public env var: ${key}`,
        });
      }
    }
  }

  return findings;
}
