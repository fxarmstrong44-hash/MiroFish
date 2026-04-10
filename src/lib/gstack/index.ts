/**
 * Vaultr GStack Integration
 * Google Cloud services for enhanced platform capabilities.
 */

export interface GStackConfig {
  projectId: string;
  region: string;
  credentials?: string;
}

function getConfig(): GStackConfig {
  return {
    projectId: process.env.GCLOUD_PROJECT_ID || "",
    region: process.env.GCLOUD_REGION || "us-central1",
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  };
}

export interface MarketDataJob {
  symbols: string[];
  interval: "1m" | "5m" | "15m" | "1h" | "1d";
  lookback: number;
}

export async function triggerMarketDataFunction(job: MarketDataJob): Promise<{ jobId: string }> {
  const config = getConfig();
  const url = `https://${config.region}-${config.projectId}.cloudfunctions.net/vaultr-market-data`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error(`GStack function error: ${res.status}`);
  return res.json();
}

export interface AlertMessage {
  userId: string;
  alertType: "price" | "opportunity" | "news" | "trade";
  symbol?: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

export async function publishAlert(alert: AlertMessage): Promise<string> {
  const config = getConfig();
  const url = `https://pubsub.googleapis.com/v1/projects/${config.projectId}/topics/vaultr-alerts:publish`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{
        data: Buffer.from(JSON.stringify(alert)).toString("base64"),
        attributes: { userId: alert.userId, alertType: alert.alertType, severity: alert.severity },
      }],
    }),
  });
  if (!res.ok) throw new Error(`Pub/Sub publish failed: ${res.status}`);
  const data = await res.json();
  return data.messageIds?.[0] || "";
}

export async function uploadToVault(userId: string, fileName: string, content: string): Promise<string> {
  const config = getConfig();
  const bucket = `${config.projectId}-vaultr-documents`;
  const objectPath = `${userId}/${fileName}`;
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: content as BodyInit,
  });
  if (!res.ok) throw new Error(`Cloud Storage upload failed: ${res.status}`);
  const data = await res.json();
  return data.mediaLink;
}

export async function checkGStackHealth(): Promise<{
  status: "healthy" | "degraded" | "down";
  services: Record<string, boolean>;
}> {
  const config = getConfig();
  const services: Record<string, boolean> = {};
  services.configured = !!config.projectId;

  try {
    const res = await fetch(
      `https://${config.region}-${config.projectId}.cloudfunctions.net/vaultr-health`,
      { method: "GET", signal: AbortSignal.timeout(5000) }
    );
    services.cloudFunctions = res.ok;
  } catch {
    services.cloudFunctions = false;
  }

  const healthyCount = Object.values(services).filter(Boolean).length;
  const totalCount = Object.keys(services).length;

  return {
    status: healthyCount === totalCount ? "healthy" : healthyCount > 0 ? "degraded" : "down",
    services,
  };
}
