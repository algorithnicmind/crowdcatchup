'use client';

import React, { useEffect } from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { AlertsPanel } from '@/components/dashboard/authority/AlertsPanel';
import { CctvGrid } from '@/components/dashboard/authority/CctvGrid';
import { SourceHealthPanel } from '@/components/dashboard/authority/SourceHealthPanel';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, CrowdState, RiskUpdate, ActionPlan, SourceHealth } from '@/stores/map-store';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';

export default function AuthorityDashboard() {
  const eventId = "EVT-001"; // Hardcoded for hackathon demo
  
  // Wire up the live WebSocket connection
  const { subscribe } = useWebSocket(eventId);
  
  // Wire up global GPS Telemetry
  useGpsTelemetry('authority', eventId);
  
  const updateCrowdState = useMapStore((state) => state.updateCrowdState);
  const updateRisk = useMapStore((state) => state.updateRisk);
  const addRecommendation = useMapStore((state) => state.addRecommendation);
  const updateSourceHealth = useMapStore((state) => state.updateSourceHealth);

  useEffect(() => {
    const unsubCrowd = subscribe('CROWD_STATE_UPDATE', (payload: unknown) => {
      const state = payload as CrowdState;
      if (state.zone_id) updateCrowdState(state.zone_id, state);
    });

    const unsubRisk = subscribe('RISK_UPDATE', (payload: unknown) => {
      const risk = payload as RiskUpdate;
      if (risk.zone_id) updateRisk(risk.zone_id, risk);
    });

    const unsubRec = subscribe('RECOMMENDATION_ALERT', (payload: unknown) => {
      const recommendation = payload as ActionPlan;
      if (recommendation.recommendation_id) addRecommendation(recommendation);
    });
    
    const unsubHealth = subscribe('SOURCE_HEALTH', (payload: unknown) => {
      const health = payload as SourceHealth;
      if (health.source_id) updateSourceHealth(health);
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
