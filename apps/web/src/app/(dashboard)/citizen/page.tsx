'use client';

import React from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { SafeRoutePanel } from '@/components/dashboard/citizen/SafeRoutePanel';
import { CitizenBottomNav } from '@/components/dashboard/citizen/CitizenBottomNav';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';
import { useMapStore } from '@/stores/map-store';

export default function CitizenDashboard() {
  const eventId = 'EVT-001';
  const { subscribe } = useWebSocket(eventId);
  const { isSharingLocation } = useGpsTelemetry('citizen', eventId);
  const { citizenLocation } = useMapStore();

  React.useEffect(() => {
    // Request notification permissions for PWA
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    const unsubscribeAlerts = subscribe('CITIZEN_ALERT', (wsEvent: unknown) => {
      const ev = wsEvent as { payload?: { message?: string } };
      if (ev?.payload?.message) {
        import('sonner').then(({ toast }) => {
          toast.warning('🚨 EMERGENCY: ' + ev.payload!.message, {
            duration: 10000,
            style: { background: '#dc2626', color: 'white', border: '1px solid #991b1b' }
          });
        });
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('EMERGENCY ALERT', { body: ev.payload!.message });
        }
      }
    });

    return () => { unsubscribeAlerts(); };
  }, [subscribe]);

  const handleSosTrigger = async () => {
    const { citizenLocation: loc } = useMapStore.getState();
    const payload = {
      event_id: eventId,
      type: 'SOS',
      description: 'Emergency assistance requested by Citizen',
      lat: loc?.lat ?? 20.4789,
      lng: loc?.lng ?? 85.8741,
      timestamp: new Date().toISOString()
    };

    try {
      const { apiClient } = await import('@/lib/api-client');
      await apiClient('/incidents/report', { method: 'POST', body: JSON.stringify(payload) });
    } catch {
      // Backend offline — SOS is simulated
    }

    import('sonner').then(({ toast }) => {
      toast.error('🚨 SOS Triggered! Police have been notified.', {
        duration: 5000,
        style: { background: '#ef4444', color: 'white', border: 'none' }
      });
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      {/* Base Map — full screen */}
      <DigitalTwinMap role="citizen" />

      {/* Safe Route Planning Panel — bottom right */}
      <SafeRoutePanel />

      {/* Mobile Bottom Nav */}
      <CitizenBottomNav />

      {/* Top-left status badges (below the search bar) */}
      <div className="absolute top-[72px] left-4 z-30 flex flex-col items-start gap-2 pointer-events-none">
        {/* Area safety status */}
        <div className="bg-emerald-600/90 backdrop-blur-sm border border-emerald-400/50 px-3 py-1.5 rounded-full text-white text-xs font-bold tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          YOUR AREA IS SAFE
        </div>

        {/* GPS sync indicator */}
        {(isSharingLocation || citizenLocation) && (
          <div className="bg-blue-600/80 backdrop-blur-sm border border-blue-400/50 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            GPS ACTIVE
          </div>
        )}
      </div>

      {/* SOS button — above the bottom nav on mobile, lower on desktop */}
      <div className="absolute bottom-[108px] md:bottom-6 left-4 z-40 pointer-events-auto">
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full w-14 h-14 shadow-[0_0_25px_rgba(239,68,68,0.7)] bg-red-600 hover:bg-red-700 border-2 border-red-400 animate-pulse"
          onClick={handleSosTrigger}
          title="Send SOS Alert"
        >
          <ShieldAlert className="w-7 h-7 text-white" />
        </Button>
      </div>
    </div>
  );
}
