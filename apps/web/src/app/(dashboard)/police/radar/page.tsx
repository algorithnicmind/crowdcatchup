import React from 'react';
import { Target, Users, Radio } from 'lucide-react';

export default function PoliceRadarPage() {
  return (
    <div className="flex-1 p-6 md:p-8 bg-[#09090b] min-h-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Unit Radar</h1>
            <p className="text-zinc-400">Real-time telemetry of nearby personnel and assets.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Scan Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Radar Screen (Placeholder) */}
          <div className="lg:col-span-2 bg-[#0A111E] border border-[#1a253a] rounded-xl p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20 pointer-events-none" />
            
            {/* Animated Radar Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#00E5FF]/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#00E5FF]/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/5" />
            
            {/* Center Blip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF] z-10" />
            
            {/* Other Blips */}
            <div className="absolute top-[30%] left-[60%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] animate-pulse" />
            <div className="absolute top-[70%] left-[35%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] animate-pulse" />
            <div className="absolute top-[40%] left-[20%] w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_#EAB308] animate-pulse" />
            
            <div className="text-center z-10">
              <Target className="w-12 h-12 text-[#00E5FF]/30 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Scanning Sector 7G...</p>
            </div>
          </div>

          {/* Nearby Units List */}
          <div className="bg-[#121827] border border-[#1a253a] rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              Nearby Units (3)
            </h3>
            
            <div className="flex flex-col gap-3">
              {[
                { callsign: 'OFFICER-2', status: 'Available', distance: '120m', color: 'emerald' },
                { callsign: 'OFFICER-7', status: 'Available', distance: '340m', color: 'emerald' },
                { callsign: 'OFFICER-9', status: 'Engaged', distance: '550m', color: 'yellow' },
              ].map(unit => (
                <div key={unit.callsign} className="flex items-center justify-between p-3 rounded-lg bg-[#0A111E] border border-[#1a253a]">
                  <div>
                    <div className="text-white font-bold text-xs">{unit.callsign}</div>
                    <div className="text-zinc-500 text-[10px] mt-0.5">{unit.distance} away</div>
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-${unit.color}-500/10 text-${unit.color}-500`}>
                    {unit.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
