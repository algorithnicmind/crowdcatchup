'use client';

import React from 'react';
import { BellRing, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useMapStore } from '@/stores/map-store';

export default function CitizenAlertsPage() {
  const recommendations = useMapStore((state) => state.activeRecommendations);

  // In a real scenario, these would come from a dedicated citizen alerts endpoint or WS channel
  // We'll mock some citizen-facing alerts, plus map the backend recommendations to safe alerts
  
  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <BellRing className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Safety Alerts</h1>
        </div>
        
        {/* Live Alerts Stream */}
        <div className="space-y-4">
          
          <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl flex gap-4 shadow-lg shadow-emerald-900/20">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Safe Route Updated</h3>
              <p className="text-sm text-zinc-300">Your requested route to Gate G5 remains clear. Estimated time is 25 minutes.</p>
              <span className="text-xs text-zinc-500">Just now</span>
            </div>
          </div>

          {recommendations.map(rec => (
            <div key={rec.recommendation_id} className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-xl flex gap-4 shadow-lg shadow-orange-900/20">
              <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-orange-400 font-bold text-sm tracking-widest uppercase">Congestion Advisory</h3>
                <p className="text-sm text-zinc-300">
                  We are experiencing high density near {rec.zone_id}. Please use alternate routes if possible. Security teams are actively managing the area.
                </p>
                <span className="text-xs text-zinc-500">2 mins ago</span>
              </div>
            </div>
          ))}

          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-4 shadow-lg shadow-blue-900/20">
            <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-blue-400 font-bold text-sm tracking-widest uppercase">Event Announcement</h3>
              <p className="text-sm text-zinc-300">The main procession will begin in 45 minutes. Please ensure you are settled in your designated viewing zones.</p>
              <span className="text-xs text-zinc-500">1 hour ago</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
