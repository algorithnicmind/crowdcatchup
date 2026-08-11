/**
 * Risk types — docs/04_LLD.md §6, §36
 */

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskScore {
  event_id: string;
  zone_id: string;
  score: number; // 0 – 100
  level: RiskLevel;
  predicted_plus_5: number;
  predicted_plus_10: number;
  predicted_plus_15: number;
  contributing_factors: string[];
  timestamp: string;
}
