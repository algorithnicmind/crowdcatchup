/**
 * Crowd State — docs/02_TRD.md §3.2
 * Unified per-zone crowd state output from Fusion Hub.
 */

export type DensityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type FlowDirection = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'MIXED' | 'STAGNANT';

export interface CrowdState {
  event_id: string;
  zone_id: string;
  estimated_people: number;
  density_level: DensityLevel;
  average_speed: number; // m/s
  flow_direction: FlowDirection;
  entry_rate: number; // people per minute
  exit_rate: number;
  bottleneck_score: number; // 0.0 – 1.0
  risk_score: number; // 0 – 100
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number; // 0.0 – 1.0
  timestamp: string;
}
