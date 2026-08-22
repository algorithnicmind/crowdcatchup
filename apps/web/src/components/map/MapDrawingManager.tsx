'use client';

import { useEffect, useState, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Button } from '@/components/ui/button';
import { Save, Trash2, Route as RouteIcon, Edit3 } from 'lucide-react';
import { useMapStore } from '@/stores/map-store';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function MapDrawingManager() {
  const map = useMap();
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  // GPS Recording State
  const isRecordingGps = useMapStore(s => s.isRecordingGps);
  const setIsRecordingGps = useMapStore(s => s.setIsRecordingGps);
  const gpsSessionId = useMapStore(s => s.gpsSessionId);
  const setGpsSessionId = useMapStore(s => s.setGpsSessionId);
  const [gpsPoints, setGpsPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const gpsLineRef = useRef<google.maps.Polyline | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // GPS Recording logic
  useEffect(() => {
    if (!isRecordingGps) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsPoints(prev => [...prev, { lat, lng }]);
          
          if (gpsSessionId) {
             try {
               await apiClient(`/gps-recording/${gpsSessionId}/point`, {
                 method: 'POST',
                 body: JSON.stringify({ lat, lng })
               });
              } catch (e) {
               console.warn("Failed to send GPS point (backend offline)", e);
              }
          }
        },
        (error) => console.warn(error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isRecordingGps, gpsSessionId]);

  // GPS Drawing line
  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google) return;
    const line = new window.google.maps.Polyline({
      path: [],
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map
    });
    gpsLineRef.current = line;
    return () => {
      line.setMap(null);
      gpsLineRef.current = null;
    }
  }, [map]);

  useEffect(() => {
    if (gpsLineRef.current) {
      gpsLineRef.current.setPath(gpsPoints);
    }
  }, [gpsPoints]);

  const toggleGpsRecording = async () => {
    if (isRecordingGps) {
      setIsRecordingGps(false);
      if (gpsSessionId) {
        try {
          const data = await apiClient<any>(`/gps-recording/${gpsSessionId}/stop`, { method: 'POST' });
          console.log('[Owner] GPS Route saved:', data);
          toast.success("GPS Route saved to backend.");
        } catch(e) {
          console.warn("Failed to stop GPS recording on backend", e);
          toast.error("Backend offline. Route stopped locally.");
        } finally {
          setGpsSessionId(null);
          setGpsPoints([]); 
        }
      }
    } else {
      setGpsPoints([]);
      try {
        const data = await apiClient<any>(`/gps-recording/start`, {
          method: 'POST',
          body: JSON.stringify({ event_owner_id: 'owner-123' })
        });
        setGpsSessionId(data.session_id);
        setIsRecordingGps(true);
        toast.success("Recording GPS route...");
      } catch(e) {
        console.warn("Failed to start GPS recording on backend", e);
        toast.error("Backend offline. Cannot record GPS to server.");
        // Still toggle locally for visual effect
        setIsRecordingGps(true);
        setGpsSessionId("mock-session-" + Date.now());
      }
    }
  };


  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google) return;

    // Create a polygon that updates as we add points
    const poly = new window.google.maps.Polygon({
      paths: points,
      fillColor: '#8b5cf6',
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: '#a78bfa',
      map: map
    });

    polygonRef.current = poly;

    return () => {
      poly.setMap(null);
      polygonRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Update polygon path when points change
  useEffect(() => {
    if (polygonRef.current) {
      polygonRef.current.setPath(points);
    }
  }, [points]);

  // Handle map clicks when drawing mode is active
  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google) return;

    if (isDrawing) {
      map.setOptions({ draggableCursor: 'crosshair' });
    } else {
      map.setOptions({ draggableCursor: null });
    }

    if (!isDrawing) return;

    const clickListener = window.google.maps.event.addListener(map, 'click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setPoints(prev => [...prev, newPoint]);
      }
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
      map.setOptions({ draggableCursor: null }); // Ensure cursor is reset on unmount
    };
  }, [map, isDrawing]);

  const handleSave = () => {
    if (points.length > 2) {
      console.log('[Owner] New Zone Polygon created:', points);
      
      // Access the store directly since we only need the setter
      import('@/stores/event-config-store').then(({ useEventConfigStore }) => {
        useEventConfigStore.getState().setDraftZone({
          name: "New Zone",
          polygon: points,
          capacity: 1000,
          type: "Zone (Normal Density)"
        });
        toast.success("Zone polygon saved. Configure properties in the panel.");
      });
      
      setIsDrawing(false);
    }
  };

  const handleClear = () => {
    setPoints([]);
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-zinc-900/90 backdrop-blur-md border border-zinc-700 p-2 rounded-xl flex gap-2 shadow-2xl pointer-events-auto">
      <Button 
        variant={isDrawing ? "default" : "outline"}
        size="sm"
        className={isDrawing ? "bg-purple-600 hover:bg-purple-700 text-white" : "text-zinc-300"}
        onClick={() => setIsDrawing(!isDrawing)}
      >
        <Edit3 className="w-4 h-4 mr-2" />
        {isDrawing ? "Drawing..." : "Draw Zone"}
      </Button>

      <Button 
        variant={isRecordingGps ? "default" : "outline"}
        size="sm"
        className={isRecordingGps ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-zinc-300"}
        onClick={toggleGpsRecording}
      >
        <RouteIcon className="w-4 h-4 mr-2" />
        {isRecordingGps ? "Recording GPS..." : "Record Route"}
      </Button>
      
      {points.length > 0 && (
        <>
          <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 border-red-900/50" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" className="text-emerald-400 hover:text-emerald-300 border-emerald-900/50" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Zone
          </Button>
        </>
      )}
    </div>
  );
}
