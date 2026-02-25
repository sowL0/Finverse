import type { AnalystLevel } from '@/types';

interface CredibilityBadgeProps {
  level: AnalystLevel;
  score: number;
  size?: 'sm' | 'md';
}

const LEVEL_CONFIG: Record<AnalystLevel, { color: string; bg: string; border: string }> = {
  Observer:        { color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  'Analyst I':     { color: 'text-blue-300',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20' },
  'Analyst II':    { color: 'text-cyan-300',   bg: 'bg-cyan-500/10',  border: 'border-cyan-500/20' },
  'Senior Analyst':{ color: 'text-yellow-300', bg: 'bg-yellow-500/10',border: 'border-yellow-500/20' },
  'Elite Analyst': { color: 'text-amber-300',  bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const LEVEL_ICON: Record<AnalystLevel, string> = {
  Observer:        '○',
  'Analyst I':     '◆',
  'Analyst II':    '◆◆',
  'Senior Analyst':'★',
  'Elite Analyst': '★★',
};

export function CredibilityBadge({ level, score, size = 'md' }: CredibilityBadgeProps) {
  const cfg = LEVEL_CONFIG[level];
  const icon = LEVEL_ICON[level];
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold border rounded-full ${cfg.color} ${cfg.bg} ${cfg.border} ${
        isSmall ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'
      }`}
    >
      <span>{icon}</span>
      <span>{level}</span>
      <span className="opacity-60">·</span>
      <span className="font-mono">{score}</span>
    </span>
  );
}
