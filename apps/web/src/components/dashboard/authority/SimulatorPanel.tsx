'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';

const SCENARIOS = [
  { id: 'normal', name: '🟢 Normal Flow', desc: 'Standard crowd movement' },
  { id: 'sudden_surge', name: '⚠️ Sudden Surge (Gate A)', desc: 'High entry rate at Gate A' },
  { id: 'crowd_surge', name: '🚨 Extreme Crowd Surge (Zone B)', desc: 'Massive density spike in Zone B' },
  { id: 'gate_blockage', name: '🛑 Gate Blockage', desc: 'Gate B exit rate plummets' }
];

export function SimulatorPanel() {
  const [loading, setLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const triggerScenario = async (scenarioId: string) => {
    setLoading(true);
    setActiveScenario(scenarioId);
    try {
      await apiClient('/simulation/scenario', {
        method: 'POST',
        body: JSON.stringify({
          event_id: 'EVT-001',
          scenario_id: scenarioId
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 w-[400px] shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="animate-pulse h-2 w-2 rounded-full bg-red-500"></span>
          Live Simulator Controls
        </h3>
        <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">HACKATHON DEMO</span>
      </div>
      
      <div className="space-y-2">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => triggerScenario(scenario.id)}
            disabled={loading}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              activeScenario === scenario.id 
                ? 'bg-white/10 border-white/30 text-white' 
                : 'bg-black/50 border-white/5 text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="font-medium">{scenario.name}</div>
            <div className="text-xs opacity-70 mt-1">{scenario.desc}</div>
          </button>
        ))}
      </div>
      
      {activeScenario && (
        <div className="mt-4 text-xs text-center text-green-400 animate-pulse">
          Simulating data injection into Fusion Engine...
        </div>
      )}
    </div>
  );
}
