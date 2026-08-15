'use client';

import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { InfrastructureMetrics } from '@/components/dashboard/owner/InfrastructureMetrics';
import { Calendar, Layers, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OwnerDashboard() {
  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      {/* 1. Base Map Layer */}
      <GoogleEventMap role="owner" />
      
      {/* 2. Owner Specific Overlays */}
      <InfrastructureMetrics />
      
      {/* 3. Global Header/Title (Hidden on Mobile) */}
      <div className="absolute top-4 right-4 z-[1000] pointer-events-none hidden md:flex">
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-white/70 text-xs font-semibold tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          EVENT ORGANIZER
        </div>
      </div>

      {/* 4. Pre-Event Simulation Panel (Compact on Mobile) */}
      <div className="absolute top-20 md:top-24 left-4 md:left-6 z-[1000] w-[calc(100vw-32px)] md:w-72 pointer-events-auto">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:p-4 shadow-2xl">
          <h3 className="hidden md:block text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Event Tools</h3>
          <div className="flex flex-row md:flex-col gap-2">
            <Button variant="outline" className="flex-1 md:w-full justify-center md:justify-start bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
              <Eye className="w-4 h-4 md:mr-2 text-blue-400" />
              <span className="hidden md:inline">View Cameras</span>
            </Button>
            <Button variant="outline" className="flex-1 md:w-full justify-center md:justify-start bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
              <Layers className="w-4 h-4 md:mr-2 text-purple-400" />
              <span className="hidden md:inline">Run Simulation</span>
            </Button>
            <Button variant="outline" className="flex-1 md:w-full justify-center md:justify-start bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
              <Calendar className="w-4 h-4 md:mr-2 text-emerald-400" />
              <span className="hidden md:inline">Schedule</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
