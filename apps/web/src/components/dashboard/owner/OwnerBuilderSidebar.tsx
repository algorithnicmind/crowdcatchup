'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicCard } from '@/components/ui/magic-card';
import { 
  PencilRuler, 
  Map as MapIcon, 
  Hexagon,
  DoorOpen,
  Route,
  Video,
  Settings,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OwnerBuilderSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTool, setActiveTool] = useState<string>('zones');

  const tools = [
    { id: 'boundary', icon: MapIcon, label: 'Venue Boundary', desc: 'Define event perimeter' },
    { id: 'zones', icon: Hexagon, label: 'Crowd Zones', desc: 'Draw tracking areas' },
    { id: 'gates', icon: DoorOpen, label: 'Smart Gates', desc: 'Place entry/exit points' },
    { id: 'routes', icon: Route, label: 'Flow Routes', desc: 'Map safe pathways' },
    { id: 'infra', icon: Video, label: 'Infrastructure', desc: 'Add CCTVs & Sensors' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden absolute top-24 left-4 z-[1000] p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-purple-400 shadow-xl"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-20 md:top-6 left-4 md:left-6 z-[900] w-[calc(100vw-32px)] md:w-80 flex flex-col gap-4 pointer-events-auto"
          >
            <MagicCard 
              className="bg-black/85 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              gradientColor="rgba(168, 85, 247, 0.05)"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-md border border-purple-500/30">
                    <PencilRuler className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold tracking-wider text-sm">BUILDER TOOLS</h2>
                    <p className="text-purple-400/70 text-[10px] font-mono tracking-widest uppercase">EDIT MODE ACTIVE</p>
                  </div>
                </div>
              </div>

              {/* Tool List */}
              <div className="p-4 space-y-2">
                {tools.map((tool) => {
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isActive 
                          ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <tool.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                      <div className="text-left flex-1">
                        <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                          {tool.label}
                        </div>
                        <div className="text-[10px] text-zinc-500">{tool.desc}</div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_#a855f7]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Global Settings */}
              <div className="px-4 py-4 border-t border-white/10 bg-black/40">
                <Button variant="outline" className="w-full bg-black/50 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Global Event Settings
                </Button>
              </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
