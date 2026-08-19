'use client';

import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { OwnerPropertiesPanel } from '@/components/dashboard/owner/OwnerPropertiesPanel';
import { SimulationDock } from '@/components/dashboard/owner/SimulationDock';

export default function OwnerDashboard() {
  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      {/* 1. Base Map Layer */}
      <GoogleEventMap role="owner" />
      
      {/* 2. Properties Panel (Right) */}
      <OwnerPropertiesPanel />
      
      {/* 4. Simulation Dock (Bottom) */}
      <SimulationDock />
    </div>
  );
}
