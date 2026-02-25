'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkline } from '@/components/finverse/sparkline';
import { SentimentBadge } from '@/components/finverse/sentiment-badge';
import type { NewsItem } from '@/lib/finnhub/types';

interface TickerDetailProps {
  symbol: string;
}

const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  TSLA: 'Tesla Inc.',
  NVDA: 'NVIDIA Corp.',
  MSFT: 'Microsoft Corp.',
  META: 'Meta Platforms',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com',
  JPM: 'JPMorgan Chase',
  GS: 'Goldman Sachs',
  XOM: 'Exxon Mobil',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  BNB: 'BNB',
  XRP: 'Ripple',
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
      <div className="h-3 bg-muted rounded w-1/4" />
    </div>
  );
}

export default function TickerDetailPage({ symbol }: TickerDetailProps) {
  const router = useRouter();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [tickerNews, setTickerNews] = useState<NewsItem[]>([]);
  const [tickerData, setTickerData] = useState<{ price: number; change: number; changePercent: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const companyName = COMPANY_NAMES[symbol] || symbol;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/finnhub/news');
        const data = await res.json();

        // O ticker'a ait haberler + genel haberler
        const related = (data.news as NewsItem[]).filter(
          (n) => n.ticker === symbol
        );
        setTickerNews(related);
        setAllNews(data.news);

        // Ticker fiyat bilgisi
        const ticker = data.tickers?.find((t: { symbol: string; price: number; change: number; changePercent: number }) => t.symbol === symbol);
        if (ticker) {
          setTickerData({
            price: ticker.price,
            change: ticker.change,
            changePercent: ticker.changePercent,
          });
        }
      } catch {
        // hata olursa boş bırak
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [symbol]);

  const isPositive = (tickerData?.changePercent ?? 0) >= 0;

  // O tickerla ilgili haberler varsa onları, yoksa tüm haberleri göster
  const displayNews = tickerNews.length > 0 ? tickerNews : allNews.slice(0, 6);

  return (
    <div className="min-h-full">
      {/* Geri butonu */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
        Geri
      </button>

      {/* Ticker başlık kartı */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-finverse-navy">
              <span className="text-sm font-bold tracking-wide text-white">
                {symbol.slice(0, 4)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">${symbol}</h1>
              <p className="text-sm text-muted-foreground">{companyName}</p>
            </div>
          </div>

          {/* Fiyat */}
          {tickerData && (
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-foreground">
                ${tickerData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`font-mono text-sm font-semibold ${isPositive ? 'text-finverse-bull' : 'text-finverse-bear'}`}>
                {isPositive ? '+' : ''}{tickerData.changePercent.toFixed(2)}%
                <span className="text-muted-foreground ml-1 font-normal">
                  ({isPositive ? '+' : ''}${tickerData.change.toFixed(2)})
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {tickerNews[0]?.sparklineData && (
          <Sparkline
            data={tickerNews[0].sparklineData}
            width={600}
            height={60}
            positive={isPositive}
          />
        )}
      </div>

      {/* Haberler */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">
          {tickerNews.length > 0
            ? `${symbol} ile İlgili Haberler (${tickerNews.length})`
            : 'Güncel Haberler'}
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayNews.map((item) => (
              <a
                key={item.id}
                href={item.url && item.url !== '#' ? item.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-finverse-accent/30 hover:shadow-lg ${
                  item.url && item.url !== '#' ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Üst satır: ticker + sentiment */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-finverse-accent">
                      ${item.ticker}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <SentimentBadge sentiment={item.sentiment} score={item.sentimentScore} />
                </div>

                {/* Başlık */}
                <h3 className="text-sm font-semibold leading-snug text-foreground mb-2 group-hover:text-finverse-accent transition-colors">
                  {item.title}
                </h3>

                {/* Özet */}
                {item.summary && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                )}

                {/* Kaynak linki */}
                {item.url && item.url !== '#' && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-finverse-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Kaynağa git</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
