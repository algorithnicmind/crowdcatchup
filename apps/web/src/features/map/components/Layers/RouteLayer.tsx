"use client";

import { Polyline, Tooltip } from "react-leaflet";

export interface RouteData {
  id: string;
  name: string;
  path: { lat: number; lng: number }[];
  type: string;
  isActive: boolean;
}

interface RouteLayerProps {
  routes: RouteData[];
  onRouteClick?: (route: RouteData) => void;
}

export function RouteLayer({ routes, onRouteClick }: RouteLayerProps) {
  
  const getRouteOptions = (type: string, isActive: boolean) => {
    let color = "#3b82f6"; // Blue TWO_WAY
    let dashArray = undefined;
    
    if (!isActive) {
      color = "#6b7280";
      dashArray = "5, 5";
    } else {
      if (type === "EMERGENCY") color = "#ef4444";
      if (type === "POLICE_ONLY") color = "#8b5cf6";
      if (type === "ONE_WAY") dashArray = "10, 5";
    }

    return { color, weight: 4, dashArray, opacity: 0.8 };
  };

  return (
    <>
      {routes.map((route) => {
        if (!route.path || route.path.length < 2) return null;
        
        return (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={getRouteOptions(route.type, route.isActive)}
            eventHandlers={{
              click: () => onRouteClick?.(route),
            }}
          >
            <Tooltip sticky>
              <div className="font-semibold">{route.name}</div>
              <div className="text-sm">Type: {route.type}</div>
              <div className="text-sm">Active: {route.isActive ? "Yes" : "No"}</div>
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}
