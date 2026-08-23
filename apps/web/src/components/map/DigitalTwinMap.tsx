'use client';

import React, { useMemo } from 'react';
import { useMapStore } from '@/stores/map-store';
import { MapOverlayControls } from './MapOverlayControls';
import { Users, Router, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DigitalTwinMapProps {
  role?: 'authority' | 'police' | 'citizen' | 'owner';
}

const ZONES = [
  { id: 'Zone A (Gate 1)', top: '20%', left: '20%', isGate: true },
  { id: 'Zone B (Gate 2)', top: '50%', left: '20%', isGate: true },
  { id: 'Zone C (Gate 3)', top: '80%', left: '50%', isGate: true },
  { id: 'Zone D (Main Stage)', top: '50%', left: '70%', isGate: false },
  { id: 'Zone E (Food Court)', top: '20%', left: '70%', isGate: false },
];

function HeatZone({ zone }: { zone: typeof ZONES[0] }) {
  const crowd = useMapStore(s => s.liveCrowdState[zone.id]);
  const risk = useMapStore(s => s.liveRisk[zone.id]);
  
  const level = risk?.risk_level || crowd?.density_level || 'LOW';
  
  const { color, radiusClass, glowClass } = useMemo(() => {
    if (level === 'CRITICAL') return { color: '#ef4444', radiusClass: 'w-64 h-64', glowClass: 'bg-red-500/40 blur-3xl animate-pulse' };
    if (level === 'HIGH' || level === 'CONGESTED') return { color: '#f97316', radiusClass: 'w-48 h-48', glowClass: 'bg-orange-500/30 blur-2xl animate-pulse' };
    if (level === 'MODERATE') return { color: '#eab308', radiusClass: 'w-32 h-32', glowClass: 'bg-yellow-500/20 blur-xl' };
    return { color: '#10b981', radiusClass: 'w-24 h-24', glowClass: 'bg-emerald-500/10 blur-xl' };
  }, [level]);

  return (
    <div 
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none ${radiusClass} ${glowClass}`}
      style={{ top: zone.top, left: zone.left }}
    />
  );
}

function ZoneMarker({ zone }: { zone: typeof ZONES[0] }) {
  const crowd = useMapStore(s => s.liveCrowdState[zone.id]);
  const risk = useMapStore(s => s.liveRisk[zone.id]);
  
  const level = risk?.risk_level || crowd?.density_level || 'LOW';
  
  const { bgColor, borderColor, textColor, Icon } = useMemo(() => {
    const isGate = zone.isGate;
    const defaultIcon = isGate ? Router : Users;
    
    if (level === 'CRITICAL') return { bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50', textColor: 'text-red-500', Icon: AlertTriangle };
    if (level === 'HIGH' || level === 'CONGESTED') return { bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50', textColor: 'text-orange-400', Icon: AlertTriangle };
    if (level === 'MODERATE') return { bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50', textColor: 'text-yellow-400', Icon: defaultIcon };
    return { bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/50', textColor: 'text-emerald-400', Icon: ShieldCheck };
  }, [level, zone.isGate]);

  return (
    <div 
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:z-50 group`}
      style={{ top: zone.top, left: zone.left }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg border transition-all duration-300 group-hover:scale-110 ${bgColor} ${borderColor}`}>
        <Icon className={`w-6 h-6 ${textColor}`} />
      </div>
      <div className="px-2 py-1 bg-zinc-900/80 backdrop-blur rounded border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs font-bold text-white">{zone.id}</p>
        <p className={`text-[10px] font-semibold ${textColor}`}>{level} RISK</p>
      </div>
    </div>
  );
}

export function DigitalTwinMap({ role = 'authority' }: DigitalTwinMapProps) {
  return (
    <div className="h-full w-full relative bg-[#111] overflow-hidden rounded-xl border border-white/5 shadow-2xl">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Stadium Layout (SVG or border layout) */}
      <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] border-2 border-dashed border-zinc-700 rounded-[3rem] flex items-center justify-center pointer-events-none">
        <span className="text-zinc-800 text-6xl font-black uppercase tracking-[1em] select-none text-center leading-tight opacity-50">
          MAIN<br/>ARENA
        </span>
      </div>
      
      {/* Simulated Paths connecting zones */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="70%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="50%" y1="80%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
      </svg>

      {/* Heat Zones & Markers */}
      <div className="absolute inset-0 z-10">
        {ZONES.map(z => (
          <React.Fragment key={z.id}>
            <HeatZone zone={z} />
            <ZoneMarker zone={z} />
          </React.Fragment>
        ))}
      </div>

      {/* UI Controls */}
      <MapOverlayControls role={role} />
      
      {/* Role specific info */}
      <div className="absolute top-6 left-6 z-40 bg-zinc-900/80 backdrop-blur px-4 py-2 rounded-lg border border-zinc-800 shadow-lg pointer-events-auto">
        <p className="font-bold text-white text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Digital Twin Active
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">Live monitoring powered by CrowdShield</p>
      </div>
    </div>
  );
}
