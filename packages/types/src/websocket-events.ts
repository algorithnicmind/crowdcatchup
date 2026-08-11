/**
 * WebSocket event types — docs/08_API_AND_EVENTS_SCHEMA.md §4
 */

import type { CrowdState } from './crowd-state';
import type { RiskScore } from './risk';

// Server → Client event types
export type WSEventType =
  | 'RISK_UPDATE'
  | 'CROWD_STATE_UPDATE'
  | 'RECOMMENDATION_ALERT'
  | 'EXECUTE_ACTION'
  | 'SECURITY_TASK'
  | 'CITIZEN_ALERT'
  | 'SOURCE_HEALTH'
  | 'NAVIGATION_UPDATE'
  | 'REROUTE_ALERT'
  | 'GROUP_MEMBER_ALERT';

export interface WSMessage<T = unknown> {
  type: WSEventType;
  event_id: string;
  timestamp: string;
  data: T;
}

export type RiskUpdateMessage = WSMessage<RiskScore>;
export type CrowdStateMessage = WSMessage<CrowdState>;

export interface CitizenAlert {
  message_key: string; // i18n key
  zone_id: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  gate_recommendation?: string;
}

export type CitizenAlertMessage = WSMessage<CitizenAlert>;
