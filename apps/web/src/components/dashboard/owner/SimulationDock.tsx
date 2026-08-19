'use client';

import React, { useState } from 'react';
import { Play, Pause, FastForward, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MagicCard } from '@/components/ui/magic-card';

export function SimulationDock() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `T+${m}:${s}`;
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xl px-4 pointer-events-auto">
      <MagicCard 
        className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-visible"
        gradientColor="rgba(255, 255, 255, 0.05)"
      >
        <div className="flex items-center gap-4 px-6 py-3">
          
          {/* Controls */}
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <button className="text-zinc-400 hover:text-white transition-colors p-1">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-full transition-all ${
                isPlaying 
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button 
              onClick={() => setSpeed(s => s >= 4 ? 1 : s * 2)}
              className="text-zinc-400 hover:text-white transition-colors p-1 flex items-center gap-1"
            >
              <FastForward className="w-4 h-4" />
              <span className="text-[10px] font-mono">{speed}x</span>
            </button>
          </div>

          {/* Timeline */}
          <div className="flex-1 flex items-center gap-3">
            <div className="text-xs font-mono text-purple-400 w-16 text-right">
              {formatTime(time)}
            </div>
            <Slider 
              value={[time]} 
              max={600} 
              step={1} 
              onValueChange={(val) => setTime(val[0])}
              className="flex-1 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-300" 
            />
            <div className="text-xs font-mono text-zinc-500 w-16">
              10:00
            </div>
          </div>

          {/* Add Event Injection (Simulate crisis) */}
          <div className="border-l border-white/10 pl-4">
            <Button variant="outline" size="sm" className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              Inject Scenario
            </Button>
          </div>

        </div>
      </MagicCard>
    </div>
  );
}
