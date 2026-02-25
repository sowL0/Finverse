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
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
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
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/post/create',
    label: 'Analiz',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
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
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#030a1c] flex items-center justify-center">
      <div className="w-full max-w-[430px] h-dvh max-h-[900px] bg-[#071330] flex flex-col relative overflow-hidden md:rounded-[40px] md:border md:border-[rgba(99,149,255,0.13)] md:shadow-[0_0_80px_rgba(0,0,0,0.7)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        <nav className="flex-shrink-0 border-t border-[rgba(99,149,255,0.1)] bg-[#071330]/95 backdrop-blur-xl">
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
    </div>
  );
}
