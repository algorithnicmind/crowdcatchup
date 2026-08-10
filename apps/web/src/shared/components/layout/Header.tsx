'use client';

import React, { useState, useEffect } from 'react';
import { useCrowdStore } from '../../../stores/crowd-store';
import { useUiStore } from '../../../stores/ui-store';
import { VENUE_PRESETS } from '../../../shared/lib/venue-presets';
import { Shield, Sparkles, FileText, MapPin, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const { selectedVenueId, selectVenue, telemetry } = useCrowdStore();
  const { setSitrepModalOpen, isVoiceAssistantActive, setVoiceAssistantActive } = useUiStore();

  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-IN', { hour12: false }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full glass-panel border-b border-slate-700/80 px-4 py-3 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold font-mono text-slate-100 tracking-wider">
                CROWDSHIELD AI
              </h1>
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                TECHNOVA 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Multi-Source Stampede Early Warning & Countermeasure System
            </p>
          </div>
        </div>

        {/* Controls & Triggers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Venue Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedVenueId}
              onChange={(e) => selectVenue(e.target.value)}
              className="bg-transparent text-xs font-mono text-slate-200 outline-none cursor-pointer"
            >
              {Object.values(VENUE_PRESETS).map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-slate-200">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* System Clock */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeString || '12:00:00'} IST</span>
          </div>

          {/* Shield-AI Voice Copilot Trigger */}
          <button
            onClick={() => setVoiceAssistantActive(!isVoiceAssistantActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isVoiceAssistantActive
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> VOICE COPILOT
          </button>

          {/* SITREP Executive Report Trigger */}
          <button
            onClick={() => setSitrepModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> GENAI SITREP
          </button>
        </div>
      </div>
    </header>
  );
};
