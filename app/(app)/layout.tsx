'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const NAV_ITEMS = [
  {
    href: '/feed',
    label: 'Akış',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/baskets',
    label: 'Sepetler',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/post/create',
    label: 'Analiz Yaz',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#030a1c] text-white">

      {/* ── Masaüstü: sol sidebar nav ── */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col border-r border-[rgba(99,149,255,0.13)] bg-[#071330] z-40 px-4 py-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d2060]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="4" height="12" rx="1" fill="white" opacity="0.9"/>
              <rect x="7" y="6" width="4" height="9" rx="1" fill="white" opacity="0.7"/>
              <rect x="12" y="1" width="4" height="14" rx="1" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">Finverse</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon(active)}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Sayfa içeriği ── */}
      <div className="md:ml-56 min-h-screen flex flex-col pb-20 md:pb-0">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 flex-1">
          {children}
        </div>
      </div>

      {/* ── Mobil: alt nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(99,149,255,0.1)] bg-[#071330]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {item.icon(active)}
                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                  active ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
