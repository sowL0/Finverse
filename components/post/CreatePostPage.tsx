'use client';

import { useRouter } from 'next/navigation';
import { usePostForm } from '@/hooks/usePostForm';
import { TickerSearch } from '@/components/post/TickerSearch';
import { TextSection } from '@/components/post/TextSection';
import { AIQualityPanel } from '@/components/post/AIQualityPanel';
import { PostReviewCard } from '@/components/post/PostReviewCard';
import type { TimeHorizon } from '@/types/post';

const TIME_HORIZONS: { value: TimeHorizon; label: string; sub: string }[] = [
  { value: 'SHORT',  label: 'Kısa Vade',  sub: '< 3 ay'   },
  { value: 'MEDIUM', label: 'Orta Vade',  sub: '3–12 ay'  },
  { value: 'LONG',   label: 'Uzun Vade',  sub: '1+ yıl'   },
];

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ current, completion }: { current: 1 | 2 | 3; completion: number }) {
  const steps = ['Varlık & Yön', 'Analiz', 'İnceleme'];
  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-2 mb-3">
        {steps.map((s, i) => {
          const idx = i + 1;
          const done = current > idx;
          const active = current === idx;
          return (
            <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all ${
                done   ? 'bg-green-500 text-white' :
                active ? 'bg-blue-600 text-white ring-2 ring-blue-500/30' :
                         'bg-white/5 text-slate-500'
              }`}>
                {done ? '✓' : idx}
              </div>
              <span className={`text-[11px] font-semibold whitespace-nowrap ${
                active ? 'text-white' : done ? 'text-green-400' : 'text-slate-500'
              }`}>{s}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-white/5 mx-1" />
              )}
            </div>
          );
        })}
      </div>
      {/* Completion bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${completion}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-500 mt-1 text-right">{completion}% tamamlandı</p>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ onReset, onFeed }: { onReset: () => void; onFeed: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-5">🎉</div>
      <h2 className="text-2xl font-extrabold mb-2">Analiz Yayınlandı!</h2>
      <p className="text-sm text-slate-400 leading-relaxed mb-8">
        Analizin feed'e düştü. Topluluk değerlendirecek ve güvenilirlik skorun güncellenecek.
      </p>
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onFeed}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-700/30"
        >
          Feed'e Git
        </button>
        <button
          onClick={onReset}
          className="w-full py-4 rounded-2xl border border-[rgba(99,149,255,0.2)] text-slate-300 text-sm font-semibold hover:border-blue-500/30 transition-all"
        >
          Yeni Analiz Yaz
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreatePostPage() {
  const router = useRouter();
  const {
    form, update, errors,
    step, goToStep2, goToReview, reset,
    aiResult, aiLoading,
    submitting, submitted, submit,
    charCounts, completion,
  } = usePostForm();

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuccessScreen onReset={reset} onFeed={() => router.push('/feed')} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <button
          onClick={() => (step === 1 ? router.back() : update('thesis', form.thesis))}
          className="w-9 h-9 rounded-xl bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] flex items-center justify-center text-white hover:border-blue-500/40 transition-all"
        >
          {step === 1 ? '←' : '←'}
        </button>
        <h1 className="text-base font-extrabold">Analiz Yaz</h1>
        <div className="w-9" />
      </div>

      {/* ── Step bar ── */}
      <div className="flex-shrink-0 pt-2">
        <StepBar current={step} completion={completion} />
      </div>

      {/* ── Scrollable form body ── */}
      <div className="flex-1 overflow-y-auto pb-6 px-5 space-y-5">

        {/* ══ STEP 1: Ticker + Direction ══ */}
        {step === 1 && (
          <>
            <TickerSearch
              selectedTicker={form.ticker}
              selectedName={form.assetName}
              direction={form.direction}
              onSelectTicker={(symbol, name, type) => {
                update('ticker', symbol);
                update('assetName', name);
                update('assetType', type);
              }}
              onSelectDirection={(d) => update('direction', d)}
              tickerError={errors.ticker}
              directionError={errors.direction}
            />

            <button
              onClick={goToStep2}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 hover:shadow-blue-700/50 transition-all"
            >
              Devam Et →
            </button>
          </>
        )}

        {/* ══ STEP 2: Content sections ══ */}
        {step === 2 && (
          <>
            {/* Ticker reminder */}
            <div className="flex items-center gap-2 bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-xl px-4 py-2.5">
              <span className="font-mono font-bold text-blue-300 text-sm">{form.ticker}</span>
              <span className="text-slate-500 text-xs">·</span>
              <span className={`text-xs font-bold ${
                form.direction === 'BULL' ? 'text-green-400' :
                form.direction === 'BEAR' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {form.direction === 'BULL' ? '🐂 Boğa' : form.direction === 'BEAR' ? '🐻 Ayı' : '⚖️ Nötr'} Analiz
              </span>
            </div>

            {/* Thesis */}
            <TextSection
              label="Tez"
              required
              placeholder="Neden bu pozisyonu alıyorsunuz? Temel argümanınızı açıklayın. Şirketin rekabet avantajı, büyüme hikayesi, değerleme anomalisi nedir?"
              value={form.thesis}
              onChange={(v) => update('thesis', v)}
              minChars={100}
              hint="Ana yatırım tezinizi net ve spesifik olarak yazın."
              error={errors.thesis}
              rows={5}
              tag="Min 100 karakter"
            />

            {/* Supporting data */}
            <TextSection
              label="Destekleyici Veri"
              required
              placeholder="Gelir büyümesi, marj trendi, P/E oranı, sektör karşılaştırması, analist hedefleri, teknik seviyeler..."
              value={form.supportingData}
              onChange={(v) => update('supportingData', v)}
              minChars={50}
              hint="Somut veriler, metrikler ve kaynaklar ekleyin."
              error={errors.supportingData}
              rows={4}
              tag="Min 50 karakter"
            />

            {/* Risks */}
            <TextSection
              label="Riskler"
              required
              placeholder="Bu tezin yanlış çıkmasına neden olabilecek faktörler neler? Makro risk, rekabet, regülasyon, bilanço riski..."
              value={form.risks}
              onChange={(v) => update('risks', v)}
              minChars={50}
              hint="Dürüst risk analizi güvenilirliğinizi artırır."
              error={errors.risks}
              rows={4}
              tag="Zorunlu"
              tagColor="bg-red-500/10 text-red-300"
            />

            {/* Counterarguments (optional) */}
            <TextSection
              label="Karşı Argümanlar"
              placeholder="Karşı görüşü savunanların en güçlü argümanı nedir?"
              value={form.counterarguments}
              onChange={(v) => update('counterarguments', v)}
              minChars={0}
              hint="Opsiyonel — ama güvenilirlik skorunuzu artırır."
              rows={3}
              tag="Opsiyonel"
              tagColor="bg-slate-500/10 text-slate-400"
            />

            {/* Conclusion */}
            <TextSection
              label="Sonuç"
              required
              placeholder="Kısa özet ve aksiyon öneriniz. 'Bu nedenle X yapıyorum / öneririm...'"
              value={form.conclusion}
              onChange={(v) => update('conclusion', v)}
              minChars={30}
              error={errors.conclusion}
              rows={3}
            />

            {/* Time horizon */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[2px] text-slate-400 mb-2">
                Zaman Ufku <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_HORIZONS.map((h) => {
                  const active = form.timeHorizon === h.value;
                  return (
                    <button
                      key={h.value}
                      onClick={() => update('timeHorizon', h.value)}
                      className={`py-3 rounded-xl border text-center transition-all ${
                        active
                          ? 'bg-blue-600/20 border-blue-500/40 text-white'
                          : 'bg-[#0c1a42] border-[rgba(99,149,255,0.13)] text-slate-400 hover:border-blue-500/25'
                      }`}
                    >
                      <p className="text-[12px] font-bold">{h.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{h.sub}</p>
                    </button>
                  );
                })}
              </div>
              {errors.timeHorizon && (
                <p className="text-red-400 text-[11px] mt-1.5">{errors.timeHorizon}</p>
              )}
            </div>

            {/* Price target (optional) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[2px] text-slate-400 mb-2">
                Fiyat Hedefi <span className="text-slate-600 text-[9px] font-normal normal-case tracking-normal">(opsiyonel — tahmin takibi için)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.priceTarget}
                  onChange={(e) => update('priceTarget', e.target.value)}
                  placeholder="örn. 150.00"
                  className="w-full bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={goToReview}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 transition-all"
            >
              AI Kontrolü & İncele →
            </button>
          </>
        )}

        {/* ══ STEP 3: Review + AI + Submit ══ */}
        {step === 3 && (
          <>
            {/* AI panel */}
            <AIQualityPanel loading={aiLoading} result={aiResult} />

            {!aiLoading && (
              <>
                {/* Preview */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400 mb-3">
                    Önizleme
                  </p>
                  <PostReviewCard form={form} />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={submit}
                    disabled={!aiResult?.isAcceptable || submitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Yayınlanıyor...
                      </span>
                    ) : (
                      '🚀 Analizi Yayınla'
                    )}
                  </button>

                  <button
                    onClick={() => {
                      // Go back to step 2 to edit
                      (usePostForm as unknown as { step: number }).step === 3 && null;
                      window.history.back();
                    }}
                    className="w-full py-3.5 rounded-2xl border border-[rgba(99,149,255,0.15)] text-slate-400 text-sm font-semibold hover:border-blue-500/30 hover:text-white transition-all"
                  >
                    ← Düzenle
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
