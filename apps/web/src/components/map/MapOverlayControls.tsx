import React from 'react';
import { ShieldAlert, Users, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagicCard } from '@/components/ui/magic-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMapStore } from '@/stores/map-store';

interface MapOverlayControlsProps {
  role?: 'authority' | 'police' | 'citizen' | 'owner';
}

export function MapOverlayControls({ role = 'authority' }: MapOverlayControlsProps) {
  const showEventStatus = role === 'authority' || role === 'owner';

  const { liveCrowdState, liveRisk } = useMapStore();
  
  const zones = Object.values(liveCrowdState);
  const risks = Object.values(liveRisk);

  let maxRiskScore = 0;
  let totalPeople = 0;
  let hasFlowConflict = false;

  if (zones.length > 0) {
    totalPeople = zones.reduce((sum, zone) => sum + (zone.estimated_people || 0), 0);
    hasFlowConflict = zones.some(z => z.flow_direction === 'CONFLICT' || z.bottleneck_score > 70);
  }

  if (risks.length > 0) {
    maxRiskScore = Math.max(...risks.map(r => r.risk_score || 0));
  }

  return (
    <>
      {/* Action Buttons - Top Right Overlay */}
      <div className="absolute top-6 right-6 z-50 pointer-events-auto flex flex-col gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg hover:bg-zinc-800 text-blue-400"
              onClick={async () => {
                try {
                  const res = await fetch('https://localhost:8000/api/v1/simulation/scenario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event_id: 'EVT-001', scenario_id: 'crowd_surge' })
                  });
                  if (!res.ok) console.error('Failed to trigger simulation');
                } catch (e) {
                  console.error('Simulation error:', e);
                }
              }}
            >
              <ShieldAlert className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-zinc-900 border-zinc-800 text-zinc-300">
            <p>Simulate AI Incident</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Risk Summary Widget */}
      {showEventStatus && (
        <div className="absolute bottom-8 left-6 z-50 w-72 pointer-events-auto">
          <MagicCard
            mode="orb"
            glowFrom={maxRiskScore > 75 ? "#ef4444" : maxRiskScore > 40 ? "#f59e0b" : "#3b82f6"} 
            glowTo={maxRiskScore > 75 ? "#f97316" : "#3b82f6"}
            className="bg-zinc-900/90 backdrop-blur-xl border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
          >
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Event Status</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Peak Density
                </span>
                <span className={`text-sm font-bold ${maxRiskScore > 75 ? 'text-red-400' : maxRiskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {totalPeople > 0 ? (totalPeople / 10000).toFixed(1) : "1.2"} p/m²
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <Navigation2 className="h-4 w-4" /> Flow Conflict
                </span>
                {hasFlowConflict ? (
                  <span className="text-sm font-bold text-red-400 animate-pulse">DETECTED</span>
                ) : (
                  <span className="text-sm font-bold text-emerald-400">CLEAR</span>
                )}
              </div>
              
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full bg-gradient-to-r ${maxRiskScore > 75 ? 'from-amber-500 to-red-500' : 'from-emerald-500 to-amber-500'}`} 
                  style={{ width: `${Math.max(20, maxRiskScore)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>Safe</span>
                <span>Warning</span>
              </div>
            </div>
          </MagicCard>
        </div>
      )}
    </>
  );
}
