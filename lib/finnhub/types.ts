// ─── Finnhub Raw API Responses ───

/** GET /api/v1/news?category=general */
export interface FinnhubMarketNews {
  category: string
  datetime: number
  headline: string
  id: number
  image: string
  related: string
  source: string
  summary: string
  url: string
}

/** GET /api/v1/company-news?symbol=AAPL&from=...&to=... */
export interface FinnhubCompanyNews {
  category: string
  datetime: number
  headline: string
  id: number
  image: string
  related: string
  source: string
  summary: string
  url: string
}

/** GET /api/v1/quote?symbol=AAPL */
export interface FinnhubQuote {
  c: number   // current price
  d: number   // change
  dp: number  // percent change
  h: number   // high
  l: number   // low
  o: number   // open
  pc: number  // previous close
  t: number   // timestamp
}

/** GET /api/v1/news-sentiment?symbol=AAPL */
export interface FinnhubNewsSentiment {
  buzz: {
    articlesInLastWeek: number
    buzzScore: number
    weeklyAverage: number
  }
  companyNewsScore: number
  sectorAverageBullishPercent: number
  sectorAverageNewsScore: number
  sentiment: {
    bearishPercent: number
    bullishPercent: number
  }
  symbol: string
}

/** GET /api/v1/stock/candle?symbol=AAPL&resolution=60&from=...&to=... */
export interface FinnhubCandle {
  c: number[]  // close prices
  h: number[]  // high prices
  l: number[]  // low prices
  o: number[]  // open prices
  s: string    // status: "ok" | "no_data"
  t: number[]  // timestamps
  v: number[]  // volumes
}

// ─── Normalized App Types ───

export type SentimentType = "bullish" | "bearish" | "neutral"
export type CategoryType = "all" | "technology" | "finance" | "energy" | "healthcare" | "breaking"

export interface NewsItem {
  id: string
  ticker: string
  companyName: string
  title: string
  summary: string
  source: string
  time: string
  url: string
  imageUrl: string
  sentiment: SentimentType
  sentimentScore: number
  priceChange: number
  currentPrice: number
  sparklineData: number[]
  category: CategoryType
}

export interface TickerItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface NewsFeedResponse {
  news: NewsItem[]
  tickers: TickerItem[]
  isLive: boolean
  lastUpdated: string
}
