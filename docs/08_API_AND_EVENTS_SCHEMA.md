# API & Event Bus Schema Specification (Contracts)
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. Standard Observation Format (Universal Data Contract)

Every data source — CCTV, Smart Gate, GPS, Drone, BLE, Telecom, Synthetic — must produce observations in this format. This is the fundamental data contract of the system.

```typescript
interface StandardObservation {
  event_id: string;           // "EVT-001" — Every observation belongs to an event
  source_id: string;          // "CCTV-07", "SG-03", "GPS-AGGREGATED"
  source_type: "CCTV" | "SMART_GATE" | "GPS" | "DRONE" | "BLE" | "TELECOM" | "SYNTHETIC";
  zone_id: string;            // "ZONE-B"
  timestamp: string;          // ISO 8601
  metric: string;             // "people_count" | "entry_rate" | "exit_rate" | "avg_speed" | "zone_device_count" | ...
  value: number;              // Numeric value for the metric
  confidence: number;         // 0.0 - 1.0, how reliable this observation is
  latency_ms: number;         // How old is this data (milliseconds)
  health: "ONLINE" | "DELAYED" | "OFFLINE";
}
```

### 1.1 Example: CCTV Observation
```json
{
  "event_id": "EVT-001",
  "source_id": "CCTV-07",
  "source_type": "CCTV",
  "zone_id": "ZONE-B",
  "timestamp": "2026-08-09T17:05:10Z",
  "metric": "people_count",
  "value": 1240,
  "confidence": 0.91,
  "latency_ms": 300,
  "health": "ONLINE"
}
```

### 1.2 Example: Smart Gate Observation
```json
{
  "event_id": "EVT-001",
  "source_id": "SG-03",
  "source_type": "SMART_GATE",
  "gate_id": "G-03",
  "zone_id": "ZONE-B",
  "timestamp": "2026-08-09T17:05:11Z",
  "metric": "entry_rate",
  "value": 142,
  "confidence": 0.94,
  "latency_ms": 100,
  "health": "ONLINE"
}
```

### 1.3 Example: GPS Aggregated Observation
```json
{
  "event_id": "EVT-001",
  "source_id": "GPS-AGGREGATED",
  "source_type": "GPS",
  "zone_id": "ZONE-B",
  "timestamp": "2026-08-09T17:05:12Z",
  "metric": "zone_device_count",
  "value": 980,
  "confidence": 0.78,
  "latency_ms": 2000,
  "health": "ONLINE"
}
```

---

## 2. Crowd State (Fusion Hub Output)

The Fusion Hub produces one unified crowd state per zone. This is what the rest of the platform consumes.

```typescript
interface CrowdState {
  event_id: string;
  zone_id: string;
  estimated_people: number;
  density: number;              // people/m2
  density_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  average_speed: number;        // m/s
  flow_direction: string;       // "NORTH", "SOUTH", "MIXED", "STALLED"
  entry_rate: number;           // people/min entering zone
  exit_rate: number;            // people/min exiting zone
  bottleneck_score: number;     // 0.0 - 1.0
  flow_conflict: boolean;
  risk_score: number;           // 0 - 100
  risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  confidence: number;           // Fusion confidence
  timestamp: string;
}
```

---

## 3. Source Health Schema

```typescript
interface SourceHealth {
  source_id: string;
  source_type: string;
  event_id: string;
  health_status: "ONLINE" | "DELAYED" | "OFFLINE" | "SIMULATED";
  last_seen: string;            // ISO 8601
  confidence_impact: number;    // 0.0 - 1.0, how much this source contributes to fusion
  error_message?: string;
}
```

---

## 4. Real-Time PWA WebSockets (FastAPI -> Next.js)

### 4.1 `RISK_UPDATE` (To Authority)
```typescript
interface RiskUpdateEvent {
  type: "RISK_UPDATE";
  zone_id: string;
  risk_score: number;
  risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  predictions: {
    plus_5_min: number;
    plus_10_min: number;
    plus_15_min: number;
  };
  timestamp: string;
}
```

