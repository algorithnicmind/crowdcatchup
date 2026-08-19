'use client';

import React from 'react';
import { useMapStore } from '@/stores/map-store';
import { MagicCard } from '@/components/ui/magic-card';

export function SourceHealthPanel() {
  const sourceHealth = useMapStore(s => s.sourceHealth);

  if (sourceHealth.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] w-72 pointer-events-none">
      <MagicCard className="bg-black/80 backdrop-blur-md border border-white/10 p-4">
        <h3 className="text-white text-sm font-semibold mb-3 tracking-wide">Data Source Health</h3>
        <div className="space-y-3">
          {sourceHealth.map(s => (
            <div key={s.source_id} className="flex items-center justify-between pointer-events-auto bg-white/5 p-2 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-gray-200 text-xs font-medium">{s.source_id}</span>
                {s.source_type === 'SYNTHETIC' && (
                  <span className="text-[10px] text-purple-400 border border-purple-500/50 mt-1 w-fit bg-purple-500/10 px-1.5 py-0.5 rounded-full font-bold">
                    SIMULATED
                  </span>
                )}
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${s.health_status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {s.health_status}
              </span>
            </div>
          ))}
        </div>
      </MagicCard>
    </div>
  );
}
