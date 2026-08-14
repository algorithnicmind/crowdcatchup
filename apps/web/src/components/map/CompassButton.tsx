'use client';

import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { useMap } from '@vis.gl/react-google-maps';
import { Button } from '@/components/ui/button';

export function CompassButton() {
  const map = useMap();
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener('heading_changed', () => {
      setHeading(map.getHeading() || 0);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  // Always show the compass so the user knows it's there
  // if (heading === 0) return null;

  const resetHeading = () => {
    if (!map) return;
    map.setHeading(0);
    map.setTilt(0);
  };

  return (
    <Button 
      size="icon" 
      onClick={resetHeading}
      className="h-12 w-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg hover:bg-zinc-800 text-white transition-all"
    >
      <Compass 
        className="h-6 w-6 text-red-500" 
        style={{ transform: `rotate(${-heading}deg)` }} 
      />
    </Button>
  );
}
