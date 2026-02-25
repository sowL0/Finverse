'use client';

import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/types';
import { CredibilityBadge } from '@/components/profile/CredibilityBadge';
import { ExpertBasketCard } from '@/components/profile/ExpertBasketCard';

// ── Mock data (replace with API call via React Query / fetch) ─────────────────
const MOCK_PROFILE: UserProfile = {
  id: '1',
  username: 'jordanlee',
  displayName: 'Jordan Lee',
  handle: '@jordanlee',
  bio: 'Teknoloji ve finans kesişiminde yatırım yapıyorum. Özellikle yapay zeka altyapısı, savunma teknolojisi ve kripto ekosistemini takip ediyorum. Risk yönetimi ve portföy çeşitlendirmesi odaklı yaklaşım.',
  title: 'Senior Fintech Analyst',
  location: 'İstanbul',
  age: 32,
  role: 'verified_analyst',
  analystLevel: 'Senior Analyst',
  isVerified: true,
  credibility: {
    total: 847,
    postQuality: 210,
    peerVotes: 182,
    historicalAccuracy: 295,
    engagementQuality: 128,
    reportPenalty: -2,
  },
  followerCount: 2400,
  followingCount: 318,
  basketCount: 12,
  yearlyReturn: 34.2,
  joinedAt: '2024-03-15',
  expertBaskets: [
    {
      id: 'b1',
      name: 'AI Altyapı Sepeti',
      emoji: '🚀',
      returnPercent: 47.3,
      period: 'Son 12 ay',
      assetCount: 8,
      tickers: ['NVDA', 'PLTR', 'ETH', 'MSFT'],
      isLocked: true,
    },
    {
      id: 'b2',
      name: 'Savunma & Değer',
      emoji: '💎',
      returnPercent: 22.1,
      period: 'Son 6 ay',
      assetCount: 5,
      tickers: ['LMT', 'JPM', 'BTC'],
      isLocked: true,
    },
    {
      id: 'b3',
      name: 'Bear Market Hedge',
      emoji: '🛡️',
      returnPercent: -3.8,
      period: 'Son 3 ay',
      assetCount: 4,
      tickers: ['GLD', 'BTC', 'JNJ'],
      isLocked: true,
    },
  ],
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex-1 py-3 text-center border-r border-[rgba(99,149,255,0.1)] last:border-r-0">
      <p className={`font-mono text-base font-bold ${valueColor ?? 'text-white'}`}>{value}</p>
      <p className="text-[9px] uppercase tracking-[1.5px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

// ── Credibility breakdown bar ──────────────────────────────────────────────────
function CredibilityBar({ label, value, max, color }: {
  label: string; value: number; max: number; color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-semibold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role, isVerified }: { role: UserProfile['role']; isVerified: boolean }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
        ⭐ Admin
      </span>
    );
  }
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-purple-400 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
        🎓 Uzman
      </span>
    );
  }
  return null;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
interface ProfilePageProps {
  /** In production: fetch profile by username from API */
  profile?: UserProfile;
}

