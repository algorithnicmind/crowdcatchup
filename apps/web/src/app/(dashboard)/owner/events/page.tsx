'use client';

import React from 'react';
import { Calendar, Plus, Settings2, BarChart2, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OwnerEventsPage() {
  const router = useRouter();

  const events = [
    {
      id: 'EVT-001',
      name: 'TechNova 2026',
      status: 'LIVE',
      attendees: 14200,
      risk: 'MODERATE',
      date: 'Aug 24, 2026'
    },
    {
      id: 'EVT-002',
      name: 'Maha Kumbh Draft',
      status: 'DRAFT',
      attendees: 0,
      risk: 'LOW',
      date: 'Jan 14, 2027'
    }
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Event Management</h1>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div key={evt.id} className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-50" />
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{evt.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">{evt.id} • {evt.date}</p>
                </div>
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  evt.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                  'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {evt.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-800/50">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Attendees</div>
                  <div className="text-xl font-bold text-white">{evt.attendees.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Risk Level</div>
                  <div className={`text-sm font-bold ${evt.risk === 'MODERATE' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                    {evt.risk}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-2">
                <Button 
                  onClick={() => router.push('/owner')}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-8"
                >
                  <Map className="w-3.5 h-3.5 mr-2" />
                  Venue Map
                </Button>
                <Button variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs h-8">
                  <Settings2 className="w-3.5 h-3.5 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
