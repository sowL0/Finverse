'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Basket } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { CurrencyToggle } from '@/components/basket/CurrencyToggle';
import { BasketCard } from '@/components/basket/BasketCard';
import { AddBasketModal } from '@/components/basket/AddBasketModal';

// ── Portfolio summary strip ────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, valueColor }: {
  label: string; value: string; sub?: string; valueColor?: string;
}) {
  return (
    <div className="bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-2xl px-4 py-4">
      <p className="text-[10px] uppercase tracking-[1.5px] text-slate-400 font-semibold mb-2">{label}</p>
      <p className={`font-mono text-lg font-bold ${valueColor ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-6xl mb-5">🧺</div>
      <h3 className="text-lg font-bold text-white mb-2">Henüz sepet yok</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">
        İlk sepetini oluştur. Hisse veya kripto ekle,<br />
        performansı gerçek zamanlı takip et.
      </p>
      <button
        onClick={onAdd}
        className="px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 transition-all"
      >
        + İlk Sepetini Oluştur
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BasketPage() {
  const router = useRouter();
  const { currency, setCurrency, format } = useCurrency();
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Derived portfolio stats
  const totalUSD = baskets.reduce((s, b) => s + b.totalValueUSD, 0);
  const allAssets = baskets.flatMap((b) => b.assets);
  const avgChange =
    allAssets.length > 0
      ? allAssets.reduce((s, a) => s + a.change24h, 0) / allAssets.length
      : 0;
  const uniqueAssets = new Set(allAssets.map((a) => a.symbol)).size;
  const bestPerformer = allAssets.length
    ? allAssets.reduce((a, b) => (a.change24h > b.change24h ? a : b))
    : null;

  const handleBasketCreated = (basket: Basket) => {
    setBaskets((prev) => [basket, ...prev]);
  };

  return (
    <>
      {/* ── Status bar (mobile feel) ── */}
      <div className="flex items-center justify-between px-6 pt-4 pb-0 text-xs text-slate-500">
        <span>{new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}</span>
        <span>●●●</span>
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-5">
        <div>
          <p className="text-[13px] text-slate-400 mb-0.5">Merhaba 👋</p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Fon <span className="text-blue-400">Sepetleri</span>
          </h1>
        </div>
        <button
          onClick={() => router.push('/profile')}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 border-2 border-blue-400/40 flex items-center justify-center font-bold text-sm hover:border-blue-400 hover:scale-105 transition-all"
        >
          JL
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 space-y-4">

        {/* Portfolio overview card */}
        {baskets.length > 0 && (
          <div className="relative bg-gradient-to-br from-[#0e2060] via-[#1a3a8f] to-[#0e2060] border border-blue-500/20 rounded-2xl p-5 overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-400/10 pointer-events-none" />
            <p className="text-[10px] uppercase tracking-[2px] text-white/40 mb-2">Toplam Portföy</p>
            <p className="font-mono text-3xl font-bold tracking-tight mb-1">
              {format(totalUSD)}
            </p>
            <p className={`text-sm font-bold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}% bugün
            </p>
            <div className="flex gap-5 mt-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[9px] uppercase text-white/30 tracking-wider mb-0.5">Sepetler</p>
                <p className="font-mono text-sm font-bold">{baskets.length}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-white/30 tracking-wider mb-0.5">Varlıklar</p>
                <p className="font-mono text-sm font-bold">{uniqueAssets}</p>
              </div>
              {bestPerformer && (
                <div>
                  <p className="text-[9px] uppercase text-white/30 tracking-wider mb-0.5">En İyi</p>
                  <p className="font-mono text-sm font-bold text-green-400">
                    {bestPerformer.symbol} +{bestPerformer.change24h.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Currency + header row */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Sepetlerim</h2>
          <div className="flex items-center gap-2">
            <CurrencyToggle value={currency} onChange={setCurrency} />
            <button
              onClick={() => setModalOpen(true)}
              className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors"
            >
              + Yeni
            </button>
          </div>
        </div>

        {/* Basket list */}
        {baskets.length === 0 ? (
          <EmptyState onAdd={() => setModalOpen(true)} />
        ) : (
          <div className="flex flex-col gap-3">
            {baskets.map((b) => (
              <BasketCard key={b.id} basket={b} formatPrice={format} />
            ))}
            {/* Add more */}
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-5 rounded-2xl border-2 border-dashed border-[rgba(99,149,255,0.2)] text-slate-400 text-sm font-semibold hover:border-blue-500/40 hover:text-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> Yeni Sepet Ekle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddBasketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleBasketCreated}
      />
    </>
  );
}
