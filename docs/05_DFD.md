# Data Flow Diagrams (DFD) Document
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Level 0, Level 1, and Level 2 Data Flow Architecture  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. Level 0 DFD: Context Diagram
The Level 0 Context Diagram depicts the primary external boundaries and data exchanges connecting external entities to the centralized **CrowdShield Platform**:

```mermaid
graph LR
    E1[CCTV Cameras & Simulators] -->|Raw Video & Telemetry| API((FastAPI Gateway / Data Hub))
    E2[Citizen Smartphone] -->|SOS Reports & Geo-Tags| API
    
    API -->|Risk Status & Safe Routes| E2
    API -->|Action Tasks & Routing| E3[Police Smartphone]
    API -->|Risk Trends & Interventions| E4[Authority Command Center]
    E4 -->|Approval Commands| API
    
    API -->|Venue Config| E5[Event Owner Dashboard]
```

---

## 2. Level 1 DFD: Internal Module Data Pathways
The Level 1 Diagram exposes internal process boundaries, separating Data Ingestion, AI Processing, and State Management.

```mermaid
graph TB
    subgraph INGESTION["Data Hub"]
        IN1[CCTV RTSP Streams]
        IN2[Citizen SOS Submissions]
        IN3[Simulation Digital Twin]
    end

    subgraph AI_PIPELINES["AI Computation Nodes (Python)"]
        P1((1.0 Computer Vision Pipeline))
        P2((2.0 Crowd Analytics Engine))
        P3((3.0 XGBoost Risk Predictor))
        P4((4.0 Decision Recommendation Engine))
        P5((5.0 GenAI Synthesizer))
    end

    subgraph BACKEND["State & APIs (FastAPI)"]
        DB1[(PostgreSQL: Event Configs)]
        DB2[(Redis: Live WebSocket State)]
        WS((WebSocket Broadcaster))
    end

    IN1 & IN3 -->|Raw Data| P1
    IN2 -->|Incident Location| DB1
    
    P1 -->|People Count & Tracking IDs| P2
    P2 -->|Density & Flow Gradients| P3
    P3 -->|Predicted Risk Score| P4
    P3 -->|Metrics| P5
    
    P4 -->|Generated Action Plan| DB1
    P4 -->|Trigger Alert| WS
    P5 -->|Summarized Text| WS
    
    DB1 <-->|Venue Maps & Auth| WS
```

---

## 3. Level 2 DFD: Deep Closed-Loop Intervention Feedback
This diagram tracks the exact data packet lifecycle when a critical incident occurs, flows through the AI, receives human approval, and alerts the public.

```mermaid
sequenceDiagram
    autonumber
    participant CCTV as Live Camera
    participant CV as CV Pipeline (YOLO)
    participant AI as Risk Engine (XGBoost)
    participant Auth as Authority (PWA)
    participant Police as Police (PWA)
    participant Citizen as Citizen (PWA)

    CCTV->>CV: Stream Video Frame
    CV->>CV: Extract 1,250 people, Speed: 0.3m/s
    CV->>AI: Send Meta: Zone C
    AI->>AI: Calculate Density 82%, Predict Risk 88%
    AI->>Auth: WebSocket: [CRITICAL] Zone C. Recommend: Open G4
    
    Auth->>Auth: Review AI Recommendation
    Auth->>AI: Click: APPROVE ACTION
    
    AI->>Police: WebSocket: Task: Deploy to Zone C
    AI->>Citizen: WebSocket Push: "Gate 3 busy. Use Gate 4."
    
    Police->>Police: Navigate to Zone C
    Citizen->>Citizen: Follow safe route away from Gate 3
    
    CCTV->>CV: Stream Video Frame (+5 mins)
    CV->>AI: Extract 800 people, Speed: 1.1m/s
    AI->>Auth: WebSocket: [SAFE] Risk 34%. Intervention Successful.
```

---

## 4. Standard Data Packet Dictionary (JSON Schema)

| Packet Name | Source | Destination | Payload Schema Details |
| :--- | :--- | :--- | :--- |
| **Ingestion Frame** | CCTV / Simulation | CV Pipeline | `{ event_id, zone_id, timestamp, people_count, density, entry_rate, exit_rate }` |
| **Risk Update** | Risk Engine | FastAPI Redis | `{ zone: String, risk_score: Float, predicted_risk: Array, status: 'SAFE'\|'WARNING'\|'CRITICAL' }` |
| **Recommendation** | Decision Engine | Authority PWA | `{ id: String, actions: [{type: "OPEN_GATE", target: "G4"}, {type: "DEPLOY", count: 6}] }` |
| **Public Alert** | FastAPI | Citizen PWA | `{ type: "AVOID_ZONE", zone: "C", recommendation: "G4", timestamp: Int }` |
