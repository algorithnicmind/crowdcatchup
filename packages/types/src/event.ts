/**
 * Event types — docs/11_DOMAIN_MODEL.md
 */

export type EventStatus =
  | 'DRAFT'
  | 'CONFIGURATION'
  | 'READY'
  | 'LIVE'
  | 'PAUSED'
  | 'EMERGENCY'
  | 'COMPLETED'
  | 'CANCELLED';

export type GateType = 'ENTRY' | 'EXIT' | 'BIDIRECTIONAL' | 'SMART' | 'EMERGENCY';
export type GateStatus = 'OPEN' | 'CLOSED' | 'RESTRICTED' | 'EMERGENCY_ONLY';
export type RouteType = 'ONE_WAY' | 'TWO_WAY' | 'EMERGENCY' | 'POLICE_ONLY' | 'TEMPORARY';
export type ZoneType = 'GENERAL' | 'VIP' | 'STAGE' | 'FOOD' | 'MEDICAL' | 'ASSEMBLY' | 'RESTRICTED';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  venue_polygon: GeoPoint[];
  start_date: string;
  end_date: string;
  status: EventStatus;
  owner_id: string;
  expected_attendance: number;
  max_capacity: number;
}

export interface Zone {
  id: string;
  event_id: string;
  name: string;
  polygon: GeoPoint[];
  capacity: number;
  warning_threshold: number;
  critical_threshold: number;
  zone_type: ZoneType;
}

export interface Gate {
  id: string;
  event_id: string;
  zone_id: string;
  name: string;
  location: GeoPoint;
  type: GateType;
  status: GateStatus;
  capacity_per_minute: number;
}

export interface Route {
  id: string;
  event_id: string;
  name: string;
  path: GeoPoint[];
  type: RouteType;
  is_active: boolean;
  capacity: number;
}
