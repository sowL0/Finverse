import { NextResponse } from "next/server"
import {
  getMarketNews,
  getQuote,
  getNewsSentiment,
  getStockCandles,
  isApiConfigured,
} from "@/lib/finnhub/client"
import type { NewsItem, SentimentType, CategoryType } from "@/lib/finnhub/types"
import { mockNewsData, mockTickerData } from "@/lib/finnhub/mock-data"

// Popular symbols we track for enrichment
const TRACKED_SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "META", "GOOGL", "AMZN", "JPM", "GS", "XOM"]

// Map source keywords to categories
function inferCategory(related: string, source: string): CategoryType {
  const text = `${related} ${source}`.toLowerCase()
  if (text.includes("health") || text.includes("pharma") || text.includes("biotech") || text.includes("pfe") || text.includes("jnj")) return "healthcare"
  if (text.includes("oil") || text.includes("energy") || text.includes("xom") || text.includes("cvx")) return "energy"
  if (text.includes("bank") || text.includes("financ") || text.includes("jpm") || text.includes("gs")) return "finance"
  return "technology"
}

function formatTimeAgo(unixTimestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - unixTimestamp
  if (diff < 60) return "Just now"
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export async function GET() {
  // If no API key, return mock data with isLive: false
  if (!isApiConfigured()) {
    return NextResponse.json({
      news: mockNewsData,
      tickers: mockTickerData,
      isLive: false,
      lastUpdated: new Date().toISOString(),
    })
  }

  try {
    // Fetch market news
    const rawNews = await getMarketNews("general")
    const top12 = rawNews.slice(0, 12)

    // Extract symbols mentioned in news
    const mentionedSymbols = new Set<string>()
    for (const article of top12) {
      if (article.related) {
        article.related.split(",").forEach((s) => {
          const sym = s.trim().toUpperCase()
          if (sym && TRACKED_SYMBOLS.includes(sym)) {
            mentionedSymbols.add(sym)
          }
        })
      }
    }

    // If few symbols found in news, add some popular ones
    if (mentionedSymbols.size < 3) {
      TRACKED_SYMBOLS.slice(0, 5).forEach((s) => mentionedSymbols.add(s))
    }

    const symbolList = Array.from(mentionedSymbols)

    // Fetch quotes, sentiment and candles for mentioned symbols in parallel
    const now = Math.floor(Date.now() / 1000)
    const oneDayAgo = now - 86400

    const [quotesResult, sentimentResult, candlesResult] = await Promise.all([
      Promise.allSettled(symbolList.map((s) => getQuote(s))),
      Promise.allSettled(symbolList.map((s) => getNewsSentiment(s))),
      Promise.allSettled(symbolList.map((s) => getStockCandles(s, "60", oneDayAgo, now))),
    ])

    // Build lookup maps
    const quoteMap = new Map<string, { price: number; change: number; changePercent: number }>()
    const sentimentMap = new Map<string, { type: SentimentType; score: number }>()
    const sparklineMap = new Map<string, number[]>()

    symbolList.forEach((sym, i) => {
      const qr = quotesResult[i]
      if (qr.status === "fulfilled" && qr.value.c > 0) {
        quoteMap.set(sym, {
          price: qr.value.c,
          change: qr.value.d,
          changePercent: qr.value.dp,
        })
      }

      const sr = sentimentResult[i]
      if (sr.status === "fulfilled" && sr.value.sentiment) {
        const bull = sr.value.sentiment.bullishPercent
        const bear = sr.value.sentiment.bearishPercent
        let type: SentimentType = "neutral"
        if (bull > bear + 0.1) type = "bullish"
        else if (bear > bull + 0.1) type = "bearish"
        sentimentMap.set(sym, { type, score: Math.max(bull, bear) })
      }

      const cr = candlesResult[i]
      if (cr.status === "fulfilled" && cr.value.s === "ok" && cr.value.c) {
        // Take last 10 close prices for sparkline
        const closes = cr.value.c
        const sparkData = closes.length > 10 ? closes.slice(-10) : closes
        sparklineMap.set(sym, sparkData)
      }
    })

    // Company name lookup
    const companyNames: Record<string, string> = {
      AAPL: "Apple Inc.",
      TSLA: "Tesla Inc.",
      NVDA: "NVIDIA Corp.",
      MSFT: "Microsoft Corp.",
      META: "Meta Platforms",
      GOOGL: "Alphabet Inc.",
      AMZN: "Amazon.com",
      JPM: "JPMorgan Chase",
      GS: "Goldman Sachs",
      XOM: "Exxon Mobil",
    }

    // Build normalized news items
    const news: NewsItem[] = top12.map((article, idx) => {
      // Find the best matching symbol for this article
      const relatedSymbols = article.related
        ? article.related.split(",").map((s) => s.trim().toUpperCase()).filter((s) => TRACKED_SYMBOLS.includes(s))
        : []
      const primarySymbol = relatedSymbols[0] || symbolList[idx % symbolList.length] || "AAPL"
      const quote = quoteMap.get(primarySymbol)
      const sentiment = sentimentMap.get(primarySymbol)
      const sparkline = sparklineMap.get(primarySymbol)

      // Fallback sentiment from price change
      let sentimentType: SentimentType = sentiment?.type ?? "neutral"
      let sentimentScore = sentiment?.score ?? 0.5
      if (!sentiment && quote) {
        sentimentType = quote.change >= 0 ? "bullish" : "bearish"
        sentimentScore = Math.min(0.95, 0.5 + Math.abs(quote.changePercent) / 10)
      }

      return {
        id: article.id.toString(),
        ticker: primarySymbol,
        companyName: companyNames[primarySymbol] || primarySymbol,
        title: article.headline,
        summary: article.summary || "",
        source: article.source,
        time: formatTimeAgo(article.datetime),
        url: article.url,
        imageUrl: article.image || "",
        sentiment: sentimentType,
        sentimentScore,
        priceChange: quote?.changePercent ?? 0,
        currentPrice: quote?.price ?? 0,
        sparklineData: sparkline || [100, 101, 102, 103, 104, 103, 105, 106, 107, 108],
        category: inferCategory(article.related || "", article.source),
      }
    })

    // Build ticker data from quotes
    const tickers = symbolList
      .filter((s) => quoteMap.has(s))
      .map((sym) => {
        const q = quoteMap.get(sym)!
        return {
          symbol: sym,
          name: companyNames[sym] || sym,
          price: q.price,
          change: q.change,
          changePercent: q.changePercent,
        }
      })

    return NextResponse.json({
      news,
      tickers: tickers.length > 0 ? tickers : mockTickerData,
      isLive: true,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Finnhub API error, falling back to mock data:", error)
    return NextResponse.json({
      news: mockNewsData,
      tickers: mockTickerData,
      isLive: false,
      lastUpdated: new Date().toISOString(),
    })
  }
}
