"use client";

import { useState, useEffect } from "react";

interface Alert {
  id: string;
  type: string;
  symbol: string;
  condition: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  async function addAlert(symbol: string, type: string, condition: Record<string, unknown>) {
    const res = await fetch("/api/market/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, type, condition }),
    });
    const data = await res.json();
    setAlerts((prev) => [...prev, data]);
    return data;
  }

  function removeAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return { alerts, loading, addAlert, removeAlert };
}
