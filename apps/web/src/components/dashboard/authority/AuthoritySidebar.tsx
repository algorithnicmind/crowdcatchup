'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  Video, 
  Users, 
  Activity,
  Layers,
  LayoutGrid,
  X,
  Database
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useMapStore } from '@/stores/map-store';
import { MagicCard } from '@/components/ui/magic-card';
import { DatabaseViewerModal } from './DatabaseViewerModal';

export function AuthoritySidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'controls' | 'metrics'>('controls');

  const { heatmapEnabled, setHeatmapEnabled } = useMapStore();
  const [cctvEnabled, setCctvEnabled] = useState(true);
  const [policeUnitsEnabled, setPoliceUnitsEnabled] = useState(true);
  const [smartGatesEnabled, setSmartGatesEnabled] = useState(true);
  const [isDbViewerOpen, setIsDbViewerOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden absolute top-24 left-4 z-[1000] p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-emerald-400 shadow-xl"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>

      {/* Sidebar Panel */}
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
              gradientColor="rgba(16, 185, 129, 0.05)"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <ShieldAlert className="w-5 h-5 text-emerald-400" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold tracking-wider text-sm">AUTHORITY COMMAND</h2>
                    <p className="text-emerald-400/70 text-[10px] font-mono tracking-widest uppercase">SYS-ACTIVE // SECURE</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('controls')}
                  className={`flex-1 py-2 text-xs font-semibold tracking-wider transition-colors ${activeTab === 'controls' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  MAP CONTROLS
                </button>
                <button 
                  onClick={() => setActiveTab('metrics')}
                  className={`flex-1 py-2 text-xs font-semibold tracking-wider transition-colors ${activeTab === 'metrics' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  LIVE METRICS
                </button>
              </div>

              <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {activeTab === 'controls' ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" /> Overlays
                      </h3>
                      
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-zinc-300 group-hover:text-white transition-colors">
                          <Activity className={`w-4 h-4 ${heatmapEnabled ? 'text-orange-400' : 'text-zinc-500'}`} />
                          Crowd Heatmap
                        </div>
                        <Switch checked={heatmapEnabled} onCheckedChange={setHeatmapEnabled} className="data-[state=checked]:bg-orange-500" />
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-zinc-300 group-hover:text-white transition-colors">
                          <Video className={`w-4 h-4 ${cctvEnabled ? 'text-blue-400' : 'text-zinc-500'}`} />
                          CCTV Cameras
                        </div>
                        <Switch checked={cctvEnabled} onCheckedChange={setCctvEnabled} className="data-[state=checked]:bg-blue-500" />
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-zinc-300 group-hover:text-white transition-colors">
                          <Users className={`w-4 h-4 ${policeUnitsEnabled ? 'text-emerald-400' : 'text-zinc-500'}`} />
                          Police Units
                        </div>
                        <Switch checked={policeUnitsEnabled} onCheckedChange={setPoliceUnitsEnabled} className="data-[state=checked]:bg-emerald-500" />
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-zinc-300 group-hover:text-white transition-colors">
                          <MapIcon className={`w-4 h-4 ${smartGatesEnabled ? 'text-purple-400' : 'text-zinc-500'}`} />
                          Smart Gates
                        </div>
                        <Switch checked={smartGatesEnabled} onCheckedChange={setSmartGatesEnabled} className="data-[state=checked]:bg-purple-500" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-zinc-500 text-sm text-center py-8">
                      Live metrics are now populated from the database.
                    </div>
                  </div>
                )}
              </div>
              
              {/* Database Viewer Button */}
              <div className="p-4 border-t border-white/10 bg-black/40">
                <button
                  onClick={() => setIsDbViewerOpen(true)}
                  className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider rounded-lg border border-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  OPEN DATABASE VIEWER
                </button>
              </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>

      <DatabaseViewerModal 
        isOpen={isDbViewerOpen} 
        onClose={() => setIsDbViewerOpen(false)} 
      />
    </>
  );
}
