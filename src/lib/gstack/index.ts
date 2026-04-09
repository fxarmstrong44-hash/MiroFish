/**
 * Vaultr GStack Integration
 * Google Cloud services for enhanced platform capabilities.
 * - Cloud Functions: serverless market data processing
 * - Firestore: real-time portfolio sync across devices
 * - Cloud Run: containerized AI model serving
 * - BigQuery: analytics and reporting
 * - Cloud Storage: document vault backup
 * - Pub/Sub: event-driven alert pipeline
 * - Secret Manager: secure credential storage
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

// --------------- Cloud Functions ---------------

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
    headers: {
      "Content-Type": "application/json",
      ...(config.credentials ? { Authorization: `Bearer ${config.credentials}` } : {}),
    },
    body: JSON.stringify(job),
  });

  if (!res.ok) throw new Error(`GStack function error: ${res.status}`);
  return res.json();
}

// --------------- Firestore (Real-time Sync) ---------------

export interface SyncState {
  userId: string;
  portfolioId: string;
  positions: unknown[];
  lastSync: string;
}

export async function syncPortfolioToFirestore(state: SyncState): Promise<void> {
  const config = getConfig();
  const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/portfolios/${state.userId}`;

  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        portfolioId: { stringValue: state.portfolioId },
        positions: { stringValue: JSON.stringify(state.positions) },
        lastSync: { timestampValue: state.lastSync },
      },
    }),
  });
}

// --------------- BigQuery (Analytics) ---------------

export interface AnalyticsEvent {
  userId: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

export async function pushAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  const config = getConfig();
  const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${config.projectId}/datasets/vaultr_analytics/tables/events/insertAll`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rows: [{ json: event }],
    }),
  });
}

// --------------- Cloud Storage (Vault Backup) ---------------

export async function uploadToVault(
  userId: string,
  fileName: string,
  content: string | Buffer
): Promise<string> {
  const config = getConfig();
  const bucket = `${config.projectId}-vaultr-documents`;
  const objectPath = `${userId}/${fileName}`;
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: content,
  });

  if (!res.ok) throw new Error(`Cloud Storage upload failed: ${res.status}`);
  const data = await res.json();
  return data.mediaLink;
}

// --------------- Pub/Sub (Alert Pipeline) ---------------

export interface AlertMessage {
  userId: string;
  alertType: "price" | "opportunity" | "news" | "trade";
  symbol?: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

export async function publishAlert(alert: AlertMessage): Promise<string> {
  const config = getConfig();
  const topic = "vaultr-alerts";
  const url = `https://pubsub.googleapis.com/v1/projects/${config.projectId}/topics/${topic}:publish`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          data: Buffer.from(JSON.stringify(alert)).toString("base64"),
          attributes: {
            userId: alert.userId,
            alertType: alert.alertType,
            severity: alert.severity,
          },
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Pub/Sub publish failed: ${res.status}`);
  const data = await res.json();
  return data.messageIds?.[0] || "";
}

// --------------- Secret Manager ---------------

export async function getSecret(secretName: string): Promise<string> {
  const config = getConfig();
  const url = `https://secretmanager.googleapis.com/v1/projects/${config.projectId}/secrets/${secretName}/versions/latest:access`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Secret Manager access failed: ${res.status}`);
  const data = await res.json();
  return Buffer.from(data.payload.data, "base64").toString("utf8");
}

// --------------- Health Check ---------------

export async function checkGStackHealth(): Promise<{
  status: "healthy" | "degraded" | "down";
  services: Record<string, boolean>;
}> {
  const config = getConfig();
  const services: Record<string, boolean> = {};

  // Check if project ID is configured
  services.configured = !!config.projectId;

  // Check Cloud Functions
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
