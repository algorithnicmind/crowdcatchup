/**
 * Standard Observation Format — docs/08_API_AND_EVENTS_SCHEMA.md §1
 * ONE contract for real AND simulated sources.
 */

export type SourceType =
  | 'CCTV'
  | 'SMART_GATE'
  | 'GPS'
  | 'DRONE'
  | 'BLE'
  | 'TELECOM'
  | 'SYNTHETIC';

export type SourceHealth = 'ONLINE' | 'DELAYED' | 'OFFLINE';

export type MetricType =
  | 'people_count'
  | 'density'
  | 'flow_rate'
  | 'speed'
  | 'direction'
  | 'entry_count'
  | 'exit_count'
  | 'queue_length'
  | 'zone_device_count';

export interface Observation {
  event_id: string;
  source_id: string;
  source_type: SourceType;
  zone_id: string;
  timestamp: string; // ISO 8601
  metric: MetricType;
  value: number;
  confidence: number; // 0.0 – 1.0
  latency_ms: number;
  health: SourceHealth;
}
