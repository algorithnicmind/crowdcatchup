import { create } from 'zustand';

export interface CrowdState {
  zone_id: string;
  estimated_people: number;
  density_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  average_speed: number;
  flow_direction: string;
  entry_rate: number;
  exit_rate: number;
  bottleneck_score: number;
  risk_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
}

export interface RiskUpdate {
  zone_id: string;
  risk_score: number;
  risk_level: string;
  predictions_5m: number;
  predictions_10m: number;
  predictions_15m: number;
  timestamp: string;
}

export interface ActionPlan {
  recommendation_id: string;
  zone_id: string;
  risk_score: number;
  actions: string[];
  explanation: {
    primary_reason: string;
    supporting_factors: string[];
    source_agreement: number;
    prediction_confidence: number;
  };
  confidence: number;
}

export interface SecurityTask {
  task_id: string;
  zone_id: string;
  distance: number;
  risk_level: string;
  instructions: string;
  required_officers: number;
}

export interface SourceHealth {
  source_id: string;
  source_type: string;
  health_status: 'ONLINE' | 'DELAYED' | 'OFFLINE';
  last_seen: string;
  confidence_impact: number;
}

interface MapState {
  mapTypeId: string;
  trafficEnabled: boolean;
  heatmapEnabled: boolean;
  routeCoordinates: { lat: number; lng: number }[] | null;
  liveCrowdState: Record<string, CrowdState>; // keyed by zone_id
  liveRisk: Record<string, RiskUpdate>; // keyed by zone_id
  activeRecommendations: ActionPlan[];
  activeTasks: SecurityTask[];
  sourceHealth: SourceHealth[];
  
  setMapTypeId: (id: string) => void;
  setTrafficEnabled: (enabled: boolean) => void;
  setHeatmapEnabled: (enabled: boolean) => void;
  setRouteCoordinates: (coords: { lat: number; lng: number }[] | null) => void;
  updateCrowdState: (zone_id: string, state: CrowdState) => void;
  updateRisk: (zone_id: string, risk: RiskUpdate) => void;
  addRecommendation: (rec: ActionPlan) => void;
  removeRecommendation: (id: string) => void;
  addTask: (task: SecurityTask) => void;
  removeTask: (id: string) => void;
  updateSourceHealth: (health: SourceHealth) => void;
}

export const useMapStore = create<MapState>((set) => ({
  mapTypeId: 'roadmap',
  trafficEnabled: false,
  heatmapEnabled: false,
  routeCoordinates: null,
  liveCrowdState: {},
  liveRisk: {},
  activeRecommendations: [
    {
      recommendation_id: 'rec-001',
      zone_id: 'Zone B',
      risk_score: 85,
      actions: ['Dispatch 2 officers', 'Open Gate 4'],
      explanation: {
        primary_reason: 'High density detected at Gate 3.',
        supporting_factors: ['Temperature rise', 'Slow movement'],
        source_agreement: 0.9,
        prediction_confidence: 0.88
      },
      confidence: 0.9
    }
  ],
  activeTasks: [
    {
      task_id: 'tsk-001',
      zone_id: 'Zone B (Gate 3)',
      distance: 150,
      risk_level: 'HIGH',
      instructions: 'Proceed to Gate 3 to manage crowd bottleneck. Coordinate with medical team on standby.',
      required_officers: 2
    }
  ],
  sourceHealth: [],
  
  setMapTypeId: (id) => set({ mapTypeId: id }),
  setTrafficEnabled: (enabled) => set({ trafficEnabled: enabled }),
  setHeatmapEnabled: (enabled) => set({ heatmapEnabled: enabled }),
  setRouteCoordinates: (coords) => set({ routeCoordinates: coords }),
  
  updateCrowdState: (zone_id, state) => set((prev) => ({
    liveCrowdState: { ...prev.liveCrowdState, [zone_id]: state }
  })),
  
  updateRisk: (zone_id, risk) => set((prev) => ({
    liveRisk: { ...prev.liveRisk, [zone_id]: risk }
  })),
  
  addRecommendation: (rec) => set((prev) => {
    const existing = prev.activeRecommendations.find(r => r.recommendation_id === rec.recommendation_id);
    if (existing) return prev;
    return { activeRecommendations: [...prev.activeRecommendations, rec] };
  }),
  
  removeRecommendation: (id) => set((prev) => ({
    activeRecommendations: prev.activeRecommendations.filter(r => r.recommendation_id !== id)
  })),
  
  addTask: (task) => set((prev) => {
    const existing = prev.activeTasks.find(t => t.task_id === task.task_id);
    if (existing) return prev;
    return { activeTasks: [...prev.activeTasks, task] };
  }),
  
  removeTask: (id) => set((prev) => ({
    activeTasks: prev.activeTasks.filter(t => t.task_id !== id)
  })),
  
  updateSourceHealth: (health) => set((prev) => {
    const existingIndex = prev.sourceHealth.findIndex(s => s.source_id === health.source_id);
    if (existingIndex >= 0) {
      const next = [...prev.sourceHealth];
      next[existingIndex] = health;
      return { sourceHealth: next };
    }
    return { sourceHealth: [...prev.sourceHealth, health] };
  })
}));
