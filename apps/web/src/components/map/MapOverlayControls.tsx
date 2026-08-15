import React from 'react';
import { SearchBar } from './SearchBar';
import { LayerMenu } from './LayerMenu';
import { RoutingPanel } from './RoutingPanel';
import { CompassButton } from './CompassButton';
import { ShieldAlert, Users, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { MagicCard } from '@/components/ui/magic-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function MapOverlayControls() {
  return (
    <>
      {/* Search Bar - Top Left Overlay */}
      <SearchBar />

      {/* Routing Panel - Hidden by default, toggled via button */}
      <RoutingPanel />

      {/* Action Buttons - Top Right Overlay */}
      <MapControl position={ControlPosition.RIGHT_TOP}>
        <div className="flex flex-col gap-3 mt-6 mr-6 pointer-events-auto">
          <LayerMenu />
          
          <CompassButton />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg hover:bg-zinc-800 text-blue-400">
                <ShieldAlert className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-zinc-900 border-zinc-800 text-zinc-300">
              <p>Report Incident</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </MapControl>

      {/* Risk Summary Widget - Bottom Left Overlay */}
      <div className="absolute bottom-8 left-6 z-50 w-72 pointer-events-auto">
        <MagicCard
          mode="orb"
          glowFrom="#ef4444" // red-500
          glowTo="#3b82f6" // blue-500
          className="bg-zinc-900/90 backdrop-blur-xl border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
        >
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Event Status</h3>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <Users className="h-4 w-4" /> Density
              </span>
              <span className="text-sm font-bold text-emerald-400">1.8 p/m²</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <Navigation2 className="h-4 w-4" /> Flow Conflict
              </span>
              <span className="text-sm font-bold text-red-400 animate-pulse">DETECTED</span>
            </div>
            
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 w-3/4"></div>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>Safe</span>
              <span>Warning</span>
            </div>
          </div>
        </MagicCard>
      </div>
    </>
  );
}
