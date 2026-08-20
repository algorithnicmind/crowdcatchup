'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Map as MapIcon, 
  Settings, 
  ShieldAlert,
  Navigation,
  Search,
  Users,
  HeartPulse,
  MapPin,
  CheckCircle,
  BellRing,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { useMapStore } from '@/stores/map-store';

export function CitizenLayoutSidebar() {
  const pathname = usePathname();
  const [isPlanning, setIsPlanning] = useState(false);
  const [routeFound, setRouteFound] = useState(false);

  const navItems = [
    { name: 'Live Map', href: '/citizen', icon: MapIcon },
    { name: 'Alerts', href: '/citizen/alerts', icon: BellRing },
    { name: 'Journey Planner', href: '/citizen/planner', icon: ShieldAlert },
    { name: 'Profile', href: '/citizen/profile', icon: User },
  ];

  const getIsActive = (href: string) => {
    if (href === '/citizen') {
      return pathname === '/citizen' || pathname === '/citizen/';
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
            PUBLIC DASHBOARD
          </div>
          {navItems.map((item) => {
            const isActive = getIsActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-all backdrop-blur-sm",
                  isActive 
                    ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#00E5FF]" : "text-zinc-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Journey Planner Section */}
        <div className="bg-black/30 rounded-lg border border-emerald-500/30 flex flex-col relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 bg-emerald-500/10">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <h2 className="text-emerald-400 font-bold tracking-wider text-[10px] uppercase">Journey Planner</h2>
          </div>

          <div className="p-4">
            {!routeFound ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Where to?" 
                    className="w-full bg-black/50 border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    defaultValue="Maha Kumbh Mela"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 rounded-md p-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-[10px] text-zinc-400 font-semibold">Group</span>
                    </div>
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-2 flex items-center justify-center w-10 cursor-pointer hover:bg-emerald-500/20">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8"
                  onClick={async () => {
                    setIsPlanning(true);
                    try {
                      // Fallback mock coordinates for demo
                      useMapStore.getState().setRouteCoordinates([
                        { lat: 20.296059, lng: 85.824539 },
                        { lat: 20.297, lng: 85.826 },
                        { lat: 20.298, lng: 85.828 }
                      ]);
                      setTimeout(() => setRouteFound(true), 1500);
                    } catch (e) {
                      console.error("Failed", e);
                    } finally {
                      setIsPlanning(false);
                    }
                  }}
                  disabled={isPlanning}
                >
                  {isPlanning ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                      FINDING...
                    </span>
                  ) : (
                    "FIND SAFE ROUTE"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-bold text-xs">SAFE ROUTE</span>
                  </div>
                  <div className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    25 MIN
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <div className="w-0.5 h-5 bg-white/10 my-0.5" />
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Start</p>
                      <p className="text-xs text-zinc-300">Current Location</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Gate</p>
                      <p className="text-xs text-emerald-400 font-semibold">Gate G5</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-7"
                    onClick={() => alert('Navigation Started!')}
                  >
                    START
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-7 text-xs px-2 border-white/10 hover:bg-white/5" 
                    onClick={() => { 
                      setIsPlanning(false); 
                      setRouteFound(false); 
                      useMapStore.getState().setRouteCoordinates(null);
                    }}
                  >
                    Cancel
                  </Button>
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