### 4.2 `CROWD_STATE_UPDATE` (To All Roles)
```typescript
interface CrowdStateUpdate {
  type: "CROWD_STATE_UPDATE";
  zone_id: string;
  estimated_people: number;
  density_level: string;
  average_speed: number;
  flow_direction: string;
  bottleneck_score: number;
  confidence: number;
  timestamp: string;
}
```

### 4.3 `RECOMMENDATION_ALERT` (To Authority)
```typescript
interface RecommendationAlert {
  type: "RECOMMENDATION";
  recommendation_id: string;
  zone_id: string;
  risk: number;
  actions: Array<{
    action: "OPEN_GATE" | "CLOSE_GATE" | "RESTRICT_GATE" | "DEPLOY_POLICE" | "REDIRECT_CROWD" | "BROADCAST_ALERT" | "OPEN_EMERGENCY_ROUTE";
    target: string;
    priority: "HIGH" | "CRITICAL";
  }>;
  explanation: {
    primary_reason: string;
    supporting_factors: string[];
    source_agreement: number;
  };
}
```

### 4.4 `EXECUTE_INTERVENTION` (Authority -> API)
```typescript
interface ExecuteInterventionCommand {
  type: "EXECUTE_ACTION";
  recommendation_id: string;
  auth_token: string;
}
```

### 4.5 `SECURITY_TASK` (To Police PWA)
```typescript
interface SecurityTask {
  type: "NEW_TASK";
  zone_id: string;
  distance_meters: number;
  risk_level: "CRITICAL";
  instructions: string;
  required_officers: number;
  assigned_officers: number;
}
```

### 4.6 `CITIZEN_ALERT` (To Citizen PWA)
```typescript
interface CitizenAlert {
  type: "CROWD_ALERT";
  level: "INFO" | "WARNING" | "EVACUATE";
  zone: string;
  message_key: string;        // i18next translation key
  recommended_gate: string;
}
```

### 4.7 `SOURCE_HEALTH_UPDATE` (To Authority)
```typescript
interface SourceHealthUpdate {
  type: "SOURCE_HEALTH";
  sources: Array<{
    source_id: string;
    source_type: string;
    health: string;
    confidence_impact: number;
  }>;
  fusion_confidence: number;
}
```

---

## 5. Citizen SOS Reporting (Citizen -> API)

```typescript
interface SosIncidentReport {
  type: "overcrowding" | "medical" | "blockage" | "panic";
  geo_coordinates: {
    lat: number;
    lng: number;
  };
  details: string;
  timestamp: string;
}
```

---

## 6. Smart Gate Configuration

```typescript
interface SmartGateConfig {
  gate_id: string;
  event_id: string;
  zone_id: string;
  gate_type: "ENTRY" | "EXIT" | "BIDIRECTIONAL";
  technology: "AI_CAMERA" | "IR" | "LIDAR" | "TURNSTILE" | "RFID" | "QR";
  max_capacity_per_minute: number;
  connected_routes: string[];
  location: { lat: number; lng: number };
}
```

---

## 7. Event Configuration

```typescript
interface EventConfig {
  event_id: string;
  name: string;
  event_type: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  expected_attendance: number;
  status: "DRAFT" | "CONFIGURATION" | "READY" | "LIVE" | "PAUSED" | "COMPLETED" | "CANCELLED" | "ARCHIVED";
  boundary: GeoPolygon;
  zones: Zone[];
  gates: Gate[];
  routes: Route[];
  cameras: Camera[];
  smart_gates: SmartGateConfig[];
}
```

---

## 8. Intervention Types

```typescript
type InterventionType =
  | "OPEN_GATE"
  | "CLOSE_GATE"
  | "RESTRICT_GATE"
  | "DEPLOY_POLICE"
  | "REDIRECT_CROWD"
  | "ACTIVATE_ONE_WAY"
  | "CLOSE_ROUTE"
  | "OPEN_EMERGENCY_ROUTE"
  | "BROADCAST_ANNOUNCEMENT"
  | "SEND_CITIZEN_ALERT"
  | "CHANGE_BARRICADE"
  | "RECOMMEND_MEDICAL";
```
