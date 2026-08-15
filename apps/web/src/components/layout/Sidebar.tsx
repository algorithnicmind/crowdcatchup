'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Map, ShieldAlert, BarChart3, Settings, LogOut, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const role = user?.role || 'CITIZEN';

  // Define links based on role
  const links = React.useMemo(() => {
    const base = [];

    if (role === 'AUTHORITY') {
      base.push({ name: 'Command Center', href: '/authority', icon: BarChart3 });
      base.push({ name: 'Live Map', href: '/map-demo', icon: Map });
    } else if (role === 'POLICE') {
      base.push({ name: 'Live Map & Tasks', href: '/police', icon: CheckSquare });
    } else if (role === 'CITIZEN') {
      base.push({ name: 'Live Map', href: '/citizen', icon: Map });
    } else {
      base.push({ name: 'Live Map', href: '/map-demo', icon: Map });
    }

    base.push({ name: 'Settings', href: '/settings', icon: Settings });
    return base;
  }, [role]);

  return (
    <div className="flex h-full w-[260px] flex-col border-r border-zinc-800 bg-zinc-950 text-white shadow-xl backdrop-blur-xl">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="font-bold tracking-wider text-lg">CROWD<span className="text-emerald-500">SHIELD</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        <div className="mb-4 px-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          {role} DASHBOARD
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-zinc-800/50">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
