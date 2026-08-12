import { useState, useCallback } from "react";
import type { Map as LeafletMap } from "leaflet";

export function useMapEngine() {
  const [map, setMap] = useState<LeafletMap | null>(null);

  const onMapReady = useCallback((mapInstance: LeafletMap) => {
    setMap(mapInstance);
  }, []);

  const flyTo = useCallback(
    (lat: number, lng: number, zoom: number = 17) => {
      if (map) {
        map.flyTo([lat, lng], zoom, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    },
    [map]
  );

  return {
    map,
    onMapReady,
    flyTo,
  };
}
