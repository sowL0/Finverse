'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Basket } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { CurrencyToggle } from '@/components/basket/CurrencyToggle';
import { BasketCard } from '@/components/basket/BasketCard';
import { AddBasketModal } from '@/components/basket/AddBasketModal';

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

export default function BasketPage() {
  const router = useRouter();
  const { currency, setCurrency, format } = useCurrency();
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const totalValue = baskets.reduce((s, b) => s + b.totalValueUSD, 0);
  const avgChange =
    baskets.length > 0
      ? baskets.reduce((s, b) => s + b.totalChangePercent, 0) / baskets.length
      : 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Sepetlerim</h1>
          <p className="text-sm text-slate-400 mt-0.5">{baskets.length} sepet</p>
        </div>
        <div className="flex items-center gap-3">
          <CurrencyToggle value={currency} onChange={setCurrency} />
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 transition-all"
          >
            + Yeni
          </button>
        </div>
      </div>

      {/* Summary strip */}
      {baskets.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <SummaryCard label="Toplam Değer" value={format(totalValue, { compact: true })} />
          <SummaryCard
            label="Ort. Değişim"
            value={`${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`}
            valueColor={avgChange >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <SummaryCard label="Sepet Sayısı" value={baskets.length.toString()} />
        </div>
      )}

      {/* Content */}
      {baskets.length === 0 ? (
        <EmptyState onAdd={() => setModalOpen(true)} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {baskets.map((b) => (
            <BasketCard key={b.id} basket={b} formatPrice={(usd) => format(usd)} />
          ))}
        </div>
      )}

      <AddBasketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(b) => {
          setBaskets((prev) => [b, ...prev]);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
