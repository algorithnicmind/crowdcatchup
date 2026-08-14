import { create } from 'zustand';

interface MapState {
  mapTypeId: string;
  trafficEnabled: boolean;
  routeCoordinates: { lat: number; lng: number }[] | null;
  setMapTypeId: (id: string) => void;
  setTrafficEnabled: (enabled: boolean) => void;
  setRouteCoordinates: (coords: { lat: number; lng: number }[] | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  mapTypeId: 'roadmap',
  trafficEnabled: false,
  routeCoordinates: null,
  setMapTypeId: (id) => set({ mapTypeId: id }),
  setTrafficEnabled: (enabled) => set({ trafficEnabled: enabled }),
  setRouteCoordinates: (coords) => set({ routeCoordinates: coords }),
}));
