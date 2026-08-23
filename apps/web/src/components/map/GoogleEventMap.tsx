'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useMapStore } from '@/stores/map-store';
import { MapOverlayControls } from './MapOverlayControls';
import { MapDrawingManager } from './MapDrawingManager';

const EVENT_CENTER = { lat: 20.2886, lng: 85.8178 };

if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Heatmap Layer functionality in the Maps JavaScript API is no longer supported')) {
      return;
    }
    originalError.apply(console, args);
  };
}


function TrafficLayer() {
  const map = useMap();
  const trafficEnabled = useMapStore(s => s.trafficEnabled);
  
  useEffect(() => {
    if (!map) return;
    
    const trafficLayer = new google.maps.TrafficLayer();
    
    if (trafficEnabled) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }

    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, trafficEnabled]);

  return null;
}

function RoutePolyline() {
  const map = useMap();
  const routeCoordinates = useMapStore(s => s.routeCoordinates);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 6,
      });
    }

    if (routeCoordinates && routeCoordinates.length > 0) {
      polylineRef.current.setPath(routeCoordinates);
      polylineRef.current.setMap(map);
    } else {
      polylineRef.current.setMap(null);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, routeCoordinates]);

  return null;
}

import { EVENT_ZONES } from '@/lib/constants/zones';
import { Users, Router } from 'lucide-react';

const ZoneMarker = React.memo(function ZoneMarker({ zoneId, coords }: { zoneId: string; coords: { lat: number; lng: number } }) {
  const risk = useMapStore(s => s.liveRisk[zoneId]);
  const crowd = useMapStore(s => s.liveCrowdState[zoneId]);

  const level = risk?.risk_level || crowd?.density_level || 'LOW';
  
  const { bgColor, borderColor, textColor, pulseColor, pulse } = useMemo(() => {
    if (level === 'HIGH' || level === 'CONGESTED') {
      return { bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/50', textColor: 'text-amber-400', pulseColor: 'bg-amber-500', pulse: true };
    } else if (level === 'CRITICAL') {
      return { bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50', textColor: 'text-red-500', pulseColor: 'bg-red-500', pulse: true };
    } else if (level === 'MODERATE') {
      return { bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', textColor: 'text-blue-400', pulseColor: 'bg-blue-500', pulse: false };
    }
    return { bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/50', textColor: 'text-emerald-400', pulseColor: 'bg-emerald-500', pulse: false };
  }, [level]);

  const isGate = zoneId.toLowerCase().includes('gate');
  const Icon = isGate ? Router : Users;

  return (
    <AdvancedMarker position={coords} title={zoneId}>
      <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg border transition-all duration-300 hover:scale-110 ${bgColor} ${borderColor}`}>
        {pulse && (
          <span className="absolute flex h-full w-full left-0 top-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-xl opacity-75 ${pulseColor}`}></span>
          </span>
        )}
        <div className={`relative z-10 flex items-center justify-center ${textColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </AdvancedMarker>
  );
});

function LiveMarkers() {
  return (
    <>
      {Object.entries(EVENT_ZONES).map(([zoneId, coords]) => (
        <ZoneMarker key={zoneId} zoneId={zoneId} coords={coords} />
      ))}
    </>
  );
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function HeatmapOverlay() {
  const heatmapEnabled = useMapStore(s => s.heatmapEnabled);
  const liveCrowdState = useMapStore(s => s.liveCrowdState);
  const map = useMap();
  const [overlayPositions, setOverlayPositions] = useState<{ key: string; x: number; y: number; color: string; radius: number }[]>([]);

  const debouncedCrowdState = useDebouncedValue(liveCrowdState, 150);

  const updatePositions = useCallback(() => {
    if (!map || !heatmapEnabled) {
      setOverlayPositions([]);
      return;
    }

    const projection = map.getProjection();
    if (!projection) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const mapDiv = map.getDiv();
    const mapWidth = mapDiv.offsetWidth;
    const mapHeight = mapDiv.offsetHeight;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const positions = Object.entries(EVENT_ZONES).map(([zoneId, coords]) => {
      const crowd = debouncedCrowdState[zoneId];
      const density = crowd?.density_level || 'LOW';

      const lngSpan = ne.lng() - sw.lng();
      const latSpan = ne.lat() - sw.lat();
      const x = ((coords.lng - sw.lng()) / lngSpan) * mapWidth;
      const y = ((ne.lat() - coords.lat) / latSpan) * mapHeight;

      const color = density === 'CRITICAL' ? 'rgba(239,68,68,0.55)' :
                    density === 'HIGH' ? 'rgba(249,115,22,0.45)' :
                    density === 'MODERATE' ? 'rgba(234,179,8,0.35)' :
                    'rgba(34,197,94,0.2)';

      const radius = density === 'CRITICAL' ? 90 :
                     density === 'HIGH' ? 70 :
                     density === 'MODERATE' ? 50 : 35;

      return { key: zoneId, x, y, color, radius };
    });

    setOverlayPositions(positions);
  }, [map, heatmapEnabled, debouncedCrowdState]);

  useEffect(() => {
    if (!map || !heatmapEnabled) {
      setOverlayPositions([]);
      return;
    }

    updatePositions();
    const listeners = [
      map.addListener('bounds_changed', updatePositions),
      map.addListener('zoom_changed', updatePositions),
    ];

    return () => listeners.forEach(l => window.google?.maps?.event?.removeListener(l));
  }, [map, heatmapEnabled, updatePositions]);

  if (!heatmapEnabled || overlayPositions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          {overlayPositions.map(pos => (
            <radialGradient key={`grad-${pos.key}`} id={`heatgrad-${pos.key}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={pos.color} />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          ))}
        </defs>
        {overlayPositions.map(pos => (
          <ellipse
            key={pos.key}
            cx={pos.x}
            cy={pos.y}
            rx={pos.radius}
            ry={pos.radius * 0.65}
            fill={`url(#heatgrad-${pos.key})`}
          />
        ))}
      </svg>
    </div>
  );
}


