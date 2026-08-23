'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Map as MapIcon, 
  Settings, 
  ShieldAlert,
  Navigation,
  BellRing,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DotPattern } from '@/components/ui/dot-pattern';
import { useAuthStore } from '@/stores/auth-store';
import { useMapStore } from '@/stores/map-store';

export function CitizenLayoutSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const citizenLocation = useMapStore(state => state.citizenLocation);

  const navItems = [
    { name: 'Live Map', href: '/citizen', icon: MapIcon },
    { name: 'Alerts', href: '/citizen/alerts', icon: BellRing },
    { name: 'Profile', href: '/citizen/profile', icon: User },
  ];

  const getIsActive = (href: string) => {
    if (href === '/citizen') {
      return pathname === '/citizen' || pathname === '/citizen/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-full w-[260px] flex-col bg-black text-white border-r border-[#1a253a] shadow-xl font-sans overflow-hidden relative">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1.5}
        className={cn(
          'text-white/40 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
        )}
      />

      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#1a253a] relative z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-emerald-500" />
          <span className="font-bold tracking-widest text-white text-lg uppercase">
            CROWD<span className="text-emerald-500">SHIELD</span>
          </span>
        </div>
        {/* Explicit Close Button for Mobile PWA */}
        <button 
          onClick={() => {
            // Dispatch a click to the hidden shadcn close button if on mobile, or just rely on state
            const closeBtn = document.querySelector('[data-state="open"] > button') as HTMLButtonElement;
            if (closeBtn) closeBtn.click();
          }}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
        >
          <span className="sr-only">Close</span>
          &times;
        </button>
      </div>

      {/* GPS status badge */}
      {citizenLocation && (
        <div className="mx-4 mt-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 relative z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase">GPS Active</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 py-5 gap-6 relative z-10">
        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 -mx-2">
          <div className="mb-2 px-4 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Public Dashboard
          </div>
          {navItems.map((item) => {
            const isActive = getIsActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-all backdrop-blur-sm',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-emerald-400' : 'text-zinc-400')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Info card */}
        <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 p-4 space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">How it works</p>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Live crowd density on map
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Plan safe routes avoiding congestion
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Get real-time emergency alerts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">!</span>
              Use SOS button for emergency
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-[#1a253a] flex flex-col gap-1 relative z-10">
        <Link href="/settings" className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
