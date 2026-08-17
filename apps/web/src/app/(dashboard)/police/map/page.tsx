import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';

export default function PoliceMapPage() {
  return (
    <div className="flex-1 h-full w-full relative bg-[#09090b]">
      {/* HUD Overlay for Map View */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-blue-500/30 px-4 py-2 rounded-xl text-white text-xs font-bold tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <span className="text-blue-400">TACTICAL MAP VIEW</span>
        </div>
      </div>
      
      {/* Map Component */}
      <GoogleEventMap />
    </div>
  );
}
