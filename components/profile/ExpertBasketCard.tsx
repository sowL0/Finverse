import type { ExpertBasket } from '@/types';

interface ExpertBasketCardProps {
  basket: ExpertBasket;
}

export function ExpertBasketCard({ basket }: ExpertBasketCardProps) {
  const isPositive = basket.returnPercent >= 0;

  return (
    <div className="relative bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-2xl p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[14px] font-bold">
            {basket.emoji} {basket.name}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {basket.assetCount} varlık
          </p>
        </div>
        {basket.isLocked && (
          <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
            🔒 Premium
          </span>
        )}
      </div>

      {/* Return */}
      <p className={`font-mono text-3xl font-extrabold mb-0.5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{basket.returnPercent.toFixed(1)}%
      </p>
      <p className="text-[11px] text-slate-500 mb-3">{basket.period} getirisi</p>

      {/* Tickers */}
      <div className="flex flex-wrap gap-1.5">
        {basket.tickers.map((t) => (
          <span
            key={t}
            className="font-mono text-[11px] font-semibold bg-blue-500/8 border border-blue-500/15 text-blue-300 px-2 py-0.5 rounded-md"
          >
            {t}
          </span>
        ))}
        {basket.assetCount > basket.tickers.length && (
          <span className="font-mono text-[11px] text-slate-500 px-2 py-0.5">
            +{basket.assetCount - basket.tickers.length}
          </span>
        )}
      </div>

      {/* Lock overlay */}
      {basket.isLocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c1a42]/95 rounded-2xl flex items-end p-4 pointer-events-none">
          <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
            🔒 Premium üyelikle sepet içeriğini gör
          </p>
        </div>
      )}
    </div>
  );
}
