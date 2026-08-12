"use client";

import { Polygon } from "react-leaflet";

interface VenueBoundaryLayerProps {
  boundaryPoints: { lat: number; lng: number }[];
}

export function VenueBoundaryLayer({ boundaryPoints }: VenueBoundaryLayerProps) {
  if (!boundaryPoints || boundaryPoints.length < 3) return null;

  return (
    <Polygon
      positions={boundaryPoints}
      pathOptions={{
        color: "#10b981", // Emerald 500
        weight: 3,
        fillColor: "transparent",
        dashArray: "10, 10",
      }}
    />
  );
}
