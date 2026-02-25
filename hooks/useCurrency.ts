import { useState, useCallback } from 'react';
import type { Currency } from '@/types';

const USD_TO_TRY = 32.57;

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('USD');

  const format = useCallback(
    (usd: number, opts?: { compact?: boolean }): string => {
      if (currency === 'TRY') {
        const tryValue = usd * USD_TO_TRY;
        if (opts?.compact && tryValue >= 1_000_000)
          return '₺' + (tryValue / 1_000_000).toFixed(1) + 'M';
        if (opts?.compact && tryValue >= 1_000)
          return '₺' + (tryValue / 1_000).toFixed(1) + 'K';
        return '₺' + tryValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
      }
      if (opts?.compact && usd >= 1_000_000)
        return '$' + (usd / 1_000_000).toFixed(1) + 'M';
      if (opts?.compact && usd >= 1_000)
        return '$' + (usd / 1_000).toFixed(1) + 'K';
      return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    [currency]
  );

  const toggle = useCallback(() => {
    setCurrency((c) => (c === 'USD' ? 'TRY' : 'USD'));
  }, []);

  return { currency, setCurrency, format, toggle, rate: USD_TO_TRY };
}
