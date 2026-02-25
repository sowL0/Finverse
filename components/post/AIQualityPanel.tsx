'use client';

import type { AIQualityResult } from '@/types/post';

interface AIQualityPanelProps {
  loading: boolean;
  result: AIQualityResult | null;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? '#22c55e' :
    score >= 60 ? '#3b82f6' :
    score >= 50 ? '#f59e0b' : '#ef4444';

  const label =
    score >= 80 ? 'Mükemmel' :
    score >= 60 ? 'İyi' :
    score >= 50 ? 'Kabul edilebilir' : 'Yetersiz';

  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="28" fill="none"
            stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-extrabold text-lg text-white leading-none">{score}</span>
          <span className="text-[8px] text-slate-400 uppercase">/100</span>
        </div>
      </div>
      <div>
        <p className="font-bold text-base" style={{ color }}>{label}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-[180px]">
          AI Kalite Değerlendirmesi
        </p>
      </div>
    </div>
  );
}

export function AIQualityPanel({ loading, result }: AIQualityPanelProps) {
  if (loading) {
    return (
      <div className="bg-[#0c1a42] border border-blue-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-blue-300">AI analiz değerlendiriyor...</p>
        </div>
        <div className="space-y-2">
          {[60, 80, 45].map((w, i) => (
            <div key={i} className="h-3 rounded-full bg-white/5 animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isGood = result.isAcceptable;

  return (
    <div className={`border rounded-2xl p-5 ${
      isGood
        ? 'bg-[#0c1a42] border-blue-500/20'
        : 'bg-red-950/20 border-red-500/20'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🤖</span>
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400">
          AI Kalite Kontrolü
        </p>
      </div>

      {/* Score ring */}
      <ScoreRing score={result.score} />

      {/* Feedback */}
      <p className="text-sm text-slate-300 mt-4 leading-relaxed">{result.feedback}</p>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Öneriler</p>
          {result.suggestions.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">→</span>
              <p className="text-xs text-slate-400 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      )}

      {/* Block message */}
      {!isGood && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
          <p className="text-xs text-red-300 font-semibold">
            ⚠️ Analiz yayınlanmak için yeterli kalitede değil. Lütfen önerileri uygulayın.
          </p>
        </div>
      )}
    </div>
  );
}
