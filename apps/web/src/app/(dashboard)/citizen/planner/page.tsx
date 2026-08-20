'use client';

import React, { useState } from 'react';
import { Navigation, Users, Search, HeartPulse, CheckCircle, MapPin, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface SafeRoute {
  route_id: string;
  path: Array<{lat: number, lng: number}>;
  estimated_time_mins: number;
  status: string;
  warnings: string[];
}

export default function CitizenPlannerPage() {
  const [isPlanning, setIsPlanning] = useState(false);
  const [routeData, setRouteData] = useState<SafeRoute | null>(null);
  const [groupSize, setGroupSize] = useState(4);
  const [destination, setDestination] = useState("Maha Kumbh Mela - Main Ghat");

  const handlePlanRoute = async () => {
    setIsPlanning(true);
    setRouteData(null);
    try {
      const result = await apiClient<SafeRoute>('/navigation/plan', {
        method: 'POST',
        body: JSON.stringify({
          event_id: 'EVT-001',
          start_zone_id: 'Z-001',
          end_zone_id: 'Z-005',
          group_size: groupSize
        })
      });
      setRouteData(result);
    } catch (error: any) {
      toast.error(error.message || 'Failed to plan route');
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col md:flex-row bg-black relative">
      {/* Sidebar Planner Panel */}
      <div className="w-full md:w-96 bg-zinc-950 border-r border-zinc-800 flex flex-col z-10 shadow-2xl">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">Journey Planner</h1>
          </div>
          <p className="text-zinc-400 text-sm">Find the safest, AI-optimized route through the crowd.</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {!routeData ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Destination</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Where to?" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Group Size</label>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
                    <Users className="w-5 h-5 text-zinc-400" />
                    <select 
                      value={groupSize} 
                      onChange={(e) => setGroupSize(Number(e.target.value))}
                      className="bg-transparent text-white font-bold text-sm outline-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="4">4 People</option>
                      <option value="10">10+ People</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Special Needs</label>
                  <button className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-colors">
                    <HeartPulse className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-sm">Medical</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-300 leading-relaxed">
                    Routes are calculated in real-time to avoid high-density zones and bottlenecks.
                  </p>
                </div>
              </div>

              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-sm shadow-lg shadow-emerald-900/20"
                onClick={handlePlanRoute}
                disabled={isPlanning}
              >
                {isPlanning ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    CALCULATING SAFE ROUTE...
                  </span>
                ) : (
                  "FIND SAFE ROUTE"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5 shadow-lg shadow-emerald-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Safe Route Found</span>
                  </div>
                  <div className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    {Math.round(routeData.estimated_time_mins)} MIN
                  </div>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:to-blue-500">
                  <div className="relative flex items-start gap-4">
                    <div className="absolute left-[-29px] bg-black p-1 rounded-full">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Current Location</h4>
                      <p className="text-xs text-zinc-500">Sector 4, Entry Plaza</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className="absolute left-[-29px] bg-black p-1 rounded-full">
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-emerald-400 font-bold text-sm">Follow safe path</h4>
                      <p className="text-xs text-zinc-500">
                        {routeData.warnings.length > 0 ? routeData.warnings[0] : "Clear path ahead"}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="absolute left-[-29px] bg-black p-1 rounded-full">
                      <MapPin className="w-3 h-3 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{destination}</h4>
                      <p className="text-xs text-zinc-500">Destination</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 shadow-lg shadow-emerald-900/20">START NAVIGATION</Button>
                <Button variant="outline" className="flex-1 h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => setRouteData(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <GoogleEventMap role="citizen" />
      </div>
    </div>
  );
}
