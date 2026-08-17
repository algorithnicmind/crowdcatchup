'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  ClipboardList, 
  Target, 
  History, 
  HelpCircle, 
  Settings,
  AlertCircle,
  Shield,
  Asterisk,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function PoliceSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/police', icon: LayoutGrid },
    { name: 'Map View', href: '/police/map', icon: MapIcon },
    { name: 'Active Tasks', href: '/police/tasks', icon: ClipboardList },
    { name: 'Unit Radar', href: '/police/radar', icon: Target },
    { name: 'Incident Logs', href: '/police/logs', icon: History },
  ];

  // Active state logic to keep Dashboard highlighted on root /police
  const getIsActive = (href: string) => {
    if (href === '/police') {
      return pathname === '/police' || pathname === '/police/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-full w-[260px] flex-col bg-[#0A111E] text-white border-r border-[#1a253a] shadow-xl font-sans overflow-hidden">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#1a253a]">
        <span className="font-bold tracking-widest text-[#00E5FF] text-lg uppercase">CROWDSHIELD</span>
        <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 p-1.5 rounded">
          <LayoutDashboard className="h-4 w-4 text-[#00E5FF]" />
          <span className="text-[#00E5FF] text-[10px] font-bold">Dashboard</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 py-5 gap-6">
        
        {/* Profile Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md border border-[#00E5FF]/30 overflow-hidden bg-black/50 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              {/* Replace with actual image later, using a solid fallback or gradient for now */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center opacity-70" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">Officer-4</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]" />
                <span className="text-[#00E5FF] text-[10px] font-bold tracking-wider">Status: Patrol</span>
              </div>
            </div>
          </div>
          {/* Toggle Switch */}
          <div className="w-9 h-5 bg-[#1F2937] rounded-full relative cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
          </div>
        </div>

        {/* Tactical Buttons */}
        <div className="flex flex-col gap-3">
          {/* SOS Button */}
          <button 
            onClick={() => toast({ title: 'EMERGENCY SOS SIGNAL BROADCASTED', description: 'All nearby units and command have been alerted.', variant: 'destructive' })}
            className="w-full relative flex flex-col items-center justify-center gap-1.5 rounded-md bg-gradient-to-b from-[#3a0a1a] to-[#250810] border border-[#E11D48]/20 py-4 shadow-[inset_0_0_20px_rgba(225,29,72,0.1),_0_0_15px_rgba(225,29,72,0.15)] hover:bg-[#320b15] hover:border-[#E11D48]/40 transition-all cursor-pointer group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[#E11D48]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Asterisk className="h-6 w-6 text-[#E11D48]" />
            <span className="text-[#E11D48] text-[10px] font-bold tracking-widest uppercase font-sans">SOS EMERGENCY</span>
          </button>

          {/* Quick Actions (Row) */}
          <div className="flex gap-3">
            <button 
              onClick={() => toast({ title: 'INCIDENT REPORT INITIATED', description: 'Opening rapid report interface...' })}
              className="flex-1 flex flex-col items-center justify-center gap-2 rounded-md bg-[#121827] border border-transparent hover:border-[#EAB308]/20 py-3 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-6 h-6 rounded-full border border-[#EAB308] flex items-center justify-center mb-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-[#EAB308]" />
              </div>
              <span className="text-[#EAB308] text-[9px] font-bold tracking-wider font-sans">Incident</span>
            </button>
            <button 
              onClick={() => toast({ title: 'BACKUP REQUESTED', description: 'Authority Command has been notified of your request.' })}
              className="flex-1 flex flex-col items-center justify-center gap-2 rounded-md bg-[#121827] border border-transparent hover:border-[#00E5FF]/20 py-3 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-6 h-6 rounded-full border border-[#00E5FF] flex items-center justify-center mb-0.5">
                <Shield className="h-3.5 w-3.5 text-[#00E5FF]" />
              </div>
              <span className="text-[#00E5FF] text-[9px] font-bold tracking-wider font-sans">Backup</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 -mx-2">
          {navItems.map((item) => {
            const isActive = getIsActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-all",
                  isActive 
                    ? "bg-[#00E5FF]/10 text-[#00E5FF]" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#00E5FF]" : "text-zinc-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Current Objective HUD */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-500 font-black text-[10px]">!</span>
            <span className="text-zinc-500 font-bold text-[9px] tracking-widest uppercase">CURRENT OBJECTIVE</span>
          </div>
          <div className="bg-[#121827] rounded-md border-l-4 border-l-[#E11D48] p-3 shadow-lg relative border-y border-r border-[#1a253a]">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-[#E11D48]/20 px-1.5 py-0.5 rounded-sm">
                <span className="text-[#E11D48] text-[8px] font-black tracking-wider uppercase">HIGH PRIORITY</span>
              </div>
              <span className="text-zinc-300 text-[9px] font-mono tracking-wider font-bold">00:14:32</span>
            </div>
            <h4 className="text-white text-[11px] font-bold mb-1">Control crowd near Gate 3</h4>
            <p className="text-zinc-400 text-[10px] leading-relaxed">
              Sector 7G - Potential escalation reported by aerial drone unit.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-[#1a253a] flex flex-col gap-1">
        <Link href="/support" className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          <HelpCircle className="h-4 w-4" />
          Support
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
