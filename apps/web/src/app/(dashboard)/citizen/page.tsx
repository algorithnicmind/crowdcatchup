'use client';

import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { SafeRoutePanel } from '@/components/dashboard/citizen/SafeRoutePanel';
import { ShieldAlert, BellRing, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CitizenDashboard() {
  const handleSosTrigger = async () => {
    try {
      // In a real app, we'd get actual device GPS coordinates here.
      const payload = {
        event_id: "test-event-123",
        type: "SOS",
        description: "Emergency assistance requested by Citizen",
        lat: 25.4358, 
        lng: 81.8463,
        timestamp: new Date().toISOString()
      };

      const res = await fetch("http://localhost:8000/api/v1/incidents/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("SOS Triggered! Police have been notified of your location.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black flex flex-col">
      {/* 1. Base Map Layer */}
      <div className="flex-1 relative">
        <GoogleEventMap role="citizen" />
        
        {/* 2. Citizen Specific Overlays */}
        <SafeRoutePanel />
        
        {/* 3. Header/Status */}
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none flex justify-between items-start">
          <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 px-3 py-1.5 rounded-full text-white text-xs font-bold tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/50">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            YOUR AREA IS SAFE
          </div>

          <div className="flex flex-col gap-2 pointer-events-auto">
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full shadow-lg shadow-red-500/30 w-10 h-10 animate-pulse"
              onClick={handleSosTrigger}
            >
              <ShieldAlert className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-black/60 border-white/20 text-white backdrop-blur-md hover:bg-white/10 w-10 h-10"
            >
              <BellRing className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
