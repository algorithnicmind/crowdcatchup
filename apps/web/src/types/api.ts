import { TelemetryFrame, RiskAssessment, Intervention, SosIncident } from './models';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type WsMessageType = 
  | 'TELEMETRY_UPDATE' 
  | 'RISK_ALERT' 
  | 'INTERVENTION_EXECUTED' 
  | 'SOS_INCIDENT_REPORTED' 
  | 'GATE_STATUS_CHANGED';

export interface WebSocketMessage {
  type: WsMessageType;
  payload: TelemetryFrame | RiskAssessment | Intervention | SosIncident | Record<string, unknown>;
  timestamp: number;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  venueId: string;
  expectedAttendance: number;
  startTime: string;
  endTime: string;
}

export interface TriggerInterventionRequest {
  interventionId: string;
  eventId: string;
  targetGateId?: string;
  personnelCount?: number;
}

export interface CreateSosReportRequest {
  eventId: string;
  category: 'medical' | 'stampede_risk' | 'lost_child' | 'fire' | 'structural';
  x: number;
  y: number;
  locationName: string;
  reporterMobile?: string;
}
