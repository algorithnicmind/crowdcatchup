'use client';

import React, { useEffect } from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { TaskCard } from '@/components/dashboard/police/TaskCard';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, SecurityTask } from '@/stores/map-store';

export default function PoliceDashboard() {
  const eventId = "EVT-001"; // Hardcoded for hackathon demo
  
  // Wire up the live WebSocket connection
  const { subscribe } = useWebSocket(eventId);
  
  const addTask = useMapStore((state) => state.addTask);

  useEffect(() => {
    const unsubscribeTasks = subscribe('SECURITY_TASK', (wsEvent: any) => {
      if (wsEvent.payload) {
        addTask({
          task_id: wsEvent.payload.intervention_id || `task-${Date.now()}`,
          zone_id: wsEvent.payload.target_zone || wsEvent.payload.zone_id || 'Unknown Zone',
          distance: 100, // Mock distance
          risk_level: 'HIGH',
          instructions: wsEvent.payload.message || 'No instructions provided',
          required_officers: 2
        });
      }
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
        


        {/* 4. Bottom Tactical Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
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
