'use client';

import { useState } from 'react';
import type { Basket } from '@/types';
import { Sparkline } from './Sparkline';

interface BasketCardProps {
  basket: Basket;
  formatPrice: (usd: number) => string;
}

// ── Simulated news (replace with real API) ────────────────────────────────────
const MOCK_NEWS = [
  { source: 'Reuters', title: 'Fed faiz kararı piyasaları hareketlendirdi, teknoloji hisseleri yükseldi', time: '2s önce' },
  { source: 'Bloomberg', title: 'NVIDIA veri merkezi gelirlerinde rekor büyüme açıkladı', time: '4s önce' },
  { source: 'CoinDesk', title: 'Bitcoin spot ETF hacmi aylık rekor seviyeye ulaştı', time: '6s önce' },
  { source: 'CNBC', title: 'Tesla robotaxi lansmanı öncesinde analist hedef fiyatları yükseltildi', time: '1g önce' },
];

export function BasketCard({ basket, formatPrice }: BasketCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'1H' | '1G' | '1A'>('1H');

  const isUp = basket.totalChangePercent >= 0;

  return (
    <div
      className={`bg-[#0c1a42] border rounded-2xl overflow-hidden transition-all duration-300 ${
        expanded
          ? 'border-blue-500/30 shadow-xl shadow-blue-900/20'
          : 'border-[rgba(99,149,255,0.13)] hover:border-blue-500/25 hover:shadow-lg cursor-pointer active:scale-[0.99]'
      }`}
      onClick={() => !expanded && setExpanded(true)}
    >
      {/* ── Top Row ── */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4">
        <div>
          <p className="text-[15px] font-bold">
            {basket.emoji} {basket.name}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {basket.assets.length} varlık ·{' '}
            {new Date(basket.createdAt).toLocaleDateString('tr-TR')}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono font-bold text-base">
            {formatPrice(basket.totalValueUSD)}
          </p>
          <span
            className={`inline-block mt-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
              isUp
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isUp ? '+' : ''}
            {basket.totalChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* ── Collapsed: mini sparkline + ticker pills ── */}
      {!expanded && (
        <>
          <div className="px-5 pb-3 h-12">
            {basket.assets[0] && (
              <Sparkline
                data={basket.assets[0].sparkline}
                color={isUp ? '#22c55e' : '#ef4444'}
                fill
                height={48}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 px-5 pb-4">
            {basket.assets.slice(0, 5).map((a) => (
              <span
                key={a.symbol}
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                  a.type === 'crypto'
                    ? 'bg-purple-500/8 border-purple-500/20 text-purple-300'
                    : 'bg-blue-500/8 border-blue-500/15 text-blue-300'
                }`}
              >
                {a.symbol}
              </span>
            ))}
            {basket.assets.length > 5 && (
              <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5">
                +{basket.assets.length - 5}
              </span>
            )}
          </div>
        </>
      )}

      {/* ── Expanded ── */}
      {expanded && (
        <div onClick={(e) => e.stopPropagation()}>
          {/* Chart + tabs */}
          <div className="mx-4 mb-4 bg-[#111f50] border border-[rgba(99,149,255,0.1)] rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-2xl font-bold">
                  {formatPrice(basket.totalValueUSD)}
                </p>
                <p className={`text-sm font-bold mt-0.5 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{basket.totalChangePercent.toFixed(2)}% bugün
                </p>
              </div>
              <div className="flex gap-1">
                {(['1H', '1G', '1A'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <Sparkline
              data={basket.assets[0]?.sparkline ?? [100]}
              color={isUp ? '#22c55e' : '#ef4444'}
              fill
              height={100}
            />
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-4 gap-2 mx-4 mb-4">
            {[
              { label: 'Toplam', value: formatPrice(basket.totalValueUSD) },
              {
                label: 'Kazanç',
                value: `${isUp ? '+' : ''}${formatPrice(Math.abs(basket.totalChangeAmount))}`,
                color: isUp ? 'text-green-400' : 'text-red-400',
              },
              { label: 'Varlık', value: basket.assets.length.toString() },
              { label: 'Ort. Değ.', value: `${isUp ? '+' : ''}${basket.totalChangePercent.toFixed(1)}%` },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-[#111f50] border border-[rgba(99,149,255,0.1)] rounded-xl p-3 text-center"
              >
                <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <p className={`font-mono text-xs font-bold ${color ?? 'text-white'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Asset rows */}
          <div className="mx-4 mb-4 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold mb-1">
              Varlıklar
            </p>
            {basket.assets.map((asset) => {
              const assetUp = asset.change24h >= 0;
              return (
                <div
                  key={asset.symbol}
                  className="bg-[#111f50] border border-[rgba(99,149,255,0.1)] rounded-xl px-4 py-3 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-mono font-bold border ${
                          asset.type === 'crypto'
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                        }`}
                      >
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-mono font-bold text-sm">{asset.symbol}</p>
                        <p className="text-[11px] text-slate-400">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">{formatPrice(asset.price)}</p>
                      <p className={`text-[11px] font-bold ${assetUp ? 'text-green-400' : 'text-red-400'}`}>
                        {assetUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <Sparkline
                    data={asset.sparkline}
                    color={assetUp ? '#22c55e' : '#ef4444'}
                    height={28}
                  />
                </div>
              );
            })}
          </div>

          {/* News */}
          <div className="mx-4 mb-4">
            <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold mb-2">
              Haberler
            </p>
            <div className="flex flex-col gap-2">
              {MOCK_NEWS.slice(0, 3).map((n, i) => (
                <div
                  key={i}
                  className="bg-[#111f50] border border-[rgba(99,149,255,0.1)] rounded-xl px-4 py-3 hover:border-blue-500/25 transition-all cursor-pointer"
                >
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">{n.source}</p>
                  <p className="text-[13px] font-semibold leading-snug mb-1">{n.title}</p>
                  <p className="text-[11px] text-slate-500">{n.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collapse button */}
          <div className="px-4 pb-4">
            <button
              onClick={() => setExpanded(false)}
              className="w-full py-2.5 rounded-xl border border-[rgba(99,149,255,0.15)] text-slate-400 text-sm font-semibold hover:border-blue-500/30 hover:text-white transition-all"
            >
              Kapat ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
