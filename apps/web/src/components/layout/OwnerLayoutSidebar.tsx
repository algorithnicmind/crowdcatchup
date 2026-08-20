'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Map as MapIcon, 
  Settings, 
  ShieldAlert,
  PencilRuler,
  Hexagon,
  DoorOpen,
  Route,
  Video,
  Calendar,
  Activity,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DotPattern } from '@/components/ui/dot-pattern';

export function OwnerLayoutSidebar() {
  const pathname = usePathname();
  const [activeTool, setActiveTool] = useState<string>('zones');

  const tools = [
    { id: 'boundary', icon: MapIcon, label: 'Venue Boundary', desc: 'Define event perimeter' },
    { id: 'zones', icon: Hexagon, label: 'Crowd Zones', desc: 'Draw tracking areas' },
    { id: 'gates', icon: DoorOpen, label: 'Smart Gates', desc: 'Place entry/exit points' },
    { id: 'routes', icon: Route, label: 'Flow Routes', desc: 'Map safe pathways' },
    { id: 'infra', icon: Video, label: 'Infrastructure', desc: 'Add CCTVs & Sensors' },
  ];

  const navItems = [
    { name: "Events", href: "/owner/events", icon: Calendar },
    { name: "Venue Map", href: "/owner", icon: MapIcon },
    { name: "Simulations", href: "/owner", icon: Activity },
    { name: "Settings", href: "/settings", icon: Settings2 }
  ];

  const getIsActive = (href: string) => {
    if (href === '/owner') {
      return pathname === '/owner' || pathname === '/owner/';
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
            ORGANIZER DASHBOARD
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

        {/* Builder Tools Section */}
        <div className="bg-black/30 rounded-lg border border-white/5 flex flex-col">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 bg-black/40">
            <PencilRuler className="w-4 h-4 text-purple-400" />
            <h2 className="text-white font-bold tracking-wider text-[10px] uppercase">Builder Tools</h2>
          </div>

          <div className="p-3 flex flex-col gap-1.5">
            {tools.map((tool) => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md border transition-all ${
                    isActive 
                      ? 'bg-purple-500/10 border-purple-500/30' 
                      : 'bg-black/40 border-transparent hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <tool.icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                  <div className="text-left flex-1">
                    <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                      {tool.label}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-[#1a253a] flex flex-col gap-1 relative z-10">
        <Link href="/settings" className="flex items-center gap-3 px-2 py-2 rounded-md text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="h-4 w-4" />
          Global Event Settings
        </Link>
      </div>
    </div>
  );
}
