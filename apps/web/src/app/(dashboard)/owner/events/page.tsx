'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Settings2, Map, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EventDTO {
  id: string;
  name: string;
  description: string;
  status: string;
  expected_attendance: number;
  max_capacity: number;
  start_date: string;
  end_date: string;
}

export default function OwnerEventsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expected_attendance: '',
    max_capacity: '',
    start_date: '',
    end_date: ''
  });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<EventDTO[]>('/events');
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setIsCreating(true);
      
      const payload = {
        name: formData.name,
        description: formData.description,
        expected_attendance: parseInt(formData.expected_attendance) || 0,
        max_capacity: parseInt(formData.max_capacity) || 0,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        owner_id: user.id,
        venue_polygon: [] // Will be set via map later
      };

      await apiClient('/events', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      toast.success('Event created successfully');
      setOpen(false);
      setFormData({ name: '', description: '', expected_attendance: '', max_capacity: '', start_date: '', end_date: '' });
      fetchEvents();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Event Management</h1>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-emerald-400">Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-400">Event Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-zinc-900 border-zinc-800" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-400">Description</Label>
                  <Input 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-zinc-900 border-zinc-800" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendance" className="text-zinc-400">Expected Attendance</Label>
                    <Input 
                      id="attendance" 
                      type="number"
                      required 
                      value={formData.expected_attendance}
                      onChange={(e) => setFormData({...formData, expected_attendance: e.target.value})}
                      className="bg-zinc-900 border-zinc-800" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-zinc-400">Max Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="number"
                      required 
                      value={formData.max_capacity}
                      onChange={(e) => setFormData({...formData, max_capacity: e.target.value})}
                      className="bg-zinc-900 border-zinc-800" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start" className="text-zinc-400">Start Date</Label>
                    <Input 
                      id="start" 
                      type="datetime-local"
                      required 
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="bg-zinc-900 border-zinc-800 [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end" className="text-zinc-400">End Date</Label>
                    <Input 
                      id="end" 
                      type="datetime-local"
                      required 
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="bg-zinc-900 border-zinc-800 [color-scheme:dark]" 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4 border-t border-zinc-800">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost" className="text-zinc-400 hover:text-white">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isCreating} className="bg-emerald-600 hover:bg-emerald-700">
                    {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500">No events found. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-50" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white truncate max-w-[200px]" title={evt.name}>{evt.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">
                      {new Date(evt.start_date).toLocaleDateString()}
                    </p>
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
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Expected</div>
                    <div className="text-xl font-bold text-white">{evt.expected_attendance?.toLocaleString() || 0}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Capacity</div>
                    <div className="text-sm font-bold text-zinc-300">
                      {evt.max_capacity?.toLocaleString() || 0}
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
                  <Button variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs h-8 bg-transparent">
                    <Settings2 className="w-3.5 h-3.5 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
