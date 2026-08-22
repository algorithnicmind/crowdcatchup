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

          try {
            const { apiClient } = await import('@/lib/api-client');
            await apiClient('/adapters/gps/telemetry', {
              method: 'POST',
              body: JSON.stringify({
                device_id: deviceId,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                event_id: eventId
              })
            });
          } catch (e) {
            console.warn(`[${role}] Failed to sync GPS telemetry (backend might be offline)`, e);
          }
        },
        (error) => console.warn(error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
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
