'use client';

import React, { useEffect } from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { WhatIfModal } from '@/components/dashboard/authority/digital-twin/WhatIfModal';
import { ScenarioController } from '@/components/dashboard/authority/digital-twin/ScenarioController';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, CrowdState, RiskUpdate } from '@/stores/map-store';

export default function DigitalTwinDashboard() {
  const eventId = "EVT-001";
  const { subscribe } = useWebSocket(eventId);
  
  const updateCrowdState = useMapStore((state) => state.updateCrowdState);
  const updateRisk = useMapStore((state) => state.updateRisk);

  useEffect(() => {
    const unsubCrowd = subscribe('CROWD_STATE_UPDATE', (payload: unknown) => {
      const data = payload as { state?: CrowdState };
      if (data.state) updateCrowdState(data.state.zone_id, data.state);
    });

    const unsubRisk = subscribe('RISK_UPDATE', (payload: unknown) => {
      const data = payload as { risk?: RiskUpdate };
      if (data.risk) updateRisk(data.risk.zone_id, data.risk);
    });

    return () => {
      unsubCrowd();
      unsubRisk();
    };
  }, [subscribe, updateCrowdState, updateRisk]);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black flex">
      {/* Simulation Controllers (Left Panel) */}
      <div className="w-80 h-full bg-zinc-900 border-r border-white/10 p-6 flex flex-col gap-6 z-10 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">DIGITAL TWIN</h2>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Simulation Engine</p>
        </div>
        
        {/* Scenario Controls */}
        <ScenarioController eventId={eventId} />
        
        <div className="h-px bg-white/10 w-full my-2"></div>
        
        {/* What-If Prediction Tool */}
        <WhatIfModal eventId={eventId} />
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <DigitalTwinMap role="authority" />
        
        {/* Top-Right Badges */}
        <div className="absolute top-4 right-4 z-[1000] pointer-events-none flex flex-col gap-2">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/50 px-4 py-2 rounded-full text-purple-200 text-xs font-semibold tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            SIMULATION MODE
          </div>
        </div>
      </div>
    </div>
  );
}
