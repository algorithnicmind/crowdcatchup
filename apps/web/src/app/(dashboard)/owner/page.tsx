'use client';

import React, { useState, useEffect } from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { OwnerPropertiesPanel } from '@/components/dashboard/owner/OwnerPropertiesPanel';
import { SimulationDock } from '@/components/dashboard/owner/SimulationDock';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';
import { useMapStore } from '@/stores/map-store';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerDashboard() {
  const { activeEventId, setActiveEventId } = useMapStore();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expected_attendance: '',
    max_capacity: ''
  });

  useGpsTelemetry('owner', activeEventId || '');

  const loadEvents = () => {
    setLoading(true);
    apiClient('/events')
      .then((data: any) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!activeEventId) {
      loadEvents();
    }
  }, [activeEventId]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiClient('/events', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          expected_attendance: parseInt(formData.expected_attendance) || 0,
          max_capacity: parseInt(formData.max_capacity) || 0,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 86400000).toISOString(),
          venue_polygon: [
            {"lat": 20.4789, "lng": 85.8741},
            {"lat": 20.4799, "lng": 85.8741},
            {"lat": 20.4799, "lng": 85.8751},
            {"lat": 20.4789, "lng": 85.8751}
          ]
        })
      });
      toast.success('Event created successfully!');
      setShowCreate(false);
      loadEvents();
    } catch (err: any) {
      toast.error('Failed to create event: ' + (err.message || 'Unknown error'));
    }
  };

  if (!activeEventId) {
    return (
      <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">EVENT MANAGEMENT</h1>
            <p className="text-zinc-400">Select an event to configure its Digital Twin, or create a new one.</p>
          </div>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? 'CANCEL' : <><Plus className="w-5 h-5 mr-2" /> NEW EVENT</>}
          </Button>
        </div>

        {showCreate ? (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 md:p-8 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" /> Event Configuration
            </h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Event Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 focus:outline-none" 
                  placeholder="e.g. TechNova Music Festival"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 focus:outline-none h-24" 
                  placeholder="Event details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Expected Attendance</label>
                  <input 
                    type="number" 
                    required
                    value={formData.expected_attendance}
                    onChange={(e) => setFormData({...formData, expected_attendance: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 focus:outline-none" 
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Max Capacity (Hard Limit)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({...formData, max_capacity: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 focus:outline-none" 
                    placeholder="e.g. 7500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 font-bold mt-4">
                CREATE EVENT & GENERATE DIGITAL TWIN
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-zinc-500 animate-pulse">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="col-span-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                You haven't created any events yet.
              </div>
            ) : (
              events.map((ev) => (
                <div 
                  key={ev.id} 
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer"
                  onClick={() => setActiveEventId(ev.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{ev.name}</h3>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">
                      {ev.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(ev.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Settings className="w-4 h-4" />
                      <span>Capacity: {ev.max_capacity}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold">
                    CONFIGURE DIGITAL TWIN
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black flex">
      {/* 1. Base Map Layer */}
      <div className="flex-1 relative">
        <DigitalTwinMap role="owner" />
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-50">
          <Button variant="outline" className="bg-black/50 backdrop-blur border-zinc-700 text-white" onClick={() => setActiveEventId(null)}>
            &larr; Switch Event
          </Button>
        </div>
      </div>
      
      {/* 2. Properties Panel (Right) */}
      <OwnerPropertiesPanel />
      
      {/* 4. Simulation Dock (Bottom) */}
      <SimulationDock />
    </div>
  );
}
