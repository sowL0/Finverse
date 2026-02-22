"use client"

import type { TickerItem } from "@/lib/finnhub/types"
import { cn } from "@/lib/utils"

interface MarketTickerProps {
  items: TickerItem[]
}

export function MarketTicker({ items }: MarketTickerProps) {
  return (
    <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide" role="marquee" aria-label="Market ticker">
      {items.map((item) => {
        const isPositive = item.changePercent >= 0
        return (
          <div key={item.symbol} className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-mono text-xs font-bold text-foreground">{item.symbol}</span>
            <span className="text-xs text-muted-foreground">
              {"$"}{item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                isPositive ? "text-finverse-bull" : "text-finverse-bear"
              )}
            >
              {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
