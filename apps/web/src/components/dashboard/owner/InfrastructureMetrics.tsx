'use client';

import React from 'react';
import { Users, Activity, Router, Calendar, ShieldCheck, Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function InfrastructureMetrics() {
  return (
    <div className="absolute bottom-[250px] md:bottom-8 left-4 md:left-auto right-4 md:right-6 z-[1000] pointer-events-auto flex flex-row gap-3 w-[calc(100vw-32px)] md:w-max overflow-x-auto md:overflow-visible snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 md:pb-0">
      <Card className="bg-zinc-900/90 backdrop-blur-md border-zinc-800/50 shadow-2xl overflow-hidden min-w-[240px] md:min-w-[200px] shrink-0 snap-center">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase mb-1">Total Crowd</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">24,592</h3>
            <p className="text-[10px] text-emerald-400 font-medium">+1.2% this hour</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/90 backdrop-blur-md border-zinc-800/50 shadow-2xl overflow-hidden min-w-[240px] md:min-w-[200px] shrink-0 snap-center">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Router className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase mb-1">Gates Active</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">12 / 14</h3>
            <p className="text-[10px] text-zinc-400 font-medium">92% throughput</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/90 backdrop-blur-md border-zinc-800/50 shadow-2xl overflow-hidden min-w-[240px] md:min-w-[200px] shrink-0 snap-center">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase mb-1">Infrastructure</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">Stable</h3>
            <p className="text-[10px] text-emerald-400 font-medium">All sensors online</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
