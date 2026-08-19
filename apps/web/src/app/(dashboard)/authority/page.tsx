'use client';

import React, { useEffect } from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { AlertsPanel } from '@/components/dashboard/authority/AlertsPanel';
import { CctvGrid } from '@/components/dashboard/authority/CctvGrid';
import { SourceHealthPanel } from '@/components/dashboard/authority/SourceHealthPanel';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, CrowdState, RiskUpdate, ActionPlan, SourceHealth } from '@/stores/map-store';

export default function AuthorityDashboard() {
  const eventId = "EVT-001"; // Hardcoded for hackathon demo
  
  // Wire up the live WebSocket connection
  const { subscribe } = useWebSocket(eventId);
  
  const updateCrowdState = useMapStore((state) => state.updateCrowdState);
  const updateRisk = useMapStore((state) => state.updateRisk);
  const addRecommendation = useMapStore((state) => state.addRecommendation);
  const updateSourceHealth = useMapStore((state) => state.updateSourceHealth);

  useEffect(() => {
    const unsubCrowd = subscribe('CROWD_STATE_UPDATE', (payload: unknown) => {
      const data = payload as { state?: CrowdState };
      if (data.state) updateCrowdState(data.state.zone_id, data.state);
    });

    const unsubRisk = subscribe('RISK_UPDATE', (payload: unknown) => {
      const data = payload as { risk?: RiskUpdate };
      if (data.risk) updateRisk(data.risk.zone_id, data.risk);
    });

    const unsubRec = subscribe('RECOMMENDATION_ALERT', (payload: unknown) => {
      const data = payload as { recommendation?: ActionPlan };
      if (data.recommendation) addRecommendation(data.recommendation);
    });
    
    const unsubHealth = subscribe('SOURCE_HEALTH', (payload: unknown) => {
      const data = payload as { health?: SourceHealth };
      if (data.health) updateSourceHealth(data.health);
    });

    return () => {
      unsubCrowd();
      unsubRisk();
      unsubRec();
      unsubHealth();
    };
  }, [subscribe, updateCrowdState, updateRisk, addRecommendation, updateSourceHealth]);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      {/* 1. Base Map Layer */}
      <GoogleEventMap role="authority" />
      
      {/* 2. Authority Specific Overlays */}
      <AlertsPanel />
      <CctvGrid />
      <SourceHealthPanel />
    </div>
  );
}
