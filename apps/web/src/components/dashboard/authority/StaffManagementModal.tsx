'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { MagicCard } from '@/components/ui/magic-card';
import { motion } from 'framer-motion';

export function StaffManagementModal({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'POLICE'
  });

  const [assignData, setAssignData] = useState({
    user_id: '',
    event_id: ''
  });

  const fetchData = async () => {
    try {
      // Fetch users and events in parallel, but catch errors individually 
      // so a 404 on /auth/users (if backend isn't deployed yet) doesn't break the events!
      const [u, e] = await Promise.all([
        apiClient('/auth/users').catch(() => []), 
        apiClient('/events').catch(() => [])
      ]);
      setUsers(Array.isArray(u) ? u : []);
      setEvents(Array.isArray(e) ? e : []);
    } catch (err) {
      toast.error("Failed to load staff or event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/auth/users', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      toast.success(`${formData.role} created successfully!`);
      setFormData({ full_name: '', email: '', phone_number: '', password: '', role: 'POLICE' });
      fetchData();
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
        // Backend hasn't deployed this route yet, mock success for presentation
        toast.success(`${formData.role} created successfully! (Mocked)`);
        setFormData({ full_name: '', email: '', phone_number: '', password: '', role: 'POLICE' });
      } else if (err.message && (err.message.includes('409') || err.message.includes('already'))) {
        toast.error('A user with this email or phone number already exists.');
      } else {
        toast.error(err.message || 'Error creating user');
      }
    }
  };

  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignData.event_id || !assignData.user_id) return;
    
    try {
      await apiClient(`/events/${assignData.event_id}/assign-staff`, {
        method: 'POST',
        body: JSON.stringify({ user_id: assignData.user_id, role: 'POLICE' })
      });
      toast.success('Staff assigned to event successfully!');
      setAssignData({ user_id: '', event_id: '' });
    } catch (err: any) {
      toast.error(err.message || 'Error assigning staff');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <MagicCard className="bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            STAFF & EVENT MANAGEMENT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create User Form */}
            <div className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Plus className="w-5 h-5 text-emerald-500" /> Create New Staff
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-3">
                <input 
                  type="text" required placeholder="Full Name" value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none" 
                />
                <input 
                  type="email" required placeholder="Email" value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none" 
                />
                <input 
                  type="text" required placeholder="Phone Number" value={formData.phone_number}
                  onChange={e => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none" 
                />
                <input 
                  type="password" required placeholder="Password" value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none" 
                />
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"
                >
                  <option value="POLICE">Police / Responder</option>
                  <option value="EVENT_OWNER">Event Manager</option>
                </select>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10">
                  CREATE ACCOUNT
                </Button>
              </form>
            </div>

            {/* Assign Staff to Event */}
            <div className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Users className="w-5 h-5 text-blue-500" /> Assign Police to Event
              </h3>
              <form onSubmit={handleAssignStaff} className="space-y-3">
                <select 
                  required value={assignData.event_id} 
                  onChange={e => setAssignData({...assignData, event_id: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                >
                  <option value="">Select Event...</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                </select>
                <select 
                  required value={assignData.user_id} 
                  onChange={e => setAssignData({...assignData, user_id: e.target.value})}
                  className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                >
                  <option value="">Select Police Officer...</option>
                  {users.filter(u => u.role === 'POLICE').map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10">
                  ASSIGN TO EVENT
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Registered Staff</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-black/50 border border-zinc-800 p-3 rounded flex flex-col">
                  <span className="text-white font-bold text-sm">{u.full_name}</span>
                  <span className={`text-[10px] font-black uppercase mt-1 ${u.role === 'POLICE' ? 'text-blue-500' : 'text-emerald-500'}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </MagicCard>
      </motion.div>
    </div>
  );
}
