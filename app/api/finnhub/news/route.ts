import { NextResponse } from "next/server"
import type { NewsItem, SentimentType, CategoryType, TickerItem } from "@/lib/finnhub/types"
import { mockNewsData, mockTickerData } from "@/lib/finnhub/mock-data"
import { isApiConfigured, getMarketNews, getQuote, getNewsSentiment, getStockCandles } from "@/lib/finnhub/client"

// ── Sabit hisse sembolleri (Finnhub) ──────────────────────────────────────────
const STOCK_SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "META", "GOOGL", "AMZN", "JPM", "GS", "XOM", "PLTR", "AMD", "INTC", "NFLX", "DIS"]

const COMPANY_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.", TSLA: "Tesla Inc.", NVDA: "NVIDIA Corp.", MSFT: "Microsoft",
  META: "Meta Platforms", GOOGL: "Alphabet", AMZN: "Amazon", JPM: "JPMorgan Chase",
  GS: "Goldman Sachs", XOM: "Exxon Mobil", PLTR: "Palantir", AMD: "AMD",
  INTC: "Intel", NFLX: "Netflix", DIS: "Disney",
}

function formatTimeAgo(unixTimestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - unixTimestamp
  if (diff < 60) return "Just now"
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function inferCategory(related: string, source: string): CategoryType {
  const text = `${related} ${source}`.toLowerCase()
  if (text.includes("health") || text.includes("pharma") || text.includes("biotech")) return "healthcare"
  if (text.includes("oil") || text.includes("energy") || text.includes("xom")) return "energy"
  if (text.includes("bank") || text.includes("financ") || text.includes("jpm")) return "finance"
  return "technology"
}

// ── CoinGecko: canlı kripto fiyatları (API key gerektirmez) ───────────────────
async function fetchCryptoTickers(): Promise<TickerItem[]> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error("CoinGecko error")
    const data = await res.json()

    return data.map((coin: {
      symbol: string
      name: string
      current_price: number
      price_change_24h: number
      price_change_percentage_24h: number
    }) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      type: "crypto",
    }))
  } catch {
    return []
  }
}

// ── CoinGecko: kripto haberleri ───────────────────────────────────────────────
async function fetchCryptoNews(): Promise<NewsItem[]> {
  try {
    // Top 20 kripto için haber çek
    const coinsRes = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true",
      { next: { revalidate: 120 } }
    )
    if (!coinsRes.ok) throw new Error("CoinGecko coins error")
    const coins = await coinsRes.json()

    // Her coin için news benzeri veri oluştur (CoinGecko haber API'si premium)
    // Bunun yerine trending coins + fiyat değişiminden haber oluşturuyoruz
    const newsItems: NewsItem[] = coins.slice(0, 10).map((coin: {
      id: string
      symbol: string
      name: string
      current_price: number
      price_change_percentage_24h: number
      price_change_24h: number
      market_cap_rank: number
      sparkline_in_7d?: { price: number[] }
    }, idx: number) => {
      const isUp = coin.price_change_percentage_24h >= 0
      const absChange = Math.abs(coin.price_change_percentage_24h).toFixed(2)
      const sentiment: SentimentType = isUp ? "bullish" : "bearish"

      const headlines = isUp ? [
        `${coin.name} surges ${absChange}% as crypto market gains momentum`,
        `${coin.name} breaks resistance level with ${absChange}% gain in 24 hours`,
        `Institutional interest drives ${coin.name} up ${absChange}% today`,
      ] : [
        `${coin.name} drops ${absChange}% amid market uncertainty`,
        `${coin.name} faces selling pressure, down ${absChange}% in 24 hours`,
        `${coin.name} declines ${absChange}% as bears take control`,
      ]

      const sparkline = coin.sparkline_in_7d?.price?.slice(-10) ?? [100, 101, 102, 103, 104]

      return {
        id: `crypto-${coin.id}-${idx}`,
        ticker: coin.symbol.toUpperCase(),
        companyName: coin.name,
        title: headlines[idx % headlines.length],
        summary: `${coin.name} is currently ranked #${coin.market_cap_rank} by market cap, trading at $${coin.current_price.toLocaleString()} with a ${isUp ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}% change in the last 24 hours.`,
        source: "CoinGecko",
        time: `${(idx + 1) * 5} min ago`,
        url: `https://www.coingecko.com/en/coins/${coin.id}`,
        imageUrl: "",
        sentiment,
        sentimentScore: Math.min(0.95, 0.5 + Math.abs(coin.price_change_percentage_24h) / 20),
        priceChange: coin.price_change_percentage_24h,
        currentPrice: coin.current_price,
        sparklineData: sparkline,
        category: "technology" as CategoryType,
      }
    })

    return newsItems
  } catch {
    return []
  }
}

