'use client';

import React from 'react';
import { User, Phone, Users, Save, ShieldAlert, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';

export default function CitizenProfilePage() {
  const { user } = useAuthStore();

  const handleSave = () => {
    toast.success("Profile Preferences Saved");
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <User className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Citizen Profile</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Personal Information</h2>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-400">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                defaultValue={user?.name || "Citizen User"}
                readOnly
              />
            </div>
            
            <div className="flex-1 mt-4">
              <div className="flex items-center gap-2 text-zinc-400 mt-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email || 'No email attached'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Emergency Settings</h2>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 flex items-center gap-2"><Phone className="w-3 h-3"/> Emergency Contact Number</label>
              <input 
                type="text" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 flex items-center gap-2"><Users className="w-3 h-3"/> Default Group Size</label>
              <select className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                <option value="1">Solo (1)</option>
                <option value="2">Couple (2)</option>
                <option value="4">Family (3-5)</option>
                <option value="10">Large Group (6+)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
          <Button 
            variant="outline" 
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={() => {
              toast.error("SOS Test Signal Broadcasted Successfully! Emergency contacts notified.", {
                duration: 4000,
                style: { background: '#ef4444', color: 'white', border: 'none' }
              });
            }}
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Test SOS Signal
          </Button>
          
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>

      </div>
    </div>
  );
}
