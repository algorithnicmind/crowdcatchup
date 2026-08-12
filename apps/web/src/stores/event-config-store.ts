import { create } from "zustand";

interface GeoPoint {
  lat: number;
  lng: number;
}

export type MapMode = "VIEW" | "EDIT_BOUNDARY" | "ADD_ZONE" | "ADD_GATE" | "ADD_ROUTE";

interface EventConfigState {
  mode: MapMode;
  setMode: (mode: MapMode) => void;
  
  draftBoundary: GeoPoint[];
  setDraftBoundary: (points: GeoPoint[]) => void;
  
  draftZone: { name: string; polygon: GeoPoint[]; capacity: number; type: string } | null;
  setDraftZone: (zone: any) => void;
  
  draftGate: { name: string; location: GeoPoint | null; type: string; status: string } | null;
  setDraftGate: (gate: any) => void;
  
  draftRoute: { name: string; path: GeoPoint[]; type: string } | null;
  setDraftRoute: (route: any) => void;
}

export const useEventConfigStore = create<EventConfigState>((set) => ({
  mode: "VIEW",
  setMode: (mode) => set({ mode }),
  
  draftBoundary: [],
  setDraftBoundary: (points) => set({ draftBoundary: points }),
  
  draftZone: null,
  setDraftZone: (zone) => set({ draftZone: zone }),
  
  draftGate: null,
  setDraftGate: (gate) => set({ draftGate: gate }),
  
  draftRoute: null,
  setDraftRoute: (route) => set({ draftRoute: route }),
}));
