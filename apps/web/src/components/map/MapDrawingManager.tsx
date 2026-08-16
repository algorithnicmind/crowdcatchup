'use client';

import { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Button } from '@/components/ui/button';
import { Map, Edit3, Save, Trash2, MapPin } from 'lucide-react';

export function MapDrawingManager() {
  const map = useMap();
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

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

    setPolygon(poly);

    return () => {
      poly.setMap(null);
    };
  }, [map]);

  // Update polygon path when points change
  useEffect(() => {
    if (polygon) {
      polygon.setPath(points);
    }
  }, [points, polygon]);

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
