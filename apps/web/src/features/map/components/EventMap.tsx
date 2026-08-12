"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix Leaflet's default icon path issues
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface EventMapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  onMapReady?: (map: L.Map) => void;
}

export function EventMap({
  center = [28.6139, 77.2090], // Default to New Delhi
  zoom = 15,
  children,
  onMapReady,
}: EventMapProps) {
  
  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={(map: L.Map | null) => {
          if (map && onMapReady) {
            onMapReady(map);
          }
        }}
      >
        {/* CartoDB Dark Matter for Premium UI */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {children}
      </MapContainer>
    </div>
  );
}
