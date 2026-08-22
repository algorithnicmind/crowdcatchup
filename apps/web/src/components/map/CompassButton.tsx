'use client';

import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { useMap } from '@vis.gl/react-google-maps';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function CompassButton() {
  const map = useMap();
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isTracking) return;

    // Use DeviceOrientationEvent for real compass heading on mobile
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // 'webkitCompassHeading' is available on iOS; 'alpha' on Android
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ios = (event as any).webkitCompassHeading;
      if (typeof ios === 'number') {
        setDeviceHeading(ios);
        if (map) map.setHeading(ios);
      } else if (event.alpha !== null) {
        const heading = 360 - event.alpha;
        setDeviceHeading(heading);
        if (map) map.setHeading(heading);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.addEventListener('deviceorientation', handleOrientation as EventListener, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    };
  }, [isTracking, map]);

  const handleClick = async () => {
    if (isTracking) {
      // Stop tracking — reset north
      setIsTracking(false);
      setDeviceHeading(null);
      if (map) {
        map.setHeading(0);
        map.setTilt(0);
      }
      return;
    }

    // Request permission on iOS 13+
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DeviceOrientationEventAny = DeviceOrientationEvent as any;
    if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEventAny.requestPermission();
        if (permission !== 'granted') return;
      } catch {
        return;
      }
    }
    setIsTracking(true);
  };

  const displayHeading = deviceHeading ?? 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          onClick={handleClick}
          className={`h-12 w-12 rounded-full backdrop-blur-md border shadow-lg transition-all ${
            isTracking
              ? 'bg-blue-600/90 border-blue-400 text-white'
              : 'bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 text-white'
          }`}
        >
          <Compass
            className="h-6 w-6"
            style={{
              transform: `rotate(${-displayHeading}deg)`,
              color: isTracking ? 'white' : '#ef4444',
              transition: 'transform 0.2s ease-out'
            }}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-zinc-900 border-zinc-800 text-zinc-300">
        <p>{isTracking ? 'Tap to reset north' : 'Tap to enable compass'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
