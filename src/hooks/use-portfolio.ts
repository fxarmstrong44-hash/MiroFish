"use client";

import { useState, useEffect } from "react";

interface Portfolio {
  id: string;
  name: string;
  is_simulated: boolean;
  virtual_balance: number;
  initial_balance: number;
  positions: unknown[];
  totalPnl: number;
  totalPnlPct: number;
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => setPortfolio(data.portfolio))
      .catch(() => setPortfolio(null))
      .finally(() => setLoading(false));
  }, []);

  return { portfolio, loading };
}
