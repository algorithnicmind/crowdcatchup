'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicCard } from '@/components/ui/magic-card';
import { useMapStore, SourceHealth } from '@/stores/map-store';
import { Video, Activity, Wifi, WifiOff, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CctvGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const sourceHealth = useMapStore((state) => state.sourceHealth);

  const activeCount = sourceHealth.filter(s => s.health_status === 'ONLINE').length;
  const totalCount = Math.max(sourceHealth.length, 9); // assume 9 for demo

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-5xl pointer-events-none">
      <div className="flex justify-center mb-2 pointer-events-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-t-xl rounded-b-none border-b-0 hover:bg-white/10 hover:text-white"
        >
          <Video className="w-4 h-4 mr-2" />
          Live CCTV Feeds
          {isOpen ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronUp className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto h-64 overflow-y-auto"
          >
            <div className="flex gap-6 h-full">
              {/* Left Side: CCTV Grid (Mocked Feeds) */}
              <div className="flex-1 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((camId) => (
                  <div key={camId} className="relative bg-gray-900 rounded-lg border border-white/5 overflow-hidden group">
                    {/* Placeholder for actual video feed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black animate-pulse opacity-20" />
                    
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      REC
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-emerald-400">
                      CAM-{camId}
                    </div>
                    
                    <div className="absolute bottom-2 left-2 right-2 text-[9px] font-mono text-white/50 flex justify-between">
                      <span>FPS: 30</span>
                      <span>1080p</span>
                    </div>

                    {/* Simulating people tracking boxes */}
                    {camId === 2 && (
                      <>
                        <div className="absolute top-1/3 left-1/4 w-12 h-24 border border-emerald-500/50 rounded-sm" />
                        <div className="absolute top-1/2 left-1/2 w-10 h-20 border border-emerald-500/50 rounded-sm" />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side: Source Health Panel */}
              <div className="w-72 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-white text-sm font-semibold">Data Source Health</h3>
                  <div className="ml-auto text-xs text-gray-400">
                    {activeCount}/{totalCount} Active
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {sourceHealth.length > 0 ? sourceHealth.map((source) => (
                    <div 
                      key={source.source_id} 
                      className={`flex items-center justify-between p-2 rounded-md border ${
                        source.health_status === 'ONLINE' ? 'bg-emerald-500/5 border-emerald-500/10' :
                        source.health_status === 'DELAYED' ? 'bg-amber-500/5 border-amber-500/10' :
                        'bg-red-500/5 border-red-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {source.health_status === 'ONLINE' ? (
                          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                        ) : source.health_status === 'DELAYED' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <WifiOff className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className="text-xs text-gray-200 font-medium">{source.source_id}</span>
                      </div>
                      <span className={`text-[10px] font-bold tracking-wider ${
                        source.health_status === 'ONLINE' ? 'text-emerald-400' :
                        source.health_status === 'DELAYED' ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {source.health_status}
                      </span>
                    </div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <WifiOff className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-xs">Waiting for telemetry...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
