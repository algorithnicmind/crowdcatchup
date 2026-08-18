'use client';

import React, { useState } from 'react';
import { CrowdState } from '@/stores/map-store';

export function WhatIfModal({ eventId }: { eventId: string }) {
  const [zoneId, setZoneId] = useState('ZONE-A');
  const [action, setAction] = useState('close_gate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ projected_state: CrowdState, ripple_effects: string[] } | null>(null);

  const runWhatIf = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/simulation/what-if`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          zone_id: zoneId,
          action: action,
          modifications: {}
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Failed to run what-if");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold text-white/90 mb-3">What-If Analysis</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-white/50 block mb-1">Target Zone</label>
          <select 
            value={zoneId} 
            onChange={e => setZoneId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="ZONE-A">ZONE-A</option>
            <option value="ZONE-B">ZONE-B</option>
            <option value="ZONE-C">ZONE-C</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-white/50 block mb-1">Hypothetical Action</label>
          <select 
            value={action} 
            onChange={e => setAction(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="close_gate">Close Main Gate</option>
            <option value="open_gate">Open Emergency Exits</option>
            <option value="deploy_police">Deploy Police Officers</option>
          </select>
        </div>

        <button
          onClick={runWhatIf}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-md text-sm transition-colors mt-2"
        >
          {loading ? 'Predicting...' : 'Run Prediction Model'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-md">
            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider border-b border-white/10 pb-1">Projected Outcome</h4>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/70">New Risk Score:</span>
              <span className={`text-sm font-bold ${
                result.projected_state.risk_level === 'CRITICAL' ? 'text-red-500' :
                result.projected_state.risk_level === 'HIGH' ? 'text-orange-500' :
                result.projected_state.risk_level === 'MODERATE' ? 'text-yellow-500' : 'text-emerald-500'
              }`}>
                {result.projected_state.risk_score.toFixed(1)} ({result.projected_state.risk_level})
              </span>
            </div>
            
            <div className="space-y-1">
              {result.ripple_effects.map((effect, idx) => (
                <div key={idx} className="text-xs text-white/60 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
