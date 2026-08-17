'use client';

import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';
import { useAuthStore } from '@/stores/auth-store';

export default function MapDemoPage() {
  const { role } = useAuthStore();
  const mapRole = role === 'EVENT_OWNER' ? 'owner' : role.toLowerCase() as 'authority' | 'police' | 'citizen' | 'owner';
  
  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      {/* Full Bleed Google Map (Includes its own floating UI overlays) */}
      <GoogleEventMap role={mapRole} />
    </div>
  );
}
