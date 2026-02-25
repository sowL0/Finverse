'use client';

import { useState, useEffect, useRef } from 'react';
import type { Basket, BasketAsset, AssetType } from '@/types';

// ── Mock asset catalogue (replace with real API calls) ─────────────────────
const ASSET_CATALOGUE: Omit<BasketAsset, 'addedAt' | 'sparkline'>[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', price: 241.50, change24h: 0.6, changeAmount: 1.44, currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', price: 134.80, change24h: 2.8, changeAmount: 3.67, currency: 'USD' },
  { symbol: 'PLTR', name: 'Palantir Tech.', type: 'stock', price: 84.20, change24h: 4.2, changeAmount: 3.40, currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock', price: 415.30, change24h: 0.9, changeAmount: 3.71, currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', price: 342.70, change24h: -1.2, changeAmount: -4.17, currency: 'USD' },
  { symbol: 'META', name: 'Meta Platforms', type: 'stock', price: 608.10, change24h: -0.4, changeAmount: -2.44, currency: 'USD' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock', price: 228.30, change24h: 1.1, changeAmount: 2.49, currency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet', type: 'stock', price: 196.40, change24h: 0.7, changeAmount: 1.36, currency: 'USD' },
  { symbol: 'JPM', name: 'JPMorgan Chase', type: 'stock', price: 268.90, change24h: 0.3, changeAmount: 0.81, currency: 'USD' },
  { symbol: 'LMT', name: 'Lockheed Martin', type: 'stock', price: 490.20, change24h: -0.2, changeAmount: -0.98, currency: 'USD' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: 97400, change24h: 2.1, changeAmount: 2004, currency: 'USD' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: 2840, change24h: 1.8, changeAmount: 50.32, currency: 'USD' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', price: 174.20, change24h: 3.5, changeAmount: 5.89, currency: 'USD' },
  { symbol: 'BNB', name: 'BNB', type: 'crypto', price: 612.40, change24h: 0.9, changeAmount: 5.47, currency: 'USD' },
  { symbol: 'XRP', name: 'Ripple', type: 'crypto', price: 2.34, change24h: -0.6, changeAmount: -0.014, currency: 'USD' },
];

const EMOJIS = ['🚀', '💎', '📈', '🌍', '⚡', '🤖', '🏦', '🔮', '🌱', '🦁'];

function makeSparkline(trend: number): number[] {
  const d = [100];
  for (let i = 1; i < 20; i++) d.push(Math.max(50, d[i - 1] + (Math.random() - 0.47) * 4 + trend));
  return d;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (basket: Basket) => void;
}

export function AddBasketModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🚀');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<typeof ASSET_CATALOGUE>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(''); setEmoji('🚀'); setQuery(''); setSelected([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = query.trim()
    ? ASSET_CATALOGUE.filter(
        (a) =>
          (a.symbol.includes(query.toUpperCase()) ||
            a.name.toLowerCase().includes(query.toLowerCase())) &&
          !selected.find((s) => s.symbol === a.symbol)
      ).slice(0, 6)
    : [];

  const addAsset = (asset: typeof ASSET_CATALOGUE[0]) => {
    setSelected((prev) => [...prev, asset]);
    setQuery('');
  };

  const removeAsset = (symbol: string) => {
    setSelected((prev) => prev.filter((a) => a.symbol !== symbol));
  };

  const canCreate = name.trim().length > 0 && selected.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    const now = new Date().toISOString();
    const assets: BasketAsset[] = selected.map((a) => ({
      ...a,
      addedAt: now,
      sparkline: makeSparkline(a.change24h > 0 ? 0.3 : -0.3),
    }));
    const totalValueUSD = assets.reduce((s, a) => s + a.price, 0);
    const totalChangePercent =
      assets.reduce((s, a) => s + a.change24h, 0) / assets.length;
    const totalChangeAmount = assets.reduce((s, a) => s + a.changeAmount, 0);

    const basket: Basket = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      assets,
      createdAt: now,
      totalValueUSD,
      totalChangePercent,
      totalChangeAmount,
      isPublic: false,
    };
    onCreated(basket);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#071330]/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[430px] bg-[#111f50] border border-[rgba(99,149,255,0.15)] rounded-t-[28px] p-0 pb-10 max-h-[88dvh] overflow-y-auto animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-5">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        <h2 className="text-lg font-extrabold px-6 pb-5 border-b border-[rgba(99,149,255,0.1)]">
          Yeni Sepet Oluştur
        </h2>

        <div className="px-6 pt-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 mb-2">
              Sepet Adı
            </label>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="örn. Teknoloji Sepetim"
              className="w-full bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 mb-2">
              Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                    emoji === e
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-[rgba(99,149,255,0.15)] bg-[#0c1a42] hover:border-blue-400'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 mb-2">
              Varlık Ekle
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hisse veya kripto ara... (AAPL, BTC)"
                className="w-full bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {results.map((a) => (
                  <button
                    key={a.symbol}
                    onClick={() => addAsset(a)}
                    className="flex items-center justify-between bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] rounded-xl px-3.5 py-2.5 hover:border-blue-500 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-blue-300 text-sm w-12">{a.symbol}</span>
                      <span className="text-slate-400 text-xs">{a.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.type === 'crypto'
                          ? 'bg-purple-500/10 text-purple-300'
                          : 'bg-blue-500/10 text-blue-300'
                      }`}
                    >
                      {a.type === 'crypto' ? 'Kripto' : 'Hisse'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-3">Sonuç bulunamadı</p>
            )}
          </div>

          {/* Selected */}
          {selected.length > 0 && (
            <div>
              <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 mb-2">
                Eklenenler ({selected.length})
              </label>
              <div className="flex flex-col gap-1.5">
                {selected.map((a) => (
                  <div
                    key={a.symbol}
                    className="flex items-center justify-between bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] rounded-xl px-3.5 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                          a.type === 'crypto'
                            ? 'bg-purple-500/10 text-purple-300'
                            : 'bg-blue-500/10 text-blue-300'
                        }`}
                      >
                        {a.symbol}
                      </span>
                      <span className="text-slate-400 text-xs">{a.name}</span>
                    </div>
                    <button
                      onClick={() => removeAsset(a.symbol)}
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create */}
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 hover:shadow-blue-700/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            Sepet Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
