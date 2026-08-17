'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Map, ShieldAlert, BarChart3, Settings, LogOut, CheckSquare, Radio, FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuthStore();

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
    } else if (role === 'EVENT_OWNER') {
      base.push({ name: 'Event Management', href: '/owner', icon: Map });
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


      {role === 'POLICE' && (
        <div className="p-4 border-t border-zinc-800 bg-black/20">
          <div className="mb-3 px-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            TACTICAL CONTROLS
          </div>
          <div className="flex flex-col gap-2">
            <button className="w-full group relative flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-3 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <ShieldAlert className="h-5 w-5 animate-pulse" />
              EMERGENCY SOS
            </button>
            <button className="w-full flex items-center gap-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-2.5 text-sm font-semibold text-amber-500 transition-colors">
              <Radio className="h-4 w-4" />
              Request Backup
            </button>
            <button className="w-full flex items-center gap-2 rounded-lg hover:bg-zinc-800/50 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              <FileWarning className="h-4 w-4" />
              Report Incident
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
