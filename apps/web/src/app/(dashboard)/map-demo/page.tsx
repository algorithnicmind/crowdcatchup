import React from 'react';
import { GoogleEventMap } from '@/components/map/GoogleEventMap';

export default function MapDemoPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      {/* Full Bleed Google Map (Includes its own floating UI overlays) */}
      <GoogleEventMap />
    </div>
  );
}
