'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, Navigation, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'home',    href: '/citizen',         icon: Home,       label: 'Home' },
  { id: 'planner', href: '/citizen/planner', icon: Navigation, label: 'Route' },
  { id: 'alerts',  href: '/citizen/alerts',  icon: Bell,       label: 'Alerts' },
  { id: 'profile', href: '/citizen/profile', icon: User,       label: 'Profile' },
];

export function CitizenBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4 pt-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none md:hidden">
      <div className="bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/citizen'
            ? pathname === '/citizen'
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative p-3 flex-1 flex flex-col items-center justify-center gap-1"
            >
              <item.icon
                className={cn('w-5 h-5 transition-colors', isActive ? 'text-emerald-400' : 'text-zinc-500')}
              />
              <span className={cn('text-[10px] font-semibold tracking-wider transition-colors', isActive ? 'text-emerald-400' : 'text-zinc-500')}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
