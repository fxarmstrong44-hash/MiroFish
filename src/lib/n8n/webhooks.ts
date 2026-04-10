/**
 * n8n Workflow Integration
 * Triggers n8n automation workflows for market alerts, portfolio sync, and council analysis.
 */

const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL || "";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

interface N8nTriggerResult {
  success: boolean;
  executionId?: string;
  error?: string;
}

async function triggerWorkflow(path: string, payload: Record<string, unknown>): Promise<N8nTriggerResult> {
  if (!N8N_BASE_URL) {
    return { success: false, error: "N8N_WEBHOOK_URL not configured" };
  }

  try {
    const res = await fetch(`${N8N_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(N8N_API_KEY ? { "X-N8N-API-KEY": N8N_API_KEY } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { success: false, error: `n8n returned ${res.status}` };
    }

    const data = await res.json();
    return { success: true, executionId: data.executionId };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function triggerMarketAlertScan(symbols: string[]): Promise<N8nTriggerResult> {
  return triggerWorkflow("/webhook/vaultr-market-alerts", {
    action: "scan",
    symbols,
    timestamp: new Date().toISOString(),
  });
}

export async function triggerPortfolioSync(userId: string, portfolioId: string): Promise<N8nTriggerResult> {
  return triggerWorkflow("/webhook/vaultr-portfolio-sync", {
    action: "sync",
    userId,
    portfolioId,
    timestamp: new Date().toISOString(),
  });
}

export async function triggerCouncilAnalysis(
  userId: string,
  symbol: string,
  assetType: string
): Promise<N8nTriggerResult> {
  return triggerWorkflow("/webhook/vaultr-council-analysis", {
    action: "analyze",
    userId,
    symbol,
    assetType,
    timestamp: new Date().toISOString(),
  });
}

export function isN8nConfigured(): boolean {
  return !!N8N_BASE_URL;
}
