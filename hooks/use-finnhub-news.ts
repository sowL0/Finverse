"use client"

import useSWR from "swr"
import type { NewsFeedResponse } from "@/lib/finnhub/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useFinnhubNews() {
  const { data, error, isLoading, mutate } = useSWR<NewsFeedResponse>(
    "/api/finnhub/news",
    fetcher,
    {
      refreshInterval: 60_000,     // auto-refresh every 60s
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
      errorRetryCount: 3,
      errorRetryInterval: 5_000,
    }
  )

  return {
    news: data?.news ?? [],
    tickers: data?.tickers ?? [],
    isLive: data?.isLive ?? false,
    lastUpdated: data?.lastUpdated ?? null,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}
