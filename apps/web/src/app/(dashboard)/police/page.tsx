'use client';

import React, { useEffect } from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { TaskCard } from '@/components/dashboard/police/TaskCard';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, SecurityTask } from '@/stores/map-store';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';

export default function PoliceDashboard() {
  const eventId = "EVT-001"; // Hardcoded for hackathon demo
  
  // Wire up the live WebSocket connection
  const { subscribe } = useWebSocket(eventId);
  
  // Wire up global GPS Telemetry
  const { isSharingLocation } = useGpsTelemetry('police', eventId);
  
  const addTask = useMapStore((state) => state.addTask);

  useEffect(() => {
    // Handle NEW_TASK (auto-created by TaskManager)
    const unsubscribeNew = subscribe('NEW_TASK', (payload: any) => {
      if (payload && payload.id) {
        addTask({
          task_id: payload.id,
          zone_id: payload.zone_id || 'Unknown Zone',
          distance: Math.floor(Math.random() * 200) + 50,
          risk_level: payload.risk_level || 'HIGH',
          instructions: payload.instructions || 'No instructions provided',
          required_officers: payload.required_officers || 2
        });
      }
    });

    // Handle SECURITY_TASK (manually approved from InterventionService)
    const unsubscribeSecurity = subscribe('SECURITY_TASK', (payload: any) => {
      // payload might have payload.payload depending on double-nesting, let's check both
      const data = payload.payload || payload;
      if (data && data.intervention_id) {
        addTask({
          task_id: data.intervention_id,
          zone_id: data.target_zone || data.zone_id || 'Unknown Zone',
          distance: Math.floor(Math.random() * 200) + 50,
          risk_level: 'HIGH',
          instructions: data.message || 'No instructions provided',
          required_officers: 2
        });
      }
    });

    return () => {
      unsubscribeNew();
      unsubscribeSecurity();
    };
  }, [subscribe, addTask]);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black flex flex-col">
      {/* 1. Base Map Layer */}
      <div className="flex-1 relative">
        <DigitalTwinMap role="police" />
        
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
            {isSharingLocation && (
              <>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center gap-1 min-w-[100px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Telemetry</span>
                  </div>
                  <span className="text-sm text-zinc-300 font-semibold tracking-wide">ACTIVE</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
