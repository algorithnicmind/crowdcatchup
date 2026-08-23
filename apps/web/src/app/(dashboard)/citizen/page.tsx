'use client';

import React, { useState, useEffect } from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { SafeRoutePanel } from '@/components/dashboard/citizen/SafeRoutePanel';
import { CitizenBottomNav } from '@/components/dashboard/citizen/CitizenBottomNav';
import { ShieldAlert, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';
import { useMapStore } from '@/stores/map-store';
import { apiClient } from '@/lib/api-client';

export default function CitizenDashboard() {
  const { activeEventId, setActiveEventId, citizenLocation } = useMapStore();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Use activeEventId or fallback for hooks that need it
  const { subscribe } = useWebSocket(activeEventId || '');
  const { isSharingLocation } = useGpsTelemetry('citizen', activeEventId || '');

  useEffect(() => {
    if (!activeEventId) {
      // Fetch live events
      apiClient('/events')
        .then((data: any) => {
          setEvents(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [activeEventId]);

  useEffect(() => {
    if (!activeEventId) return;

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
  }, [activeEventId, subscribe]);

  const handleSosTrigger = async () => {
    if (!activeEventId) return;
    const { citizenLocation: loc } = useMapStore.getState();
    const payload = {
      event_id: activeEventId,
      type: 'SOS',
      description: 'Emergency assistance requested by Citizen',
      lat: loc?.lat ?? 20.4789,
      lng: loc?.lng ?? 85.8741,
      timestamp: new Date().toISOString()
    };

    try {
      await apiClient('/incidents/report', { method: 'POST', body: JSON.stringify(payload) });
    } catch {
      // Backend offline
    }

    import('sonner').then(({ toast }) => {
      toast.error('🚨 SOS Triggered! Police have been notified.', {
        duration: 5000,
        style: { background: '#ef4444', color: 'white', border: 'none' }
      });
    });
  };

  // 1. If no event is selected, show the Event Selector
  if (!activeEventId) {
    return (
      <div className="h-[calc(100vh-64px)] w-full relative overflow-y-auto bg-black p-6">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">LIVE EVENTS</h1>
        <p className="text-zinc-400 mb-8">Select an active event to access the live Digital Twin and safety features.</p>
        
        {loading ? (
          <div className="text-center py-20 text-zinc-500 animate-pulse">Loading live events...</div>
        ) : events.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
            No live events currently active. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div 
                key={ev.id} 
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer group"
                onClick={() => setActiveEventId(ev.id)}
              >
                <div className="h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                  <span className="text-4xl font-black text-zinc-700 group-hover:scale-110 transition-transform">MAP</span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{ev.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-500" /> 
                    <span>Live Venue Map</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span>Live Tracking Active</span>
                  </div>
                  <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    ENTER EVENT
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Event is selected, render the Digital Twin
  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      <DigitalTwinMap role="citizen" />
      <SafeRoutePanel />
      <CitizenBottomNav />

      <div className="absolute top-[72px] left-4 z-30 flex flex-col items-start gap-2 pointer-events-none">
        <div className="bg-emerald-600/90 backdrop-blur-sm border border-emerald-400/50 px-3 py-1.5 rounded-full text-white text-xs font-bold tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          YOUR AREA IS SAFE
        </div>
        {(isSharingLocation || citizenLocation) && (
          <div className="bg-blue-600/80 backdrop-blur-sm border border-blue-400/50 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            GPS ACTIVE
          </div>
        )}
      </div>

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
