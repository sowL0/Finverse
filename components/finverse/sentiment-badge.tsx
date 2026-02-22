"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SentimentType } from "@/lib/finnhub/types"

interface SentimentBadgeProps {
  sentiment: SentimentType
  score?: number
  className?: string
}

export function SentimentBadge({ sentiment, score, className }: SentimentBadgeProps) {
  const isBullish = sentiment === "bullish"
  const isNeutral = sentiment === "neutral"

  const label = isBullish ? "Bullish" : isNeutral ? "Neutral" : "Bearish"
  const scoreText = score ? `${Math.round(score * 100)}%` : null

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold border-0",
        isBullish && "bg-finverse-bull/10 text-finverse-bull",
        isNeutral && "bg-muted text-muted-foreground",
        !isBullish && !isNeutral && "bg-finverse-bear/10 text-finverse-bear",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        {!isNeutral && (
          isBullish ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2.5V9.5M6 9.5L9.5 6M6 9.5L2.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        )}
        {isNeutral && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
        {label}
        {scoreText && (
          <span className="opacity-60">{scoreText}</span>
        )}
      </span>
    </Badge>
  )
}
