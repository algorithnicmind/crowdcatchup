'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const SCENARIOS = [
  { id: 'normal', name: 'Normal Flow', desc: 'Baseline operations.' },
  { id: 'sudden_surge', name: 'Sudden Surge', desc: 'Massive influx at Gate A.' },
  { id: 'gate_blockage', name: 'Gate Blocked', desc: 'Gate B fails, exit rate drops to 0.' },
  { id: 'crowd_surge', name: 'Extreme Crowd Surge', desc: 'Zone B exceeds 2500 people rapidly.' }
];

export function ScenarioController({ eventId }: { eventId: string }) {
  const [activeScenario, setActiveScenario] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);

  const triggerScenario = async (scenarioId: string) => {
    setIsLoading(true);
    try {
      await apiClient('/simulation/scenario', {
        method: 'POST',
        body: JSON.stringify({ event_id: eventId, scenario_id: scenarioId })
      });
      setActiveScenario(scenarioId);
      toast.success(`Scenario injected: ${scenarioId}`);
    } catch (err) {
      console.warn("Failed to trigger scenario (backend offline)", err);
      toast.error("Backend offline. Cannot inject scenario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white/90 mb-3">Pre-scripted Scenarios</h3>
      <div className="space-y-2">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => triggerScenario(scenario.id)}
            disabled={isLoading || activeScenario === scenario.id}
            className={`w-full text-left p-3 rounded-md transition-all ${
              activeScenario === scenario.id 
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-100' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50'
            }`}
          >
            <div className="font-medium text-sm">{scenario.name}</div>
            <div className="text-xs text-white/50 mt-1">{scenario.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
