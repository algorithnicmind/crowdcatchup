import { useState, useEffect } from 'react';

export function useGpsTelemetry(role: 'citizen' | 'police' | 'authority' | 'owner', eventId: string = 'EVT-001') {
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [deviceId] = useState(() => `${role}-` + Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    let watchId: number;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          setIsSharingLocation(true);
          
          // Save to local store so we can display it on the map immediately
          const { useMapStore } = await import('@/stores/map-store');
          useMapStore.getState().setCitizenLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          // Send telemetry to backend with a 4s timeout to avoid ERR_EMPTY_RESPONSE
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 4000);
            const { apiClient } = await import('@/lib/api-client');
            await apiClient('/adapters/gps/telemetry', {
              method: 'POST',
              signal: controller.signal,
              body: JSON.stringify({
                device_id: deviceId,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                event_id: eventId
              })
            });
            clearTimeout(timer);
          } catch {
            // Backend offline or timed out — location is still shown on local map
          }
        },
        () => {/* GPS denied — handled silently */},
        { enableHighAccuracy: false, maximumAge: 30000, timeout: 10000 }
      );
    }
    
    return () => {
      if (watchId !== undefined && typeof window !== 'undefined') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [role, eventId, deviceId]);

  return {
    isSharingLocation,
    deviceId
  };
}
