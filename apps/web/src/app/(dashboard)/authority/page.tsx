'use client';

import React, { useEffect, useState } from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { AlertsPanel } from '@/components/dashboard/authority/AlertsPanel';
import { CctvGrid } from '@/components/dashboard/authority/CctvGrid';
import { SourceHealthPanel } from '@/components/dashboard/authority/SourceHealthPanel';
import { SimulatorPanel } from '@/components/dashboard/authority/SimulatorPanel';
import { StaffManagementModal } from '@/components/dashboard/authority/StaffManagementModal';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMapStore, CrowdState, RiskUpdate, ActionPlan, SourceHealth } from '@/stores/map-store';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';
import { Button } from '@/components/ui/button';
import { Users, LayoutDashboard } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function AuthorityDashboard() {
  const { activeEventId, setActiveEventId } = useMapStore();
  const [events, setEvents] = useState<any[]>([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch events if none active
  useEffect(() => {
    if (!activeEventId) {
      apiClient('/events').then((data: any) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [activeEventId]);

  // Wire up the live WebSocket connection
  const { subscribe } = useWebSocket(activeEventId || '');
  
  // Wire up global GPS Telemetry
  useGpsTelemetry('authority', activeEventId || '');
  
  const updateCrowdState = useMapStore((state) => state.updateCrowdState);
  const updateRisk = useMapStore((state) => state.updateRisk);
  const addRecommendation = useMapStore((state) => state.addRecommendation);
  const updateSourceHealth = useMapStore((state) => state.updateSourceHealth);

  useEffect(() => {
    if (!activeEventId) return;

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
  }, [activeEventId, subscribe, updateCrowdState, updateRisk, addRecommendation, updateSourceHealth]);

  if (!activeEventId) {
    return (
      <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">AUTHORITY COMMAND CENTER</h1>
            <p className="text-zinc-400">Select an event to monitor or manage staff assignments.</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6"
            onClick={() => setShowStaffModal(true)}
          >
            <Users className="w-5 h-5 mr-2" /> MANAGE STAFF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-zinc-500 animate-pulse">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="col-span-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
              No events found. Event Owners must create events first.
            </div>
          ) : (
            events.map((ev) => (
              <div 
                key={ev.id} 
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all cursor-pointer"
                onClick={() => setActiveEventId(ev.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{ev.name}</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase">
                    {ev.status}
                  </span>
                </div>
                <div className="text-sm text-zinc-400 mb-6">
                  {ev.description || "No description provided."}
                </div>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  OPEN COMMAND DASHBOARD
                </Button>
              </div>
            ))
          )}
        </div>

        {showStaffModal && (
          <StaffManagementModal onClose={() => setShowStaffModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      {/* Back Button / Header Overlay */}
      <div className="absolute top-4 left-4 z-50 flex gap-4">
        <Button variant="outline" className="bg-black/50 backdrop-blur border-zinc-700 text-white" onClick={() => setActiveEventId(null)}>
          &larr; Switch Event
        </Button>
        <Button variant="outline" className="bg-blue-600/20 backdrop-blur border-blue-500/50 text-blue-400 hover:bg-blue-600/40 hover:text-white" onClick={() => setShowStaffModal(true)}>
          <Users className="w-4 h-4 mr-2" /> Staff Management
        </Button>
      </div>

      {/* 1. Base Map Layer */}
      <DigitalTwinMap role="authority" />
      
      {/* 2. Authority Specific Overlays */}
      <SimulatorPanel />
      <AlertsPanel />
      <CctvGrid />
      <SourceHealthPanel />

      {showStaffModal && (
        <StaffManagementModal onClose={() => setShowStaffModal(false)} />
      )}
    </div>
  );
}
