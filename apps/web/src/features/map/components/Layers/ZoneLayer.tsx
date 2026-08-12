"use client";

import { Polygon, Tooltip } from "react-leaflet";

export interface ZoneData {
  id: string;
  name: string;
  polygon: { lat: number; lng: number }[];
  status: "NORMAL" | "WARNING" | "CRITICAL";
  capacity: number;
}

interface ZoneLayerProps {
  zones: ZoneData[];
  onZoneClick?: (zone: ZoneData) => void;
}

export function ZoneLayer({ zones, onZoneClick }: ZoneLayerProps) {
  const getZoneColor = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return "#ef4444"; // Red
      case "WARNING":
        return "#f59e0b"; // Amber
      default:
        return "#3b82f6"; // Blue for default zones
    }
  };

  return (
    <>
      {zones.map((zone) => {
        if (!zone.polygon || zone.polygon.length < 3) return null;
        const color = getZoneColor(zone.status);

        return (
          <Polygon
            key={zone.id}
            positions={zone.polygon}
            pathOptions={{
              color: color,
              weight: 2,
              fillColor: color,
              fillOpacity: 0.15,
            }}
            eventHandlers={{
              click: () => onZoneClick?.(zone),
            }}
          >
            <Tooltip sticky>
              <div className="font-semibold">{zone.name}</div>
              <div className="text-sm">Status: {zone.status}</div>
              <div className="text-sm">Capacity: {zone.capacity}</div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
