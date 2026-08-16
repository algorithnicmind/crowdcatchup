'use client';

import React, { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useMapStore } from '@/stores/map-store';
import { MapOverlayControls } from './MapOverlayControls';
import { MapDrawingManager } from './MapDrawingManager';

// Coordinates for the event (e.g., Kalinga Stadium)
const EVENT_CENTER = { lat: 20.2886, lng: 85.8178 };

// Modern dark style array (Google Maps JSON)
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

function TrafficLayer() {
  const map = useMap();
  const { trafficEnabled } = useMapStore();
  
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
  const { routeCoordinates } = useMapStore();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        strokeColor: '#3b82f6', // blue-500
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

function LiveMarkers() {
  const { liveCrowdState, liveRisk } = useMapStore();

  return (
    <>
      {Object.entries(EVENT_ZONES).map(([zoneId, coords]) => {
        const risk = liveRisk[zoneId];
        const crowd = liveCrowdState[zoneId];
        
        const level = risk?.risk_level || crowd?.density_level || 'LOW';
        
        let bgColor = 'bg-emerald-500/20';
        let borderColor = 'border-emerald-500/50';
        let textColor = 'text-emerald-400';
        let pulseColor = 'bg-emerald-500';
        let pulse = false;
        
        if (level === 'HIGH' || level === 'CONGESTED') {
          bgColor = 'bg-amber-500/20';
          borderColor = 'border-amber-500/50';
          textColor = 'text-amber-400';
          pulseColor = 'bg-amber-500';
          pulse = true;
        } else if (level === 'CRITICAL') {
          bgColor = 'bg-red-500/20';
          borderColor = 'border-red-500/50';
          textColor = 'text-red-500';
          pulseColor = 'bg-red-500';
          pulse = true;
        } else if (level === 'MODERATE') {
          bgColor = 'bg-blue-500/20';
          borderColor = 'border-blue-500/50';
          textColor = 'text-blue-400';
        }

        const isGate = zoneId.toLowerCase().includes('gate');
        const Icon = isGate ? Router : Users;

        return (
          <AdvancedMarker key={zoneId} position={coords} title={zoneId}>
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
      })}
    </>
  );
}

interface GoogleEventMapProps {
  role?: 'authority' | 'police' | 'citizen' | 'owner';
}

export function GoogleEventMap({ role = 'authority' }: GoogleEventMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { mapTypeId } = useMapStore();

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-900 border-2 border-dashed border-zinc-700">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-400 mb-2">Google Maps API Key Missing</h2>
          <p className="text-zinc-400">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <APIProvider apiKey={apiKey} libraries={['drawing']}>
        <Map
          defaultCenter={EVENT_CENTER}
          defaultZoom={16}
          mapId="DEMO_MAP_ID"
          mapTypeId={mapTypeId}
          disableDefaultUI={true}
          styles={mapTypeId === 'roadmap' ? darkMapStyle : undefined}
          gestureHandling="greedy"
        >
          <TrafficLayer />
          <RoutePolyline />
          <LiveMarkers />
        </Map>
        
        {/* Floating UI Overlays - Placed AFTER Map so they sit on top in DOM */}
        <MapOverlayControls role={role} />
        
        {/* Drawing Tools for Owner */}
        {role === 'owner' && <MapDrawingManager />}
      </APIProvider>
    </div>
  );
}
