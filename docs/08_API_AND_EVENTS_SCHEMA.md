# API & Event Bus Schema Specification (Contracts)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Event Architecture, Data Contracts & API Schema  
**Document Version:** 1.0 (Production Release)  

---

## 1. Event-Driven Application Bus Overview
To enable modular decoupling and seamless migration from client-side simulation to real-world production hardware (e.g., Python edge servers, RTSP camera gateways, and municipal databases), CrowdShield communicates via formal asynchronous event schemas. 

Both human developers and AI coding agents must strictly adhere to these payload schemas when building extensions, writing backend test adapters, or integrating third-party emergency management APIs.

---

## 2. Internal Frontend Event Contracts

### 2.1 `TELEMETRY_UPDATE` (Simulation / Sensor Stream -> Risk Engine)
Emitted by [digitalTwinEngine.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/simulation/digitalTwinEngine.js) (or real-time edge processing hubs) at fixed **400ms decoupling intervals**.

* **Channel / Event Name:** `onTelemetryUpdate` / `event:telemetry_frame`
* **TypeScript / Schema Interface:**
  ```typescript
  interface TelemetryFrame {
    timestamp: number;          // Epoch milliseconds (e.g., 1754418652000)
    crowdCount: number;         // Estimated integer pedestrian head count
    peakDensity: number;        // Max localized density in people/m² (Float, e.g., 4.2)
    avgSpeed: number;           // Mean crowd movement speed in meters/sec (Float, e.g., 0.6)
    stampedeLikelihood: number; // Calculated probability from 0 to 100 (Integer)
    timeToIncident: string;     // Formatted countdown string (e.g., "04m 12s" or "Safe (>30m)")
    bottlenecksCount: number;   // Number of stalled grid quadrants (d >= 3.8 & speed < 0.4)
    reverseFlow: boolean;       // True if a counter-flow directional wave is detected
    panicPropagation: number;   // Acceleration shockwave metric in m/s² (Float)
    statusLevel: 'safe' | 'warning' | 'danger'; // Primary traffic state tag
    scenario: string;           // Active preset scenario identifier (e.g., "bottleneck")
  }
  ```

### 2.2 `EXECUTE_INTERVENTION` (Command UI -> Simulation / Physical Actuators)
Triggered when an authorized officer clicks **"⚡ Accept & Execute Advisory"** inside [recommendationSystem.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/ai/recommendationSystem.js) or commands via [voiceAssistant.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/modules/voiceAssistant.js).

* **Channel / Event Name:** `onExecuteIntervention` / `command:execute_action`
* **TypeScript / Schema Interface:**
  ```typescript
  interface InterventionCommand {
    actionType: 'open_emergency_exit' | 'deploy_security' | 'one_way_flow';
    targetGateId?: string;      // Optional specific barrier/gate ID (e.g., "gate_4_emer")
    officerToken?: string;      // Authorization JWT or role verification hash
    executedAt: number;         // Epoch timestamp of command confirmation
  }
  ```

### 2.3 `SOS_INCIDENT_REPORT` (Citizen Mobile App -> Command Room Dashboard)
Submitted when an on-site citizen sends an urgent distress report via [mobileAppController.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/modules/mobileAppController.js).

* **Channel / Event Name:** `onSosReported` / `event:citizen_sos`
* **TypeScript / Schema Interface:**
  ```typescript
  interface SosIncidentReport {
    reportId: string;           // UUIDv4 or timestamped identifier (e.g., "sos_1754418900122")
    type: 'overcrowding' | 'medical' | 'blockage' | 'panic';
    zone: string;               // Localized sector string (e.g., "Sector B / Ghat Central")
    details: string;            // Citizen raw commentary or empty string
    timestamp: number;          // Epoch execution timestamp
    geoCoordinates?: {          // Optional GPS parameters if permitted by browser/app
      lat: number;
      lng: number;
      accuracyMeters: number;
    };
  }
  ```

---

## 3. External Edge Gateway / Mesh Network Protocols

### 3.1 WebSocket Audio/Visual Edge Stream Ingestion (Future Backend Extension)
When replacing client-side canvas simulation with live real-world computer vision gateway server pipelines (e.g., OpenCV / YOLOv8 Edge Camera Nodes):

* **Protocol:** WebSockets (`wss://gateway.crowdshield.local:8443/stream`)
* **Message Framing:** JSON over binary TLS transport.
* **Expected Inbound Payload:** Matches `TelemetryFrame` schema above with an appended source device identification tag:
  ```json
  {
    "device_id": "CAM_GHAT_SEC4_008",
    "fps_stream": 15.0,
    "telemetry": {
      "timestamp": 1754418652000,
      "peakDensity": 3.8,
      "avgSpeed": 0.75,
      "statusLevel": "warning"
    }
  }
  ```

### 3.2 Offline Bluetooth Low Energy (BLE) Mesh Broadcast Schema
When pushing warnings to mobile phones during cellular tower blackouts, payloads must strictly conform to a **$\le 256\text{-byte}$ UDP/BLE Advertisement package**:

```json
{
  "id": "em_8041",
  "k": "emergencyEvac",
  "l": ["en", "hi", "mr", "ta"],
  "g": "Gate 5",
  "t": 1754418652000,
  "p": 2
}
```
* **Constraint Enforcement:** Any AI assistant or developer extending broadcast features **must never embed heavy graphical assets or raw narrative paragraphs directly in network broadcast payloads**. Always transmit compact dictionary lookup routing keys (`k: "emergencyEvac"`) that resolve locally against installed dictionary stores ([translations.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/data/translations.js)).