export default function ProfilePage({ profile = MOCK_PROFILE }: ProfilePageProps) {
  const router = useRouter();
  const cred = profile.credibility;

  const formatFollowers = (n: number) =>
    n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString();

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Back + title bar ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-[#0c1a42] border border-[rgba(99,149,255,0.15)] flex items-center justify-center text-white text-lg hover:border-blue-500/40 transition-all"
          aria-label="Geri"
        >
          ←
        </button>
        <span className="text-sm text-slate-400 font-semibold">Profil</span>
        <div className="w-9" />
      </div>

      {/* ── Hero background ── */}
      <div className="bg-gradient-to-b from-[#0d2060] to-transparent px-5 pb-5">

        {/* Avatar + info */}
        <div className="flex gap-4 items-start mb-5">
          <div className="relative flex-shrink-0">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-700 to-blue-500 border-[3px] border-blue-400/40 flex items-center justify-center text-2xl font-extrabold">
              {profile.displayName.slice(0, 2).toUpperCase()}
            </div>
            {/* Online dot */}
            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#071330]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h2 className="text-xl font-extrabold tracking-tight">{profile.displayName}</h2>
              <RoleBadge role={profile.role} isVerified={profile.isVerified} />
            </div>
            <p className="text-sm text-slate-400 mb-1">{profile.handle}</p>
            <p className="text-xs text-blue-400 font-semibold mb-2">{profile.title}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>📍 {profile.location}</span>
              {profile.age && <span>· {profile.age} yaş</span>}
              <span>· {new Date(profile.joinedAt).getFullYear()} üye</span>
            </div>
          </div>
        </div>

        {/* Credibility badge */}
        <div className="mb-4">
          <CredibilityBadge level={profile.analystLevel} score={cred.total} />
        </div>

        {/* Stats row */}
        <div className="bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-2xl flex overflow-hidden">
          <StatCard label="Takipçi" value={formatFollowers(profile.followerCount)} />
          <StatCard label="Takip" value={profile.followingCount.toString()} />
          <StatCard label="Sepet" value={profile.basketCount.toString()} />
          <StatCard
            label="Yıllık"
            value={`+${profile.yearlyReturn.toFixed(0)}%`}
            valueColor="text-green-400"
          />
        </div>
      </div>

      {/* ── Bio ── */}
      <div className="mx-4 mb-5 bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-2xl px-4 py-3.5">
        <p className="text-[13px] text-slate-300 leading-relaxed">{profile.bio}</p>
      </div>

      {/* ── Credibility breakdown ── */}
      <div className="mx-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Güvenilirlik Skoru</h3>
          <span className="font-mono text-lg font-extrabold text-white">{cred.total} <span className="text-slate-500 text-sm font-normal">/ 1000</span></span>
        </div>

        {/* Score ring (simple progress) */}
        <div className="bg-[#0c1a42] border border-[rgba(99,149,255,0.13)] rounded-2xl p-4">
          <div className="h-2 bg-white/5 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
              style={{ width: `${(cred.total / 1000) * 100}%` }}
            />
          </div>
          <CredibilityBar label="Post Kalitesi" value={cred.postQuality} max={250} color="#3b82f6" />
          <CredibilityBar label="Peer Oyları" value={cred.peerVotes} max={200} color="#6366f1" />
          <CredibilityBar label="Tahmin Doğruluğu" value={cred.historicalAccuracy} max={350} color="#22c55e" />
          <CredibilityBar label="Etkileşim Kalitesi" value={cred.engagementQuality} max={150} color="#f59e0b" />
          {cred.reportPenalty < 0 && (
            <div className="mt-1 text-[11px] text-red-400 flex justify-between">
              <span>Ceza (Raporlar)</span>
              <span className="font-mono font-semibold">{cred.reportPenalty}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Expert baskets ── */}
      <div className="mx-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Uzman Sepetleri</h3>
          <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
            🔒 Premium
          </span>
        </div>
        <p className="text-[12px] text-slate-500 mb-3">
          Sepet içerikleri abonelik ile görünür hale gelecek.
        </p>
        <div className="flex flex-col gap-3">
          {profile.expertBaskets.map((basket) => (
            <ExpertBasketCard key={basket.id} basket={basket} />
          ))}
        </div>
      </div>

      {/* ── Follow / Subscribe CTA ── */}
      <div className="mx-4 mt-5 flex gap-3">
        <button className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 transition-all">
          Takip Et
        </button>
        <button className="flex-1 py-3.5 rounded-2xl border border-amber-500/40 bg-amber-500/8 text-amber-300 text-sm font-bold hover:bg-amber-500/15 transition-all">
          🔒 Premium Üye Ol
        </button>
      </div>
    </div>
  );
}
