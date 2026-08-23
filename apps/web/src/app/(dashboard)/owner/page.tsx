'use client';

import React from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { OwnerPropertiesPanel } from '@/components/dashboard/owner/OwnerPropertiesPanel';
import { SimulationDock } from '@/components/dashboard/owner/SimulationDock';
import { useGpsTelemetry } from '@/shared/hooks/useGpsTelemetry';

export default function OwnerDashboard() {
  // Wire up global GPS Telemetry
  useGpsTelemetry('owner', "EVT-001");
  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-black">
      {/* 1. Base Map Layer */}
      <DigitalTwinMap role="owner" />
      
      {/* 2. Properties Panel (Right) */}
      <OwnerPropertiesPanel />
      
      {/* 4. Simulation Dock (Bottom) */}
      <SimulationDock />
    </div>
  );
}
