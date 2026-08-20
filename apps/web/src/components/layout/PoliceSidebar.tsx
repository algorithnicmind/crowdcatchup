'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { useMapStore } from '@/stores/map-store';
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
import { PoliceSettingsModal } from '../dashboard/police/PoliceSettingsModal';


export function PoliceSidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isPatrol, setIsPatrol] = useState(true);

  const { activeTasks } = useMapStore();
  const currentTask = activeTasks.length > 0 ? activeTasks[0] : null;

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!currentTask) {
      setTimeout(() => setElapsed(0), 0);
      return;
    }
    
    // In a real app we'd use currentTask.timestamp, but for demo we just tick
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTask]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerString = currentTask ? formatTime(elapsed) : '00:00:00';

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
    <div className="flex h-full w-[260px] flex-col bg-[#09090b] text-white border-r border-[#1a253a] shadow-xl font-sans overflow-hidden relative">
      {/* Cool Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_top_left,rgba(0,229,255,0.15),transparent_70%)] animate-pulse" />
        <div className="absolute top-[40%] -right-[30%] w-[100%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>
      
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#1a253a] relative z-10">
        <span className="font-bold tracking-widest text-[#00E5FF] text-lg uppercase">CROWDSHIELD</span>
        <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 p-1.5 rounded">
          <LayoutDashboard className="h-4 w-4 text-[#00E5FF]" />
          <span className="text-[#00E5FF] text-[10px] font-bold">Dashboard</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 py-5 gap-6 relative z-10">
        
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
                <span className={`w-1.5 h-1.5 rounded-full ${isPatrol ? 'bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]' : 'bg-zinc-500'}`} />
                <span className={`text-[10px] font-bold tracking-wider ${isPatrol ? 'text-[#00E5FF]' : 'text-zinc-500'}`}>
                  Status: {isPatrol ? 'Patrol' : 'Off-Duty'}
                </span>
              </div>
            </div>
          </div>
          {/* Toggle Switch */}
          <div 
            onClick={() => {
              setIsPatrol(!isPatrol);
              toast.info(isPatrol ? 'Status changed to Off-Duty' : 'Status changed to Patrol');
            }}
            className={`w-9 h-5 rounded-full relative cursor-pointer shadow-inner transition-colors ${isPatrol ? 'bg-[#1F2937]' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${isPatrol ? 'right-1 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]' : 'left-1 bg-zinc-500'}`} />
          </div>
        </div>

        {/* Tactical Buttons */}
        <div className="flex flex-col gap-3">
          {/* SOS Button */}
          <button 
            onClick={() => toast.error('EMERGENCY SOS SIGNAL BROADCASTED', { description: 'All nearby units and command have been alerted.', duration: 5000 })}
            className="w-full relative flex flex-col items-center justify-center gap-1.5 rounded-md bg-black border border-[#E11D48]/30 py-4 shadow-[inset_0_0_20px_rgba(225,29,72,0.1),_0_0_15px_rgba(225,29,72,0.15)] hover:bg-[#E11D48]/10 hover:border-[#E11D48]/50 transition-all cursor-pointer group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[#E11D48]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Asterisk className="h-6 w-6 text-[#E11D48]" />
            <span className="text-[#E11D48] text-[10px] font-bold tracking-widest uppercase font-sans">SOS EMERGENCY</span>
          </button>

          {/* Quick Actions (Row) */}
          <div className="flex gap-3">
            <button 
              onClick={() => toast.warning('INCIDENT REPORT INITIATED', { description: 'Opening rapid report interface...' })}
              className="flex-1 flex flex-col items-center justify-center gap-2 rounded-md bg-black/40 border border-white/5 hover:border-[#EAB308]/30 hover:bg-[#EAB308]/5 py-3 transition-all cursor-pointer shadow-sm backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full border border-[#EAB308] flex items-center justify-center mb-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-[#EAB308]" />
              </div>
              <span className="text-[#EAB308] text-[9px] font-bold tracking-wider font-sans">Incident</span>
            </button>
            <button 
              onClick={() => toast.message('BACKUP REQUESTED', { description: 'Authority Command has been notified of your request.' })}
              className="flex-1 flex flex-col items-center justify-center gap-2 rounded-md bg-black/40 border border-white/5 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 py-3 transition-all cursor-pointer shadow-sm backdrop-blur-sm"
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
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-all backdrop-blur-sm",
                  isActive 
                    ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
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
          
          {currentTask ? (
            <div className={`bg-black/60 backdrop-blur-md rounded-md border-l-4 p-3 shadow-lg relative border-y border-r border-white/10 ${currentTask.risk_level === 'CRITICAL' ? 'border-l-[#E11D48]' : currentTask.risk_level === 'HIGH' ? 'border-l-[#EAB308]' : 'border-l-[#00E5FF]'}`}>
              <div className="flex justify-between items-center mb-2">
                <div className={`${currentTask.risk_level === 'CRITICAL' ? 'bg-[#E11D48]/20' : currentTask.risk_level === 'HIGH' ? 'bg-[#EAB308]/20' : 'bg-[#00E5FF]/20'} px-1.5 py-0.5 rounded-sm`}>
                  <span className={`${currentTask.risk_level === 'CRITICAL' ? 'text-[#E11D48]' : currentTask.risk_level === 'HIGH' ? 'text-[#EAB308]' : 'text-[#00E5FF]'} text-[8px] font-black tracking-wider uppercase`}>{currentTask.risk_level} PRIORITY</span>
                </div>
                <span className="text-zinc-300 text-[9px] font-mono tracking-wider font-bold">{timerString}</span>
              </div>
              <h4 className="text-white text-[11px] font-bold mb-1">Task: {currentTask.task_id}</h4>
              <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2">
                {currentTask.zone_id} - {currentTask.instructions}
              </p>
            </div>
          ) : (
            <div className="bg-black/60 backdrop-blur-md rounded-md border-l-4 border-l-zinc-700 p-3 shadow-lg relative border-y border-r border-white/10">
              <h4 className="text-zinc-300 text-[11px] font-bold mb-1">Standby</h4>
              <p className="text-zinc-500 text-[10px] leading-relaxed">
                No active critical objectives at this time. Maintain sector patrol.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-[#1a253a] flex flex-col gap-1 relative z-10">
        <button 
          onClick={() => toast.success('Connecting to Command Support...', { description: 'Secure channel established.' })}
          className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all w-full text-left"
        >
          <HelpCircle className="h-4 w-4" />
          Support
        </button>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all w-full text-left"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
      <PoliceSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
