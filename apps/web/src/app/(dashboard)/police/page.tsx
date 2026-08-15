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
          <div className="bg-blue-600/90 backdrop-blur-md border border-blue-400/30 px-3 py-1.5 rounded-full text-white text-xs font-bold tracking-widest flex items-center gap-2 shadow-lg shadow-blue-900/50">
            <Shield className="w-3.5 h-3.5" />
            OFFICER-4
          </div>
        </div>

        {/* 4. Bottom Tactical Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex gap-8 shadow-2xl">
            <div className="flex flex-col items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</span>
              <span className="text-xs text-white font-semibold">PATROL</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-blue-400 font-bold text-sm">Zone A</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