// ── Ana GET handler ───────────────────────────────────────────────────────────
export async function GET() {
  try {
    // Her zaman CoinGecko'dan kripto verisi çek (ücretsiz)
    const [cryptoTickers, cryptoNews] = await Promise.all([
      fetchCryptoTickers(),
      fetchCryptoNews(),
    ])

    // Finnhub varsa hisse haberlerini de çek
    let stockNews: NewsItem[] = []
    let stockTickers: TickerItem[] = []

    if (isApiConfigured()) {
      try {
        const now = Math.floor(Date.now() / 1000)
        const oneDayAgo = now - 86400

        const rawNews = await getMarketNews("general")
        const top10 = rawNews.slice(0, 10)

        // Hisse fiyatları paralel çek
        const quotes = await Promise.allSettled(
          STOCK_SYMBOLS.slice(0, 8).map(s => getQuote(s))
        )

        stockTickers = STOCK_SYMBOLS.slice(0, 8)
          .map((sym, i) => {
            const qr = quotes[i]
            if (qr.status === "fulfilled" && qr.value.c > 0) {
              return {
                symbol: sym,
                name: COMPANY_NAMES[sym] || sym,
                price: qr.value.c,
                change: qr.value.d,
                changePercent: qr.value.dp,
              }
            }
            return null
          })
          .filter(Boolean) as TickerItem[]

        const quoteMap = new Map(
          STOCK_SYMBOLS.slice(0, 8).map((sym, i) => {
            const qr = quotes[i]
            if (qr.status === "fulfilled" && qr.value.c > 0) return [sym, qr.value]
            return [sym, null]
          })
        )

        stockNews = top10.map((article, idx) => {
          const relatedSymbols = article.related
            ? article.related.split(",").map(s => s.trim().toUpperCase()).filter(s => STOCK_SYMBOLS.includes(s))
            : []
          const primarySymbol = relatedSymbols[0] || STOCK_SYMBOLS[idx % STOCK_SYMBOLS.length]
          const quote = quoteMap.get(primarySymbol)
          const isUp = (quote?.dp ?? 0) >= 0

          return {
            id: article.id.toString(),
            ticker: primarySymbol,
            companyName: COMPANY_NAMES[primarySymbol] || primarySymbol,
            title: article.headline,
            summary: article.summary || "",
            source: article.source,
            time: formatTimeAgo(article.datetime),
            url: article.url,
            imageUrl: article.image || "",
            sentiment: (isUp ? "bullish" : "bearish") as SentimentType,
            sentimentScore: Math.min(0.95, 0.5 + Math.abs(quote?.dp ?? 0) / 10),
            priceChange: quote?.dp ?? 0,
            currentPrice: quote?.c ?? 0,
            sparklineData: [100, 101, 102, 103, 104, 103, 105, 106, 107, 108],
            category: inferCategory(article.related || "", article.source),
          }
        })
      } catch {
        // Finnhub hata verirse sadece mock stock news kullan
        stockNews = mockNewsData.filter(n => !["BTC", "ETH", "SOL", "BNB", "XRP"].includes(n.ticker))
      }
    } else {
      stockNews = mockNewsData.filter(n => !["BTC", "ETH", "SOL", "BNB", "XRP"].includes(n.ticker))
      stockTickers = mockTickerData
    }

    // Kripto + hisse haberlerini karıştır
    const allNews = [...cryptoNews, ...stockNews].sort(() => Math.random() - 0.5)

    // Ticker bandı: kripto (canlı) + hisse
    const allTickers = [
      ...cryptoTickers.slice(0, 30),
      ...stockTickers,
    ]

    return NextResponse.json({
      news: allNews,
      tickers: allTickers,
      isLive: cryptoTickers.length > 0,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({
      news: mockNewsData,
      tickers: mockTickerData,
      isLive: false,
      lastUpdated: new Date().toISOString(),
    })
  }
}
