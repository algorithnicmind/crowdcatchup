'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Map as MapIcon, 
  Settings, 
  ShieldAlert,
  Activity,
  Layers,
  Video,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMapStore } from '@/stores/map-store';
import { Switch } from '@/components/ui/switch';
import { DotPattern } from '@/components/ui/dot-pattern';

export function AuthorityLayoutSidebar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'controls' | 'metrics'>('controls');

  const { heatmapEnabled, setHeatmapEnabled } = useMapStore();
  const [cctvEnabled, setCctvEnabled] = useState(true);
  const [policeUnitsEnabled, setPoliceUnitsEnabled] = useState(true);
  const [smartGatesEnabled, setSmartGatesEnabled] = useState(true);

  const navItems = [
    { name: 'Command Center', href: '/authority', icon: BarChart3 },
    { name: 'Live Map', href: '/map-demo', icon: MapIcon },
  ];

  // Active state logic
  const getIsActive = (href: string) => {
    if (href === '/authority') {
      return pathname === '/authority' || pathname === '/authority/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-full w-[260px] flex-col bg-black text-white border-r border-[#1a253a] shadow-xl font-sans overflow-hidden relative">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1.5}
        className={cn(
          "text-white/40 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
        )}
      />

      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#1a253a] relative z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-emerald-500" />
          <span className="font-bold tracking-widest text-white text-lg uppercase">CROWD<span className="text-emerald-500">SHIELD</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 py-5 gap-6 relative z-10">
        
        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 -mx-2">
          <div className="mb-2 px-4 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            AUTHORITY DASHBOARD
          </div>
          {navItems.map((item) => {
            const isActive = getIsActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-all",
                  isActive 
                    ? "bg-[#00E5FF]/10 text-[#00E5FF]" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#00E5FF]" : "text-zinc-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Map Controls Section */}
        <div className="bg-black/30 rounded-lg border border-white/5 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-black/40">
            <button 
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-2 text-[10px] font-semibold tracking-wider transition-colors ${activeTab === 'controls' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              MAP CONTROLS
            </button>
            <button 
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 py-2 text-[10px] font-semibold tracking-wider transition-colors ${activeTab === 'metrics' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              LIVE METRICS
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'controls' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-xs text-zinc-300 group-hover:text-white transition-colors">
                    <Activity className={`w-3.5 h-3.5 ${heatmapEnabled ? 'text-orange-400' : 'text-zinc-500'}`} />
                    Crowd Heatmap
                  </div>
                  <Switch checked={heatmapEnabled} onCheckedChange={setHeatmapEnabled} className="data-[state=checked]:bg-orange-500 scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-xs text-zinc-300 group-hover:text-white transition-colors">
                    <Video className={`w-3.5 h-3.5 ${cctvEnabled ? 'text-blue-400' : 'text-zinc-500'}`} />
                    CCTV Cameras
                  </div>
                  <Switch checked={cctvEnabled} onCheckedChange={setCctvEnabled} className="data-[state=checked]:bg-blue-500 scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-xs text-zinc-300 group-hover:text-white transition-colors">
                    <Users className={`w-3.5 h-3.5 ${policeUnitsEnabled ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    Police Units
                  </div>
                  <Switch checked={policeUnitsEnabled} onCheckedChange={setPoliceUnitsEnabled} className="data-[state=checked]:bg-emerald-500 scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-xs text-zinc-300 group-hover:text-white transition-colors">
                    <MapIcon className={`w-3.5 h-3.5 ${smartGatesEnabled ? 'text-purple-400' : 'text-zinc-500'}`} />
                    Smart Gates
                  </div>
                  <Switch checked={smartGatesEnabled} onCheckedChange={setSmartGatesEnabled} className="data-[state=checked]:bg-purple-500 scale-75 origin-right" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-black/50 border border-white/5 rounded-md p-2">
                  <div className="text-[10px] text-zinc-400 mb-1 uppercase tracking-wider">Global Density</div>
                  <div className="text-lg font-bold text-white flex items-baseline gap-1">
                    4.2 <span className="text-[10px] font-normal text-zinc-500">p/m²</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-orange-500 w-[70%]" />
                  </div>
                </div>
                
                <div className="bg-black/50 border border-white/5 rounded-md p-2">
                  <div className="text-[10px] text-zinc-400 mb-1 uppercase tracking-wider">Active Personnel</div>
                  <div className="text-lg font-bold text-white flex items-baseline gap-1">
                    142 <span className="text-[10px] font-normal text-zinc-500">/ 150</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[94%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-[#1a253a] flex flex-col gap-1 relative z-10">
        <Link href="/settings" className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
