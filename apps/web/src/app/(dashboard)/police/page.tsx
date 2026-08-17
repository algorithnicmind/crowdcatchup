'use client';

import React, { useEffect } from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { TaskCard } from '@/components/dashboard/police/TaskCard';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, SecurityTask } from '@/stores/map-store';
import { Shield } from 'lucide-react';

export default function PoliceDashboard() {
  const eventId = "EVT-001"; // Hardcoded for hackathon demo
  
  // Wire up the live WebSocket connection
  const { subscribe } = useWebSocket(eventId);
  
  const addTask = useMapStore((state) => state.addTask);

  useEffect(() => {
    const unsubscribeTasks = subscribe('SECURITY_TASK', (payload: unknown) => {
      const data = payload as { task?: SecurityTask };
      if (data.task) addTask(data.task);
    });

    return () => {
      unsubscribeTasks();
    };
  }, [subscribe, addTask]);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black flex flex-col">
      {/* 1. Base Map Layer */}
      <div className="flex-1 relative">
        <GoogleEventMap role="police" />
        
        {/* 2. Police Specific Overlays */}
        <TaskCard />
        
        {/* 3. Header/Badge */}
        <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-blue-500/30 px-4 py-2 rounded-xl text-white text-xs font-bold tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">CALLSIGN</span>
              <span className="text-blue-400">OFFICER-4</span>
            </div>
          </div>
        </div>

        {/* 4. Bottom Tactical Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] cursor-pointer hover:bg-zinc-800/90 transition-colors">
            <div className="flex flex-col items-center gap-1 min-w-[100px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status</span>
              </div>
              <span className="text-sm text-emerald-400 font-semibold tracking-wide">PATROL</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center gap-1 min-w-[100px]">
              <span className="text-blue-400 font-bold text-sm tracking-wide">Zone A</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
