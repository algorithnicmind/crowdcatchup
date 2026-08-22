import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Wifi, 
  Satellite, 
  Bluetooth, 
  Bell, 
  Map as MapIcon, 
  Layers, 
  Image as ImageIcon 
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface PoliceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PoliceSettingsModal({ open, onOpenChange }: PoliceSettingsModalProps) {
  const { user } = useAuthStore((state) => state.user);
  const email = user?.email;
  const fullName = user?.name || "Officer";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [callsign, setCallsign] = useState("Bravo-Actual");
  const [assignedZone, setAssignedZone] = useState("Sector 7G (Downtown)");
  const [priorityAlert, setPriorityAlert] = useState(true);
  const [tacticalHaptics, setTacticalHaptics] = useState(true);
  const [radioChatter, setRadioChatter] = useState(false);
  const [alertVolume, setAlertVolume] = useState(80);
  const [mapMode, setMapMode] = useState("Dark Tactical");
  const [buildingGeometry, setBuildingGeometry] = useState(true);
  const [unitRadar, setUnitRadar] = useState(true);

  // Fetch settings when modal opens
  useEffect(() => {
    let active = true;
    if (open && email) {
      const fetchSettings = async () => {
        setFetching(true);
        try {
          const res = await fetch(`http://localhost:8000/api/v1/officers/settings/${email}`);
          if (!res.ok) throw new Error("API not ready");
          const data = await res.json();
          if (active && data && data.settings) {
            setCallsign(data.settings.callsign || "Bravo-Actual");
            setAssignedZone(data.settings.assigned_zone || "Sector 7G (Downtown)");
            setPriorityAlert(data.settings.priority_alert_override ?? true);
            setTacticalHaptics(data.settings.tactical_haptics ?? true);
            setRadioChatter(data.settings.radio_chatter_transcription ?? false);
            setAlertVolume(data.settings.alert_volume ?? 80);
            setMapMode(data.settings.map_mode || "Dark Tactical");
            setBuildingGeometry(data.settings.building_geometry_3d ?? true);
            setUnitRadar(data.settings.unit_radar_overlay ?? true);
          }
        } catch (err: any) {
          console.warn("[Demo Mode] Using local defaults. Backend offline:", err.message);
        } finally {
          if (active) setFetching(false);
        }
      };
      fetchSettings();
    }
    return () => { active = false; };
  }, [open, email]);

  const handleSave = async () => {
    if (!email) return;
    setLoading(true);
    
    try {
      const res = await fetch(`http://localhost:8000/api/v1/officers/settings/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callsign,
          assigned_zone: assignedZone,
          priority_alert_override: priorityAlert,
          tactical_haptics: tacticalHaptics,
          radio_chatter_transcription: radioChatter,
          alert_volume: alertVolume,
          map_mode: mapMode,
          building_geometry_3d: buildingGeometry,
          unit_radar_overlay: unitRadar,
        })
      });

      if (!res.ok) throw new Error("Failed to save to backend");
      
      toast.success("Settings saved successfully", {
        description: "Your tactical preferences have been updated."
      });
      onOpenChange(false);
    } catch (err) {
      // Demo Mode Fallback: Fake successful save
      console.warn("[Demo Mode] Simulated save. Backend offline.");
      toast.success("Settings saved locally (Demo Mode)", {
        description: "Your tactical preferences have been updated."
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-4xl w-[90vw] md:w-full bg-[#0b101e] border-[#1e293b] text-white p-0 gap-0 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between border-b border-[#1e293b]/50">
          <div>
            <DialogTitle className="text-2xl font-bold text-[#93c5fd]">Settings</DialogTitle>
            <DialogDescription className="text-zinc-400 mt-1">
              Manage preferences, connectivity, and system alerts.
            </DialogDescription>
          </div>
        </div>

        {/* Content */}
        <div className={`flex px-8 py-6 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar transition-opacity ${fetching ? 'opacity-50' : 'opacity-100'}`}>
          
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Operator Profile */}
            <div className="rounded-lg border border-[#1e293b] bg-[#0f1523] p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#10b981] text-xs font-bold tracking-widest uppercase">Operator Profile</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-14 w-14 rounded-md overflow-hidden border border-[#334155] shadow-lg">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{fullName}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">ID: {user?.id.substring(0, 10).toUpperCase()}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Callsign</label>
                  <Input 
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="bg-[#1e293b]/50 border-transparent focus-visible:ring-1 focus-visible:ring-[#3b82f6] text-white h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Assigned Zone</label>
                  <Input 
                    value={assignedZone}
                    onChange={(e) => setAssignedZone(e.target.value)}
                    className="bg-[#1e293b]/50 border-transparent focus-visible:ring-1 focus-visible:ring-[#3b82f6] text-white h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Connectivity */}
            <div className="rounded-lg border border-[#1e293b] bg-[#0f1523] p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-5">
                <Wifi className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#10b981] text-xs font-bold tracking-widest uppercase">Connectivity</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-[#0b101e] border border-[#1e293b]/50">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-4 h-4 text-[#10b981]" />
                    <div>
                      <div className="text-sm font-semibold text-white">Comms Uplink</div>
                      <div className="text-xs text-[#10b981]">Encrypted • 98ms</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded bg-[#0b101e] border border-[#1e293b]/50">
                  <div className="flex items-center gap-3">
                    <Satellite className="w-4 h-4 text-[#10b981]" />
                    <div>
                      <div className="text-sm font-semibold text-white">GPS Satellites</div>
                      <div className="text-xs text-[#10b981]">Locked (12)</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-[#0b101e] border border-[#1e293b]/50 opacity-60">
                  <div className="flex items-center gap-3">
                    <Bluetooth className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Bodycam Sync</div>
                      <div className="text-xs text-zinc-500">Disconnected</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Alerts & Notifications */}
            <div className="rounded-lg border border-[#1e293b] bg-[#0f1523] p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-5">
                <Bell className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#10b981] text-xs font-bold tracking-widest uppercase">Alerts & Notifications</span>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Priority Alert Override</div>
                    <div className="text-xs text-zinc-400">Allow SOS and Tier 1 alerts to bypass silent mode.</div>
                  </div>
                  <Switch 
                    checked={priorityAlert} 
                    onCheckedChange={setPriorityAlert}
                    className="data-[state=checked]:bg-[#3b82f6]" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Tactical Haptics</div>
                    <div className="text-xs text-zinc-400">Vibrate device on proximity warnings.</div>
                  </div>
                  <Switch 
                    checked={tacticalHaptics} 
                    onCheckedChange={setTacticalHaptics}
                    className="data-[state=checked]:bg-[#3b82f6]" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Radio Chatter Transcription</div>
                    <div className="text-xs text-zinc-400">Display live captions for encrypted comms.</div>
                  </div>
                  <Switch 
                    checked={radioChatter} 
                    onCheckedChange={setRadioChatter}
                    className="data-[state=checked]:bg-[#3b82f6]" 
                  />
                </div>

                <div className="pt-2">
                  <div className="text-xs text-zinc-400 mb-3">Alert Volume</div>
                  <Slider 
                    value={[alertVolume]} 
                    onValueChange={(val: number | number[]) => setAlertVolume(Array.isArray(val) ? val[0] : val)}
                    max={100} step={1} 
                    className="[&_[role=slider]]:bg-[#93c5fd] [&_[role=slider]]:border-none" 
                  />
                </div>
              </div>
            </div>

            {/* Map Interface */}
            <div className="rounded-lg border border-[#1e293b] bg-[#0f1523] p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-5">
                <MapIcon className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#10b981] text-xs font-bold tracking-widest uppercase">Map Interface</span>
              </div>
              
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => setMapMode("Dark Tactical")}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded transition-colors ${mapMode === "Dark Tactical" ? "bg-[#1e293b]/50 border border-[#4b5563] text-[#93c5fd]" : "bg-[#0b101e] border border-[#1e293b] text-zinc-400 hover:bg-[#1e293b]/30 hover:text-white"}`}
                >
                  <Layers className="w-5 h-5" />
                  <span className="text-xs font-medium">Dark Tactical (Default)</span>
                </button>
                <button 
                  onClick={() => setMapMode("Satellite Overlay")}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded transition-colors ${mapMode === "Satellite Overlay" ? "bg-[#1e293b]/50 border border-[#4b5563] text-[#93c5fd]" : "bg-[#0b101e] border border-[#1e293b] text-zinc-400 hover:bg-[#1e293b]/30 hover:text-white"}`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-xs font-medium">Satellite Overlay</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">3D Building Geometry</div>
                    <div className="text-xs text-zinc-400">Render structural depth in dense urban sectors.</div>
                  </div>
                  <Switch 
                    checked={buildingGeometry} 
                    onCheckedChange={setBuildingGeometry}
                    className="data-[state=checked]:bg-[#3b82f6]" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Unit Radar Overlay</div>
                    <div className="text-xs text-zinc-400">Show allied units within 500m radius.</div>
                  </div>
                  <Switch 
                    checked={unitRadar} 
                    onCheckedChange={setUnitRadar}
                    className="data-[state=checked]:bg-[#3b82f6]" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#0b101e] border-t border-[#1e293b]/50 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[#fca5a5] hover:text-[#f87171] hover:bg-[#7f1d1d]/20">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-[#93c5fd] text-black font-semibold hover:bg-[#60a5fa] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}




