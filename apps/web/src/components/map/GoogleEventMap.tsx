'use client';

import React, { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useMapStore } from '@/stores/map-store';
import { MapOverlayControls } from './MapOverlayControls';

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

export function GoogleEventMap() {
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
      <APIProvider apiKey={apiKey}>
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
          
          {/* Example Marker */}
          <AdvancedMarker position={EVENT_CENTER}>
            <Pin background={"#10b981"} borderColor={"#047857"} glyphColor={"#ffffff"} />
          </AdvancedMarker>
        </Map>
        
        {/* Floating UI Overlays - Placed AFTER Map so they sit on top in DOM */}
        <MapOverlayControls />
      </APIProvider>
    </div>
  );
}
