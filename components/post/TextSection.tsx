'use client';

interface TextSectionProps {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  minChars: number;
  maxChars?: number;
  hint?: string;
  error?: string;
  rows?: number;
  tag?: string;
  tagColor?: string;
}

export function TextSection({
  label, required, placeholder, value, onChange,
  minChars, maxChars = 2000, hint, error, rows = 4, tag, tagColor,
}: TextSectionProps) {
  const count = value.trim().length;
  const meetsMin = count >= minChars;
  const pct = Math.min(100, (count / minChars) * 100);

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {tag && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${tagColor ?? 'bg-blue-500/10 text-blue-300'}`}>
            {tag}
          </span>
        )}
      </div>

      {/* Hint */}
      {hint && (
        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{hint}</p>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxChars}
        className={`w-full bg-[#0c1a42] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors resize-none leading-relaxed ${
          error
            ? 'border-red-500/40 focus:border-red-500'
            : meetsMin
            ? 'border-green-500/30 focus:border-green-500/60'
            : 'border-[rgba(99,149,255,0.15)] focus:border-blue-500'
        }`}
      />

      {/* Footer: progress + char count */}
      <div className="flex items-center gap-3 mt-1.5">
        {/* Mini progress bar */}
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              meetsMin ? 'bg-green-500' : pct > 60 ? 'bg-blue-500' : 'bg-slate-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-[10px] font-mono font-semibold whitespace-nowrap ${
          meetsMin ? 'text-green-400' : 'text-slate-500'
        }`}>
          {count} / {minChars}
          {meetsMin && ' ✓'}
        </span>
      </div>

      {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
    </div>
  );
}
