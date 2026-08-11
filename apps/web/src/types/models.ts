export type EventStatus = 
  | 'draft' 
  | 'configuration' 
  | 'ready' 
  | 'live' 
  | 'paused' 
  | 'completed' 
  | 'cancelled' 
  | 'archived';

export type RiskLevel = 'NORMAL' | 'ELEVATED' | 'CRITICAL';

export type GateType = 'entrance' | 'exit' | 'emergency';

export type BarrierType = 'wall' | 'water' | 'stage' | 'vip' | 'fence';

export type SosCategory = 'medical' | 'stampede_risk' | 'lost_child' | 'fire' | 'structural';

export interface Gate {
  id: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  type: GateType;
  canBottleneck: boolean;
  currentFlowRate?: number; // persons per minute
}

export interface Barrier {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: BarrierType;
}

export interface SecurityPost {
  id: string;
  label: string;
  x: number;
  y: number;
  personnel: number;
}

export interface Zone {
  id: string;
  name: string;
  density: number; // persons per sq meter
  riskLevel: RiskLevel;
  velocity: number; // meters per second
  capacity: number;
  currentCount: number;
}

export interface VenuePreset {
  id: string;
  name: string;
  description: string;
  defaultCrowdCount: number;
  gates: Gate[];
  barriers: Barrier[];
  securityOutposts: SecurityPost[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetGateId?: string;
  isStuck?: boolean;
}

export interface TelemetryFrame {
  timestamp: number;
  eventId: string;
  venueId: string;
  totalCrowdCount: number;
  avgDensity: number;
  maxDensity: number;
  avgVelocity: number;
  stuckParticleCount: number;
  riskLevel: RiskLevel;
}

export interface RiskAssessment {
  riskLevel: RiskLevel;
  score: number; // 0 to 100
  compressionHazard: boolean;
  bottleneckGateIds: string[];
  recommendedGateAction?: string;
  summaryText: string;
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  type: 'gate_open' | 'deploy_raf' | 'reroute_flow' | 'broadcast_alert';
  targetGateId?: string;
  personnelCount?: number;
  executed: boolean;
  timestamp?: number;
}

export interface SosIncident {
  id: string;
  category: SosCategory;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  locationName: string;
  timestamp: number;
  status: 'active' | 'dispatched' | 'resolved';
  reporterMobile?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  venueId: string;
  status: EventStatus;
  expectedAttendance: number;
  currentAttendance: number;
  startTime: string;
  endTime: string;
}
