'use client';

import type { PostFormData } from '@/types/post';

interface PostReviewCardProps {
  form: PostFormData;
}

const DIRECTION_CONFIG = {
  BULL:    { label: 'Boğa',  emoji: '🐂', color: 'text-green-300', bg: 'bg-green-500/10', border: 'border-green-500/25' },
  BEAR:    { label: 'Ayı',   emoji: '🐻', color: 'text-red-300',   bg: 'bg-red-500/10',   border: 'border-red-500/25'   },
  NEUTRAL: { label: 'Nötr',  emoji: '⚖️', color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/25' },
};

const HORIZON_LABEL: Record<string, string> = {
  SHORT:  'Kısa Vade (<3 ay)',
  MEDIUM: 'Orta Vade (3–12 ay)',
  LONG:   'Uzun Vade (1+ yıl)',
};

function ReviewSection({ label, content, tag }: { label: string; content: string; tag?: string }) {
  return (
    <div className="border-b border-[rgba(99,149,255,0.08)] pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">{label}</p>
        {tag && (
          <span className="text-[9px] bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase">
            {tag}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export function PostReviewCard({ form }: PostReviewCardProps) {
  const dir = form.direction ? DIRECTION_CONFIG[form.direction] : null;

  return (
    <div className="bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-[rgba(99,149,255,0.08)] flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-extrabold text-lg text-white">{form.ticker}</span>
            {dir && (
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${dir.color} ${dir.bg} ${dir.border}`}>
                {dir.emoji} {dir.label}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{form.assetName}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {form.priceTarget && (
            <p className="font-mono text-sm font-bold text-white">${form.priceTarget}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-0.5">
            {form.timeHorizon ? HORIZON_LABEL[form.timeHorizon] : ''}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="px-5 py-4 space-y-4">
        <ReviewSection label="Tez" content={form.thesis} />
        <ReviewSection label="Destekleyici Veri" content={form.supportingData} />
        <ReviewSection label="Riskler" content={form.risks} tag="Zorunlu" />
        {form.counterarguments && (
          <ReviewSection label="Karşı Argümanlar" content={form.counterarguments} tag="Opsiyonel" />
        )}
        <ReviewSection label="Sonuç" content={form.conclusion} />
      </div>
    </div>
  );
}
