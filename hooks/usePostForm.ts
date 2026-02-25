'use client';

import { useState, useCallback } from 'react';
import type {
  PostFormData,
  PostFormErrors,
  AIQualityResult,
  PostDirection,
  TimeHorizon,
} from '@/types/post';

const EMPTY_FORM: PostFormData = {
  ticker: '',
  assetName: '',
  assetType: 'stock',
  direction: '' as PostDirection,
  thesis: '',
  supportingData: '',
  risks: '',
  counterarguments: '',
  conclusion: '',
  timeHorizon: '' as TimeHorizon,
  priceTarget: '',
};

// ── Validation ────────────────────────────────────────────────────────────────
function validate(data: PostFormData): PostFormErrors {
  const errors: PostFormErrors = {};

  if (!data.ticker) errors.ticker = 'Bir varlık seçmelisiniz';
  if (!data.direction) errors.direction = 'Bir yön seçmelisiniz';
  if (!data.thesis || data.thesis.trim().length < 100)
    errors.thesis = `Tez en az 100 karakter olmalı (şu an: ${data.thesis.trim().length})`;
  if (!data.supportingData || data.supportingData.trim().length < 50)
    errors.supportingData = `Destekleyici veri en az 50 karakter olmalı`;
  if (!data.risks || data.risks.trim().length < 50)
    errors.risks = 'Risk analizi zorunludur — en az 50 karakter';
  if (!data.conclusion || data.conclusion.trim().length < 30)
    errors.conclusion = 'Sonuç kısmı en az 30 karakter olmalı';
  if (!data.timeHorizon) errors.timeHorizon = 'Zaman ufku seçmelisiniz';

  return errors;
}

// ── Simulated AI quality check (replace with real API call) ──────────────────
async function runAIQualityCheck(data: PostFormData): Promise<AIQualityResult> {
  await new Promise((r) => setTimeout(r, 1400)); // simulate network

  const thesisLen = data.thesis.trim().length;
  const hasData = data.supportingData.trim().length > 100;
  const hasRisks = data.risks.trim().length > 80;
  const hasCounter = data.counterarguments.trim().length > 50;
  const hasPriceTarget = !!data.priceTarget;

  let score = 40;
  if (thesisLen > 200) score += 15;
  if (thesisLen > 400) score += 10;
  if (hasData) score += 15;
  if (hasRisks) score += 10;
  if (hasCounter) score += 5;
  if (hasPriceTarget) score += 5;
  score = Math.min(100, score);

  const suggestions: string[] = [];
  if (thesisLen < 200) suggestions.push('Tezinizi daha ayrıntılı açıklayın (200+ karakter hedefleyin)');
  if (!hasData) suggestions.push('Veri kaynakları veya finansal metrikler ekleyin');
  if (!hasCounter) suggestions.push('Karşı argüman eklemek güvenilirliğinizi artırır');
  if (!hasPriceTarget) suggestions.push('Fiyat hedefi eklemek tahmin takibini mümkün kılar');

  return {
    score,
    isAcceptable: score >= 50,
    feedback:
      score >= 80
        ? 'Mükemmel analiz! Yüksek kaliteli bir gönderi.'
        : score >= 60
        ? 'İyi analiz. Birkaç iyileştirme yapılabilir.'
        : score >= 50
        ? 'Kabul edilebilir, ancak daha güçlü olabilir.'
        : 'Analiz yetersiz. Lütfen önerileri dikkate alın.',
    suggestions,
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function usePostForm() {
  const [form, setForm] = useState<PostFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<PostFormErrors>({});
  const [aiResult, setAiResult] = useState<AIQualityResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=ticker+dir, 2=content, 3=review

  const update = useCallback(<K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    // Reset AI result when content changes
    if (['thesis', 'supportingData', 'risks', 'conclusion'].includes(key)) {
      setAiResult(null);
    }
  }, []);

  const goToStep2 = useCallback(() => {
    const errs: PostFormErrors = {};
    if (!form.ticker) errs.ticker = 'Bir varlık seçmelisiniz';
    if (!form.direction) errs.direction = 'Bir yön seçmelisiniz';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  }, [form]);

  const goToReview = useCallback(async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStep(3);
    setAiLoading(true);
    try {
      const result = await runAIQualityCheck(form);
      setAiResult(result);
    } finally {
      setAiLoading(false);
    }
  }, [form]);

  const submit = useCallback(async () => {
    if (!aiResult?.isAcceptable) return;
    setSubmitting(true);
    // TODO: replace with real API call
    // await api.post('/posts', { ...form, qualityScore: aiResult.score });
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  }, [form, aiResult]);

  const reset = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    setAiResult(null);
    setStep(1);
    setSubmitted(false);
  }, []);

  // Character counts
  const charCounts = {
    thesis: form.thesis.trim().length,
    supportingData: form.supportingData.trim().length,
    risks: form.risks.trim().length,
    counterarguments: form.counterarguments.trim().length,
    conclusion: form.conclusion.trim().length,
  };

  // Overall form completion %
  const completion = Math.round(
    ([
      form.ticker ? 1 : 0,
      form.direction ? 1 : 0,
      charCounts.thesis >= 100 ? 1 : 0,
      charCounts.supportingData >= 50 ? 1 : 0,
      charCounts.risks >= 50 ? 1 : 0,
      charCounts.conclusion >= 30 ? 1 : 0,
      form.timeHorizon ? 1 : 0,
    ].reduce((a, b) => a + b, 0) /
      7) *
      100
  );

  return {
    form, update, errors,
    step, goToStep2, goToReview, reset,
    aiResult, aiLoading,
    submitting, submitted, submit,
    charCounts, completion,
  };
}
