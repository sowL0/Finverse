"use client"

import { useState, useMemo } from "react"
import { FilterBar, type FilterCategory } from "@/components/finverse/filter-bar"
import { NewsCard } from "@/components/finverse/news-card"
import { FinverseHeader } from "@/components/finverse/header"
import { MarketTicker } from "@/components/finverse/market-ticker"
import { NewsFeedSkeleton } from "@/components/finverse/skeletons"
import { useFinnhubNews } from "@/hooks/use-finnhub-news"
import type { NewsItem } from "@/lib/finnhub/types"

const POPULAR_TICKERS = ["AAPL", "TSLA", "NVDA", "MSFT", "META", "GOOGL", "AMZN"]

export function NewsFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all")
  const { news, tickers, isLive, lastUpdated, isLoading, isError, refresh } = useFinnhubNews()

  const filteredNews = useMemo(() => {
    if (activeFilter === "all") return news
    if (activeFilter === "popular") {
      return news.filter((item: NewsItem) => POPULAR_TICKERS.includes(item.ticker))
    }
    if (activeFilter === "breaking") {
      return news.filter((item: NewsItem) => item.time.includes("min") || item.time === "Just now")
    }
    return news.filter((item: NewsItem) => item.category === activeFilter)
  }, [activeFilter, news])

  const bullishCount = filteredNews.filter((n: NewsItem) => n.sentiment === "bullish").length
  const bearishCount = filteredNews.filter((n: NewsItem) => n.sentiment === "bearish").length

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6 lg:px-0">
      {/* Header */}
      <FinverseHeader isLive={isLive} lastUpdated={lastUpdated} />

      {/* Demo Banner */}
      {!isLive && !isLoading && (
        <div className="mt-4 rounded-xl border border-finverse-warning/30 bg-finverse-warning/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-finverse-warning" aria-hidden="true">
              <path d="M8 5V8.5M8 11H8.005M14.5 8C14.5 11.59 11.59 14.5 8 14.5C4.41 14.5 1.5 11.59 1.5 8C1.5 4.41 4.41 1.5 8 1.5C11.59 1.5 14.5 4.41 14.5 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Demo Mode</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {"Showing sample data. Add your "}
                <span className="font-mono text-xs font-semibold text-finverse-accent">FINNHUB_API_KEY</span>
                {" environment variable for live data from "}
                <a
                  href="https://finnhub.io/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-finverse-accent underline underline-offset-2 hover:no-underline"
                >
                  finnhub.io
                </a>
                {"."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {isError && (
        <div className="mt-4 rounded-xl border border-finverse-bear/30 bg-finverse-bear/5 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-finverse-bear">Failed to load data. Showing cached results.</p>
            <button
              onClick={() => refresh()}
              className="rounded-lg bg-finverse-bear/10 px-3 py-1.5 text-xs font-medium text-finverse-bear transition-colors hover:bg-finverse-bear/20"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Market Ticker */}
      {tickers.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-card px-4">
          <MarketTicker items={tickers} />
        </div>
      )}

      {/* Stats bar */}
      {!isLoading && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-finverse-bull/10 text-finverse-bull">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                <span className="font-semibold text-finverse-bull">{bullishCount}</span> Bullish
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-finverse-bear/10 text-finverse-bear">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 2V8M5 8L8 5M5 8L2 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                <span className="font-semibold text-finverse-bear">{bearishCount}</span> Bearish
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {filteredNews.length} {filteredNews.length === 1 ? "article" : "articles"}
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="mt-4">
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6">
          <NewsFeedSkeleton />
        </div>
      )}

      {/* News Grid */}
      {!isLoading && filteredNews.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filteredNews.map((item: NewsItem) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredNews.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"/>
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No news found</p>
          <p className="text-xs text-muted-foreground">Try selecting a different filter to see more articles.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-10 pb-6">
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border pt-4 sm:flex-row">
          <span className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-foreground">Finverse AI</span>
            {isLive && (
              <span className="text-muted-foreground">{" + Finnhub"}</span>
            )}
          </span>
          <span className="text-xs text-muted-foreground text-center">
            Sentiment analysis is AI-generated and not financial advice.
          </span>
        </div>
      </footer>
    </div>
  )
}
