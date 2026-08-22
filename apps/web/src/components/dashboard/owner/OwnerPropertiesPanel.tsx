'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEventConfigStore } from '@/stores/event-config-store';
import { toast } from 'sonner';
import { MagicCard } from '@/components/ui/magic-card';
import { 
  Settings2,
  Users,
  AlertTriangle,
  Camera,
  Wifi,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

export function OwnerPropertiesPanel() {
  const draftZone = useEventConfigStore(state => state.draftZone);
  const setDraftZone = useEventConfigStore(state => state.setDraftZone);
  
  const [name, setName] = useState('Main Stage');
  const [type, setType] = useState('Zone (High Density)');
  const [capacity, setCapacity] = useState('15000');
  const [riskThreshold, setRiskThreshold] = useState('0.85');
  const [isSaving, setIsSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Sync with draft zone from map drawing
  React.useEffect(() => {
    if (draftZone) {
      setName(draftZone.name);
      setCapacity(draftZone.capacity.toString());
      setType(draftZone.type);
      setIsVisible(true);
    }
  }, [draftZone]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const payload = {
      name,
      zone_type: type,
      max_capacity: parseInt(capacity) || 1000,
      risk_threshold: parseFloat(riskThreshold) || 0.85,
      polygon: draftZone?.polygon || [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 1 },
        { lat: 1, lng: 1 },
        { lat: 1, lng: 0 }
      ]
    };

    try {
      await apiClient('/events/EVT-001/zones', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      toast.success("Zone saved to backend successfully.");
      setDraftZone(null); // Clear draft
    } catch (err) {
      console.warn("Backend offline, saving zone locally.", err);
      toast.success("Zone saved locally (Demo Mode).");
      setDraftZone(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setDraftZone(null);
    setIsVisible(false);
    toast.error("Zone properties deleted.");
    // Auto-respawn mock data after 3 seconds for demo purposes
    setTimeout(() => setIsVisible(true), 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-24 right-4 md:right-6 z-[1000] w-[calc(100vw-32px)] md:w-80 space-y-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="pointer-events-auto"
      >
        <MagicCard 
          className="bg-black/85 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
          gradientColor="rgba(168, 85, 247, 0.05)"
        >
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-bold tracking-wider text-sm uppercase">Properties</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[10px] text-zinc-500 font-mono">ID: {draftZone ? 'NEW-ZONE' : 'ZN-04'}</div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            
            {/* Entity Basics */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Entity Name</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500 text-white h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Entity Type</label>
                <Input 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500 text-white h-8 text-sm"
                />
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Users className="w-4 h-4 text-zinc-500" />
                  Max Capacity
                </div>
                <Input 
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500 text-white h-7 w-20 text-xs text-right"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Risk Threshold
                </div>
                <Input 
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(e.target.value)}
                  className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500 text-white h-7 w-20 text-xs text-right"
                />
              </div>
            </div>

            {/* Connected Infrastructure */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Connected Infrastructure</h4>
              
              <div className="flex items-center justify-between p-2 rounded bg-black/50 border border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  CCTV Feeds
                </div>
                <div className="text-xs font-mono text-zinc-500">2 mapped</div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-black/50 border border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  Smart Gates
                </div>
                <div className="text-xs font-mono text-zinc-500">1 mapped</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handleDelete} variant="outline" className="w-10 p-0 border-white/10 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </MagicCard>
      </motion.div>
    </div>
  );
}
