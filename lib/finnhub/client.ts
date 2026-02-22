import type {
  FinnhubMarketNews,
  FinnhubQuote,
  FinnhubNewsSentiment,
  FinnhubCandle,
  FinnhubCompanyNews,
} from "./types"

const FINNHUB_BASE = "https://finnhub.io/api/v1"

function getApiKey(): string | null {
  return process.env.FINNHUB_API_KEY ?? null
}

async function finnhubFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = getApiKey()
  if (!key) throw new Error("FINNHUB_API_KEY not configured")

  const url = new URL(`${FINNHUB_BASE}${path}`)
  url.searchParams.set("token", key)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export async function getMarketNews(category = "general"): Promise<FinnhubMarketNews[]> {
  return finnhubFetch<FinnhubMarketNews[]>("/news", { category })
}

export async function getCompanyNews(
  symbol: string,
  from: string,
  to: string
): Promise<FinnhubCompanyNews[]> {
  return finnhubFetch<FinnhubCompanyNews[]>("/company-news", { symbol, from, to })
}

export async function getQuote(symbol: string): Promise<FinnhubQuote> {
  return finnhubFetch<FinnhubQuote>("/quote", { symbol })
}

export async function getNewsSentiment(symbol: string): Promise<FinnhubNewsSentiment> {
  return finnhubFetch<FinnhubNewsSentiment>("/news-sentiment", { symbol })
}

export async function getStockCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<FinnhubCandle> {
  return finnhubFetch<FinnhubCandle>("/stock/candle", {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
  })
}

export function isApiConfigured(): boolean {
  return !!getApiKey()
}
