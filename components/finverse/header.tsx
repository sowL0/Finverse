import { cn } from "@/lib/utils"

interface FinverseHeaderProps {
  className?: string
  isLive?: boolean
  lastUpdated?: string | null
}

export function FinverseHeader({ className, isLive = false, lastUpdated }: FinverseHeaderProps) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : null

  return (
    <header className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-finverse-navy">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="4" height="12" rx="1" fill="white" opacity="0.9"/>
            <rect x="7" y="6" width="4" height="9" rx="1" fill="white" opacity="0.7"/>
            <rect x="12" y="1" width="4" height="14" rx="1" fill="white" opacity="0.5"/>
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Finverse</h1>
          <p className="text-xs text-muted-foreground">Financial News Feed</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {formattedTime && (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Updated {formattedTime}
          </span>
        )}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5",
            isLive
              ? "bg-finverse-bull/10"
              : "bg-finverse-warning/10"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                isLive ? "bg-finverse-bull" : "bg-finverse-warning"
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                isLive ? "bg-finverse-bull" : "bg-finverse-warning"
              )}
            />
          </span>
          <span
            className={cn(
              "text-xs font-medium",
              isLive ? "text-finverse-bull" : "text-finverse-warning"
            )}
          >
            {isLive ? "Live" : "Demo"}
          </span>
        </div>
      </div>
    </header>
  )
}
