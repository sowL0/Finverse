"use client"

import { useRouter } from "next/navigation"
import { Sparkline } from "@/components/finverse/sparkline"
import { SentimentBadge } from "@/components/finverse/sentiment-badge"
import { cn } from "@/lib/utils"
import type { NewsItem } from "@/lib/finnhub/types"

interface NewsCardProps {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  const router = useRouter()
  const isPositive = item.priceChange >= 0

  return (
    <div
      onClick={() => router.push(`/ticker/${item.ticker}`)}
      className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-finverse-accent/30 hover:shadow-lg hover:shadow-finverse-navy/5 cursor-pointer"
    >
      {/* Top row: ticker + sparkline */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Ticker badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-finverse-navy text-[#FFFFFF]">
            <span className="text-xs font-bold tracking-wide">
              {item.ticker.slice(0, 4)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                {"$"}{item.ticker}
              </span>
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  isPositive ? "text-finverse-bull" : "text-finverse-bear"
                )}
              >
                {isPositive ? "+" : ""}{item.priceChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{item.companyName}</span>
              {item.currentPrice > 0 && (
                <span className="text-xs font-medium text-foreground/70">
                  {"$"}{item.currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Sparkline */}
        <div className="shrink-0">
          <Sparkline
            data={item.sparklineData}
            width={80}
            height={32}
            positive={isPositive}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2 text-pretty group-hover:text-finverse-accent transition-colors">
        {item.title}
      </h3>

      {/* Bottom row: source, time, sentiment */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{item.source}</span>
          <span aria-hidden="true" className="text-border">{"/"}</span>
          <time>{item.time}</time>
        </div>
        <SentimentBadge sentiment={item.sentiment} score={item.sentimentScore} />
      </div>

      {/* Hover hint */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] text-finverse-accent opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Detayları gör</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}
