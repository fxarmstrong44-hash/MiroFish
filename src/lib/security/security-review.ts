/**
 * Vaultr Security Review Engine
 * Automated security scanning for the entire application.
 */

export interface SecurityFinding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  description: string;
  location?: string;
  remediation: string;
}

export interface SecurityReport {
  timestamp: string;
  score: number;
  grade: string;
  findings: SecurityFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

const SECRET_PATTERNS = [
  { pattern: /sk[-_]live[-_][a-zA-Z0-9]{20,}/g, name: "Stripe Live Secret Key" },
  { pattern: /sk[-_]test[-_][a-zA-Z0-9]{20,}/g, name: "Stripe Test Secret Key" },
  { pattern: /AIza[0-9A-Za-z\-_]{35}/g, name: "Google API Key" },
  { pattern: /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, name: "JWT Token" },
  { pattern: /AKIA[0-9A-Z]{16}/g, name: "AWS Access Key" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: "GitHub Personal Access Token" },
];

const XSS_PATTERNS = [
  /dangerouslySetInnerHTML/g,
  /innerHTML\s*=/g,
  /document\.write/g,
  /eval\s*\(/g,
];

export function scanForSecrets(code: string, filePath: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  for (const { pattern, name } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(code)) {
      findings.push({
        severity: "critical",
        category: "Hardcoded Secrets",
        title: `${name} detected`,
        description: `A ${name} was found hardcoded in the source code.`,
        location: filePath,
        remediation: "Move to environment variables. Rotate the exposed key immediately.",
      });
    }
  }
  return findings;
}

export function scanForXSS(code: string, filePath: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  for (const pattern of XSS_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(code)) {
      findings.push({
        severity: "high",
        category: "XSS Vulnerability",
        title: "Potential XSS vector detected",
        description: "Unsafe DOM manipulation found that could allow cross-site scripting.",
        location: filePath,
        remediation: "Use React's built-in escaping. Avoid dangerouslySetInnerHTML.",
      });
    }
  }
  return findings;
}

export function checkAuthSecurity(): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      findings.push({
        severity: "high",
        category: "Configuration",
        title: `Missing environment variable: ${envVar}`,
        description: `Required environment variable ${envVar} is not set.`,
        remediation: "Add this variable to your .env.local file.",
      });
    }
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    findings.push({
      severity: "critical",
      category: "Auth Security",
      title: "Service role key exposed to client",
      description: "SUPABASE_SERVICE_ROLE_KEY is prefixed with NEXT_PUBLIC_.",
      remediation: "Remove NEXT_PUBLIC_ prefix. Service role key must only be used server-side.",
    });
  }

  return findings;
}

export function checkCSPHeaders(): SecurityFinding[] {
  return [{
    severity: "info",
    category: "Headers",
    title: "Content Security Policy review",
    description: "Verify CSP headers are set in next.config.ts.",
    remediation: "Add strict CSP: default-src 'self'; script-src 'self' 'unsafe-eval'",
  }];
}

export function checkRateLimiting(): SecurityFinding[] {
  return [{
    severity: "info",
    category: "Rate Limiting",
    title: "Rate limiting configuration",
    description: "Auth: 5 attempts/15 min. API: 60 requests/min. Council: tier-based.",
    remediation: "Verify rate limits are enforced on all public endpoints.",
  }];
}

export function generateSecurityReport(codeFiles: { path: string; content: string }[]): SecurityReport {
  const allFindings: SecurityFinding[] = [];

  for (const file of codeFiles) {
    allFindings.push(...scanForSecrets(file.content, file.path));
    allFindings.push(...scanForXSS(file.content, file.path));
  }

  allFindings.push(...checkAuthSecurity());
  allFindings.push(...checkCSPHeaders());
  allFindings.push(...checkRateLimiting());

  const summary = {
    critical: allFindings.filter((f) => f.severity === "critical").length,
    high: allFindings.filter((f) => f.severity === "high").length,
    medium: allFindings.filter((f) => f.severity === "medium").length,
    low: allFindings.filter((f) => f.severity === "low").length,
    info: allFindings.filter((f) => f.severity === "info").length,
  };

  const deductions = summary.critical * 25 + summary.high * 10 + summary.medium * 5 + summary.low * 2;
  const score = Math.max(0, 100 - deductions);
  const grade =
    score >= 95 ? "A+" : score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  return { timestamp: new Date().toISOString(), score, grade, findings: allFindings, summary };
}
