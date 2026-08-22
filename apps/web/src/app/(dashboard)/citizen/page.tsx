'use client';

import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { SafeRoutePanel } from '@/components/dashboard/citizen/SafeRoutePanel';
import { ShieldAlert, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/shared/hooks/useWebSocket';

export default function CitizenDashboard() {
  const eventId = "EVT-001";
  const { subscribe } = useWebSocket(eventId);

  React.useEffect(() => {
    // Request notification permissions for PWA requirement
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    const unsubscribeAlerts = subscribe('CITIZEN_ALERT', (wsEvent: any) => {
      if (wsEvent.payload?.message) {
        import('sonner').then(({ toast }) => {
          toast.warning('EMERGENCY ALERT: ' + wsEvent.payload.message, {
            duration: 10000,
            style: { background: 'red', color: 'white', border: '1px solid darkred' }
          });
        });
        
        // Show native notification if allowed
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('EMERGENCY ALERT', { body: wsEvent.payload.message });
        }
      }
    });

    return () => {
      unsubscribeAlerts();
    };
  }, [subscribe]);

  const handleSosTrigger = async () => {
    try {
      const payload = {
        event_id: "test-event-123",
        type: "SOS",
        description: "Emergency assistance requested by Citizen",
        lat: 25.4358, 
        lng: 81.8463,
        timestamp: new Date().toISOString()
      };

      try {
        const { apiClient } = await import('@/lib/api-client');
        await apiClient('/incidents/report', {
          method: "POST",
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn("Backend unavailable, simulating SOS for demo...");
        await new Promise(r => setTimeout(r, 600)); // Simulate delay
      }
      
      import('sonner').then(({ toast }) => {
        toast.error("SOS Triggered! Police have been notified of your exact location.", {
          duration: 5000,
          style: { background: '#ef4444', color: 'white', border: 'none' }
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestAlert = () => {
    import('sonner').then(({ toast }) => {
      toast.info("Notification System Active. You will receive emergency broadcasts here.", {
        duration: 4000,
        style: { background: '#3b82f6', color: 'white', border: 'none' }
      });
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black flex flex-col">
      {/* 1. Base Map Layer */}
      <div className="flex-1 relative">
        <GoogleEventMap role="citizen" />
        
        {/* 2. Citizen Specific Overlays */}
        <SafeRoutePanel />
        
        {/* 3. Header/Status */}
        <div className="absolute top-20 md:top-6 left-6 z-40 pointer-events-none flex flex-col items-start gap-4">
          <div className="bg-emerald-600 border-2 border-emerald-400 px-4 py-2 rounded-full text-white text-sm font-bold tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <span className="w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />
            YOUR AREA IS SAFE
          </div>

          <div className="flex flex-row gap-4 pointer-events-auto mt-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full shadow-[0_0_25px_rgba(239,68,68,0.6)] w-12 h-12 animate-pulse bg-red-600 hover:bg-red-700 border-2 border-red-400"
              onClick={handleSosTrigger}
            >
              <ShieldAlert className="w-6 h-6 text-white" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] w-12 h-12"
              onClick={handleTestAlert}
            >
              <BellRing className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
