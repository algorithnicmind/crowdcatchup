'use client';

import React from 'react';
import { Layers, Map as MapIcon, Image as ImageIcon, Mountain, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/stores/map-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function LayerMenu() {
  const { mapTypeId, setMapTypeId, trafficEnabled, setTrafficEnabled } = useMapStore();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg hover:bg-zinc-800 text-white">
            <Layers className="h-5 w-5" />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-zinc-900 border-zinc-800 text-zinc-300">
          <p>Map Layers</p>
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300 z-[100]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs uppercase text-zinc-500">Map Type</DropdownMenuLabel>
          
          <div className="grid grid-cols-3 gap-2 p-2">
            <button 
              onClick={() => setMapTypeId('roadmap')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 ${mapTypeId === 'roadmap' ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-zinc-800'}`}
            >
              <MapIcon className={`h-6 w-6 mb-1 ${mapTypeId === 'roadmap' ? 'text-blue-400' : 'text-zinc-400'}`} />
              <span className="text-[10px]">Default</span>
            </button>
            
            <button 
              onClick={() => setMapTypeId('satellite')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 ${mapTypeId === 'satellite' ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-zinc-800'}`}
            >
              <ImageIcon className={`h-6 w-6 mb-1 ${mapTypeId === 'satellite' ? 'text-blue-400' : 'text-zinc-400'}`} />
              <span className="text-[10px]">Satellite</span>
            </button>

            <button 
              onClick={() => setMapTypeId('terrain')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 ${mapTypeId === 'terrain' ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-zinc-800'}`}
            >
              <Mountain className={`h-6 w-6 mb-1 ${mapTypeId === 'terrain' ? 'text-blue-400' : 'text-zinc-400'}`} />
              <span className="text-[10px]">Terrain</span>
            </button>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs uppercase text-zinc-500">Map Details</DropdownMenuLabel>
          
          <div className="grid grid-cols-3 gap-2 p-2">
          <button 
            onClick={() => setTrafficEnabled(!trafficEnabled)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 ${trafficEnabled ? 'border-emerald-500 bg-emerald-500/10' : 'border-transparent hover:bg-zinc-800'}`}
          >
            <Car className={`h-6 w-6 mb-1 ${trafficEnabled ? 'text-emerald-400' : 'text-zinc-400'}`} />
            <span className="text-[10px]">Traffic</span>
          </button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
