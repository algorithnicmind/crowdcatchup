import { useState, useEffect, useRef } from 'react';

export function useGpsTelemetry(role: 'citizen' | 'police' | 'authority' | 'owner', eventId: string = 'EVT-001') {
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const deviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Generate a pseudo-UUID for this session if not exists
    if (!deviceIdRef.current) {
      deviceIdRef.current = `${role}-` + Math.random().toString(36).substring(2, 9);
    }
    
    let watchId: number;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          setIsSharingLocation(true);
          try {
            const { apiClient } = await import('@/lib/api-client');
            await apiClient('/adapters/gps/telemetry', {
              method: 'POST',
              body: JSON.stringify({
                device_id: deviceIdRef.current,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                event_id: eventId
              })
            });
          } catch (e) {
            console.error(`[${role}] Failed to sync GPS telemetry`, e);
          }
        },
        (error) => {
          console.error(`[${role}] GPS error:`, error);
          setIsSharingLocation(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
    
    return () => {
      if (watchId !== undefined && typeof window !== 'undefined') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [role, eventId]);

  return {
    isSharingLocation,
    deviceId: deviceIdRef.current
  };
}
