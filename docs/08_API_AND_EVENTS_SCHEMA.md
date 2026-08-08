# API & Event Bus Schema Specification (Contracts)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Event Architecture, Data Contracts & API Schema  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. Universal Data Hub Schema (Data Ingestion)
The Data Hub ingests data from live CCTV, uploaded MP4s, or Digital Twin simulations. To ensure the XGBoost Risk Engine is decoupled from the source type, all inputs are normalized into a standard JSON payload format.

* **Protocol:** HTTP POST or WebSockets (`wss://api.crowdshield.local/ingest`)
* **TypeScript / Schema Interface:**
  ```typescript
  interface TelemetryFrame {
    event_id: string;           // E.g., "event_001_rath_yatra"
    zone_id: string;            // E.g., "zone_c"
    timestamp: string;          // ISO 8601 (e.g., "2026-08-08T11:30:00Z")
    people_count: number;       // Raw detection count from CV Pipeline
    density: number;            // people / m²
    average_speed: number;      // m/s
    entry_rate: number;         // people / minute entering
    exit_rate: number;          // people / minute exiting
    flow_direction: string;     // e.g., "north" or "mixed"
    flow_conflict: boolean;     // True if counter-flow wave is detected
    blocked_route: boolean;     // True if CV detects static blockage
  }
  ```

---

## 2. Real-Time PWA WebSockets (FastAPI -> Next.js)

The FastAPI server manages active WebSocket connections for the Authority, Police, and Citizen PWAs, pushing role-specific data.

### 2.1 `RISK_UPDATE` (To Authority)
Emitted by the Risk Prediction Engine when a zone state changes.
```typescript
interface RiskUpdateEvent {
  type: "RISK_UPDATE";
  zone_id: string;
  risk_score: number;         // 0-100 current risk
  risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  predictions: {
    plus_5_min: number;
    plus_10_min: number;
    plus_15_min: number;
  };
  timestamp: string;
}
```

### 2.2 `RECOMMENDATION_ALERT` (To Authority)
Triggered when the Decision Engine synthesizes a high-priority action plan.
```typescript
interface RecommendationAlert {
  type: "RECOMMENDATION";
  risk: number;
  recommendations: Array<{
    action: "OPEN_GATE" | "CLOSE_GATE" | "DEPLOY_POLICE" | "BROADCAST_ALERT";
    target: string;           // e.g., "G4"
    priority: "HIGH" | "CRITICAL";
    reason: string;
  }>;
}
```

### 2.3 `EXECUTE_INTERVENTION` (Authority -> API)
Sent when the Authority clicks `[APPROVE PLAN]`. Requires JWT validation.
```typescript
interface ExecuteInterventionCommand {
  type: "EXECUTE_ACTION";
  recommendation_id: string;
  auth_token: string;         // Authority JWT
}
```

### 2.4 `SECURITY_TASK` (To Police PWA)
Sent to the Police mobile application after an intervention is approved.
```typescript
interface SecurityTask {
  type: "NEW_TASK";
  zone_id: string;
  distance_meters: number;
  risk_level: "CRITICAL";
  instructions: string;       // e.g., "Control crowd near Gate 3"
  required_officers: number;
  assigned_officers: number;
}
```

### 2.5 `CITIZEN_ALERT` (To Citizen PWA)
Pushed to public devices. Strips out raw metrics to avoid panic.
```typescript
interface CitizenAlert {
  type: "CROWD_ALERT";
  level: "WARNING";
  zone: string;
  message_key: string;        // E.g., "gateCongestedUseAlternate" (resolves locally in i18next)
  recommended_gate: string;   // E.g., "G4"
}
```

---

## 3. Citizen SOS Reporting (Citizen -> API)
Submitted when an on-site citizen sends an urgent distress report via the mobile PWA.

```typescript
interface SosIncidentReport {
  type: "overcrowding" | "medical" | "blockage" | "panic";
  geo_coordinates: {          // GPS parameters
    lat: number;
    lng: number;
  };
  details: string;            // User commentary
  timestamp: string;
}
```
