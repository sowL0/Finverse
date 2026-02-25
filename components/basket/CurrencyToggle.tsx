'use client';

import type { Currency } from '@/types';

interface CurrencyToggleProps {
  value: Currency;
  onChange: (c: Currency) => void;
}

export function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
  return (
    <div className="flex items-center bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] rounded-full p-1 gap-1">
      {(['USD', 'TRY'] as Currency[]).map((cur) => (
        <button
          key={cur}
          onClick={() => onChange(cur)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
            value === cur
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {cur}
        </button>
      ))}
    </div>
  );
}
