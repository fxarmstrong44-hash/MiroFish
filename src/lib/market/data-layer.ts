export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export interface HistoricalBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Alpha Vantage
async function fetchAlphaVantage(symbol: string): Promise<MarketQuote | null> {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await res.json();
    const q = data["Global Quote"];
    if (!q) return null;
    return {
      symbol,
      price: parseFloat(q["05. price"]),
      change: parseFloat(q["09. change"]),
      changePct: parseFloat(q["10. change percent"]?.replace("%", "")),
      volume: parseInt(q["06. volume"]),
      high: parseFloat(q["03. high"]),
      low: parseFloat(q["04. low"]),
      open: parseFloat(q["02. open"]),
      previousClose: parseFloat(q["08. previous close"]),
      timestamp: q["07. latest trading day"],
    };
  } catch {
    return null;
  }
}

// Binance (crypto)
async function fetchBinance(symbol: string): Promise<MarketQuote | null> {
  try {
    const pair = symbol.replace("/", "").toUpperCase();
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
    const data = await res.json();
    return {
      symbol,
      price: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChange),
      changePct: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      open: parseFloat(data.openPrice),
      previousClose: parseFloat(data.prevClosePrice),
      timestamp: new Date(data.closeTime).toISOString(),
    };
  } catch {
    return null;
  }
}

// Yahoo Finance (fallback)
async function fetchYahoo(symbol: string): Promise<MarketQuote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
    );
    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    return {
      symbol,
      price: meta.regularMarketPrice,
      change: meta.regularMarketPrice - meta.chartPreviousClose,
      changePct: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
      volume: meta.regularMarketVolume || 0,
      high: meta.regularMarketDayHigh || meta.regularMarketPrice,
      low: meta.regularMarketDayLow || meta.regularMarketPrice,
      open: meta.regularMarketOpen || meta.regularMarketPrice,
      previousClose: meta.chartPreviousClose,
      timestamp: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export type AssetType = "stock" | "crypto" | "forex";

function detectAssetType(symbol: string): AssetType {
  if (symbol.includes("/") || symbol.endsWith("USDT") || symbol.endsWith("BTC")) return "crypto";
  if (symbol.includes("=X") || ["EURUSD", "GBPUSD", "USDZAR"].some((p) => symbol.includes(p))) return "forex";
  return "stock";
}

export async function getQuote(symbol: string): Promise<MarketQuote | null> {
  const type = detectAssetType(symbol);

  if (type === "crypto") {
    return (await fetchBinance(symbol)) || (await fetchYahoo(symbol));
  }

  return (await fetchAlphaVantage(symbol)) || (await fetchYahoo(symbol));
}

export async function getMultipleQuotes(symbols: string[]): Promise<MarketQuote[]> {
  const results = await Promise.allSettled(symbols.map(getQuote));
  return results
    .filter((r): r is PromiseFulfilledResult<MarketQuote | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((q): q is MarketQuote => q !== null);
}
