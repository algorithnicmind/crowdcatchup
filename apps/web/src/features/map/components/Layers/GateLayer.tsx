"use client";

import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { DoorOpen } from "lucide-react";

export interface GateData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: "OPEN" | "CLOSED" | "RESTRICTED" | "EMERGENCY_ONLY";
  type: string;
}

interface GateLayerProps {
  gates: GateData[];
  onGateClick?: (gate: GateData) => void;
}

export function GateLayer({ gates, onGateClick }: GateLayerProps) {
  
  const getGateIcon = (status: string) => {
    let color = "#10b981"; // Green for OPEN
    if (status === "CLOSED") color = "#6b7280"; // Gray
    if (status === "RESTRICTED") color = "#f59e0b"; // Amber
    if (status === "EMERGENCY_ONLY") color = "#3b82f6"; // Blue
    
    const iconMarkup = renderToStaticMarkup(
      <div style={{ color, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}>
        <DoorOpen size={24} strokeWidth={2.5} />
      </div>
    );
    
    return L.divIcon({
      html: iconMarkup,
      className: "custom-gate-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <>
      {gates.map((gate) => {
        if (!gate.location) return null;
        
        return (
          <Marker
            key={gate.id}
            position={[gate.location.lat, gate.location.lng]}
            icon={getGateIcon(gate.status)}
            eventHandlers={{
              click: () => onGateClick?.(gate),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <div className="font-semibold">{gate.name}</div>
              <div className="text-sm">Type: {gate.type}</div>
              <div className="text-sm">Status: {gate.status}</div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
