"use client"

import { cn } from "@/lib/utils"

export type FilterCategory = "all" | "popular" | "breaking" | "technology" | "finance" | "energy" | "healthcare"

interface FilterBarProps {
  activeFilter: FilterCategory
  onFilterChange: (filter: FilterCategory) => void
}

const filters: { id: FilterCategory; label: string; icon: string }[] = [
  { id: "all", label: "All News", icon: "grid" },
  { id: "popular", label: "Popular Stocks", icon: "fire" },
  { id: "breaking", label: "Breaking", icon: "bolt" },
  { id: "technology", label: "Technology", icon: "cpu" },
  { id: "finance", label: "Finance", icon: "banknote" },
  { id: "energy", label: "Energy", icon: "zap" },
  { id: "healthcare", label: "Healthcare", icon: "heart" },
]

function FilterIcon({ type }: { type: string }) {
  switch (type) {
    case "grid":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
      )
    case "fire":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1C7 1 3 5.5 3 8.5C3 10.71 4.79 12.5 7 12.5C9.21 12.5 11 10.71 11 8.5C11 5.5 7 1 7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case "bolt":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7.5 1L2.5 8H7L6.5 13L11.5 6H7L7.5 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case "cpu":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <rect x="5" y="5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1"/>
          <path d="M5.5 1V3M8.5 1V3M5.5 11V13M8.5 11V13M1 5.5H3M11 5.5H13M1 8.5H3M11 8.5H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )
    case "banknote":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
      )
    case "zap":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7.5 1L2 8H7L6.5 13L12 6H7L7.5 1Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case "heart":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 12S1 8 1 4.5C1 2.5 2.5 1 4.5 1C5.8 1 6.7 1.7 7 2.2C7.3 1.7 8.2 1 9.5 1C11.5 1 13 2.5 13 4.5C13 8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <nav aria-label="News filters" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
            activeFilter === filter.id
              ? "bg-finverse-navy text-primary-foreground shadow-md"
              : "bg-card text-muted-foreground border border-border hover:border-finverse-navy/30 hover:text-foreground"
          )}
          aria-pressed={activeFilter === filter.id}
        >
          <FilterIcon type={filter.icon} />
          {filter.label}
        </button>
      ))}
    </nav>
  )
}
