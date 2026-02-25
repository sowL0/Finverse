'use client';

import { useState } from 'react';
import type { PostDirection } from '@/types/post';
import { ASSET_CATALOGUE } from '@/types/post';

interface TickerSearchProps {
  selectedTicker: string;
  selectedName: string;
  direction: PostDirection | '';
  onSelectTicker: (symbol: string, name: string, type: 'stock' | 'crypto') => void;
  onSelectDirection: (d: PostDirection) => void;
  tickerError?: string;
  directionError?: string;
}

const DIRECTIONS: { value: PostDirection; label: string; emoji: string; color: string; bg: string; border: string }[] = [
  { value: 'BULL',    label: 'Boğa',   emoji: '🐂', color: 'text-green-300', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { value: 'BEAR',    label: 'Ayı',    emoji: '🐻', color: 'text-red-300',   bg: 'bg-red-500/10',   border: 'border-red-500/30'   },
  { value: 'NEUTRAL', label: 'Nötr',   emoji: '⚖️', color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
];

export function TickerSearch({
  selectedTicker, selectedName, direction,
  onSelectTicker, onSelectDirection,
  tickerError, directionError,
}: TickerSearchProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = query.trim()
    ? ASSET_CATALOGUE.filter(
        (a) =>
          a.symbol.includes(query.toUpperCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (symbol: string, name: string, type: 'stock' | 'crypto') => {
    onSelectTicker(symbol, name, type);
    setQuery('');
    setFocused(false);
  };

  return (
    <div className="space-y-5">
      {/* Ticker search */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[2px] text-slate-400 mb-2">
          Varlık Seç <span className="text-red-400">*</span>
        </label>

        {selectedTicker ? (
          /* Selected state */
          <div className="flex items-center justify-between bg-[#0c1a42] border border-blue-500/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-blue-300 text-base">{selectedTicker}</span>
              <span className="text-slate-400 text-sm">{selectedName}</span>
            </div>
            <button
              onClick={() => { onSelectTicker('', '', 'stock'); setQuery(''); }}
              className="text-slate-500 hover:text-red-400 text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          /* Search input */
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="AAPL, NVDA, BTC..."
              className={`w-full bg-[#0c1a42] border rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors ${
                tickerError ? 'border-red-500/50' : 'border-[rgba(99,149,255,0.15)] focus:border-blue-500'
              }`}
            />
            {/* Dropdown */}
            {focused && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f1f50] border border-[rgba(99,149,255,0.15)] rounded-xl overflow-hidden z-30 shadow-xl">
                {results.map((a) => (
                  <button
                    key={a.symbol}
                    onMouseDown={() => handleSelect(a.symbol, a.name, a.type)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-500/10 transition-colors text-left border-b border-[rgba(99,149,255,0.07)] last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-blue-300 text-sm w-14">{a.symbol}</span>
                      <span className="text-slate-400 text-xs">{a.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-semibold ${a.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(1)}%
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.type === 'crypto'
                          ? 'bg-purple-500/10 text-purple-300'
                          : 'bg-blue-500/10 text-blue-300'
                      }`}>
                        {a.type === 'crypto' ? 'Kripto' : 'Hisse'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {tickerError && <p className="text-red-400 text-[11px] mt-1.5">{tickerError}</p>}
      </div>

      {/* Direction */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[2px] text-slate-400 mb-2">
          Yönünüz <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DIRECTIONS.map((d) => {
            const active = direction === d.value;
            return (
              <button
                key={d.value}
                onClick={() => onSelectDirection(d.value)}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border font-semibold text-sm transition-all ${
                  active
                    ? `${d.bg} ${d.border} ${d.color} scale-[1.02]`
                    : 'bg-[#0c1a42] border-[rgba(99,149,255,0.13)] text-slate-400 hover:border-blue-500/25'
                }`}
              >
                <span className="text-2xl">{d.emoji}</span>
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
        {directionError && <p className="text-red-400 text-[11px] mt-1.5">{directionError}</p>}
      </div>

      {/* Preview when both selected */}
      {selectedTicker && direction && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
          direction === 'BULL' ? 'bg-green-500/5 border-green-500/20' :
          direction === 'BEAR' ? 'bg-red-500/5 border-red-500/20' :
          'bg-slate-500/5 border-slate-500/20'
        }`}>
          <span className="text-xl">
            {DIRECTIONS.find(d => d.value === direction)?.emoji}
          </span>
          <div>
            <p className="font-mono font-bold text-sm text-white">{selectedTicker}</p>
            <p className="text-xs text-slate-400">
              {DIRECTIONS.find(d => d.value === direction)?.label} pozisyon analizi
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
