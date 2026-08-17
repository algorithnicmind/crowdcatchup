import React from 'react';
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

interface PoliceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PoliceSettingsModal({ open, onOpenChange }: PoliceSettingsModalProps) {
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
        <div className="flex px-8 py-6 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
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
                  <div className="text-lg font-bold text-white">Officer-4</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">ID: CSD-8924-X</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Callsign</label>
                  <Input 
                    defaultValue="Bravo-Actual" 
                    className="bg-[#1e293b]/50 border-transparent focus-visible:ring-1 focus-visible:ring-[#3b82f6] text-white h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Assigned Zone</label>
                  <Input 
                    defaultValue="Sector 7G (Downtown)" 
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
                  <Switch defaultChecked className="data-[state=checked]:bg-[#3b82f6]" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Tactical Haptics</div>
                    <div className="text-xs text-zinc-400">Vibrate device on proximity warnings.</div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#3b82f6]" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Radio Chatter Transcription</div>
                    <div className="text-xs text-zinc-400">Display live captions for encrypted comms.</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#3b82f6]" />
                </div>

                <div className="pt-2">
                  <div className="text-xs text-zinc-400 mb-3">Alert Volume</div>
                  <Slider defaultValue={[80]} max={100} step={1} className="[&_[role=slider]]:bg-[#93c5fd] [&_[role=slider]]:border-none" />
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
                <button className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded bg-[#1e293b]/50 border border-[#4b5563] text-[#93c5fd] hover:bg-[#1e293b] transition-colors">
                  <Layers className="w-5 h-5" />
                  <span className="text-xs font-medium">Dark Tactical (Default)</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded bg-[#0b101e] border border-[#1e293b] text-zinc-400 hover:bg-[#1e293b]/30 hover:text-white transition-colors">
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
                  <Switch defaultChecked className="data-[state=checked]:bg-[#3b82f6]" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Unit Radar Overlay</div>
                    <div className="text-xs text-zinc-400">Show allied units within 500m radius.</div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#3b82f6]" />
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
          <Button onClick={() => onOpenChange(false)} className="bg-[#93c5fd] text-black font-semibold hover:bg-[#60a5fa]">
            Save Configuration
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