import { Crosshair, Plus, Minus } from 'lucide-react';

function CustomMapControls() {
  const map = useMap();
  const citizenLocation = useMapStore(s => s.citizenLocation);

  return (
    <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2">
      <button 
        onClick={() => {
          if (map) {
            if (citizenLocation) {
              map.panTo(citizenLocation);
              map.setZoom(18);
            } else {
              map.panTo(EVENT_CENTER);
            }
          }
        }}
        className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-zinc-700 hover:text-blue-500 transition-colors"
        title={citizenLocation ? "Go to my location" : "Go to event center"}
      >
        <Crosshair className="w-5 h-5" />
      </button>
      <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 16) + 1)}
          className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 16) - 1)}
          className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function UserLocationPin() {
  const citizenLocation = useMapStore(s => s.citizenLocation);
  
  if (!citizenLocation) return null;
  
  return (
    <AdvancedMarker position={citizenLocation} zIndex={9999}>
      <div className="relative flex items-center justify-center w-8 h-8">
        <span className="absolute w-full h-full rounded-full bg-blue-500 opacity-40 animate-ping"></span>
        <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
      </div>
    </AdvancedMarker>
  );
}

interface GoogleEventMapProps {
  role?: 'authority' | 'police' | 'citizen' | 'owner';
}

export function GoogleEventMap({ role = 'authority' }: GoogleEventMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyD-DummyKey-For-Hackathon-Demo-Fallback";
  const { mapTypeId, searchResultPin } = useMapStore();

  return (
    <div className="h-full w-full relative">
      <APIProvider apiKey={apiKey} libraries={['drawing', 'places']} version="3.64">
        <Map
          defaultCenter={EVENT_CENTER}
          defaultZoom={16}
          mapId="DEMO_MAP_ID"
          mapTypeId={mapTypeId}
          disableDefaultUI={true}
          gestureHandling="greedy"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onDragEnd={(e: any) => {
            if (e.detail?.latLng) {
              useMapStore.getState().setSearchResultPin({
                lat: e.detail.latLng.lat,
                lng: e.detail.latLng.lng
              });
            }
          }}
        >
          <TrafficLayer />
          <RoutePolyline />
          <HeatmapOverlay />
          <LiveMarkers />
          <UserLocationPin />
          {searchResultPin && (
            <AdvancedMarker position={searchResultPin} />
          )}
        </Map>
        
        <CustomMapControls />
        <MapOverlayControls role={role} />
        {role === 'owner' && <MapDrawingManager />}
      </APIProvider>
    </div>
  );
}
