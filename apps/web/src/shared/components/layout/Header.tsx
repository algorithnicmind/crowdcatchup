'use client';

import React, { useState, useEffect } from 'react';
import { useCrowdStore } from '../../../stores/crowd-store';
import { useUiStore } from '../../../stores/ui-store';
import { VENUE_PRESETS } from '../../../shared/lib/venue-presets';
import { Shield, Sparkles, FileText, MapPin, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const { selectedVenueId, selectVenue } = useCrowdStore();
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
    <header className="w-full bg-black/90 border-b border-neutral-800/80 px-4 md:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative p-2.5 rounded-2xl bg-neutral-900 text-cyan-400 border border-neutral-800 shadow-lg shadow-black">
            <Shield className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight font-mono text-white">
                CROWDSHIELD AI
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                <span className="live-dot" /> LIVE ENGINE
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono tracking-wide">
              Early Warning & Autonomous Decision Support Engine
            </span>
          </div>
        </div>

        {/* Minimalist Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Venue Pill Selector */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-1.5 transition-all">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedVenueId}
              onChange={(e) => selectVenue(e.target.value)}
              className="bg-transparent text-xs font-mono text-neutral-200 outline-none cursor-pointer font-medium"
            >
              {Object.values(VENUE_PRESETS).map((v) => (
                <option key={v.id} value={v.id} className="bg-black text-neutral-200">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* System Clock */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-400 font-medium">
            <Clock className="w-4 h-4 text-cyan-400/80" />
            <span>{timeString || '12:00:00'} IST</span>
          </div>

          {/* Shield-AI Voice Copilot Button */}
          <button
            onClick={() => setVoiceAssistantActive(!isVoiceAssistantActive)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              isVoiceAssistantActive
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-neutral-900 hover:bg-neutral-800 text-cyan-400 border border-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> VOICE COPILOT
          </button>

          {/* SITREP Executive Report Button */}
          <button
            onClick={() => setSitrepModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer hover:border-emerald-500/50"
          >
            <FileText className="w-4 h-4" /> GENAI SITREP
          </button>
        </div>
      </div>
    </header>
  );
};
