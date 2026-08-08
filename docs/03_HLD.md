# High-Level Design Document (HLD)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** System Architecture & High-Level Design Specification  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. System Architectural Overview
CrowdShield is architected as an interconnected, event-driven reactive platform. It centralizes data ingestion, scales AI processing on the backend, and distributes actionable intelligence to four distinct user roles via a unified Progressive Web App (PWA).

The architecture is divided into three primary layers:
1. **The Ingestion & AI Layer:** Processes live CCTV, datasets, and simulations through computer vision and ML risk models.
2. **The API & Services Layer (FastAPI):** Manages routing, RBAC, WebSockets, and database persistence.
3. **The Presentation Layer (Next.js PWA):** Renders the central interactive map and role-specific dashboards.

---

## 2. Component Architecture Diagram

```mermaid
graph TB
    subgraph INGESTION["1. Data Hub (Ingestion Layer)"]
        A1[CCTV / RTSP Feeds]
        A2[Simulation Data]
        A3[Dataset / MP4 Uploads]
        A4[Citizen Reports]
    end

    subgraph AI_PIPELINE["2. AI & Analytics Engine"]
        B1[CV Pipeline: YOLO + BoT-SORT]
        B2[Crowd Analytics: Density & Flow]
        B3[Risk Prediction: XGBoost]
        B4[Decision Engine: Action Recommendations]
        B5[GenAI: Incident Summarization]
    end

    subgraph BACKEND["3. API Gateway & State (FastAPI)"]
        C1[Auth & RBAC Middleware]
        C2[WebSocket Manager]
        C3[Notification Service]
        DB[(Supabase PostgreSQL)]
        CACHE[(Upstash Redis)]
    end

    subgraph PWA["4. Unified Next.js PWA"]
        D1[Authority Command Center]
        D2[Police Task Mobile UI]
        D3[Citizen Safe Routes UI]
        D4[Admin Venue Config UI]
        M[Leaflet Map Engine]
    end

    A1 & A2 & A3 -->|Raw Data| B1
    A4 -->|Incident Geo-Tag| C1

    B1 -->|Metadata (Count, Speed)| B2
    B2 -->|Time-Series Features| B3
    B3 -->|Risk Score| B4
    B3 -->|Risk Context| B5
    
    B4 -->|Recommendation JSON| C1
    B5 -->|SITREP Text| C1

    C1 <--> DB
    C2 <--> CACHE

    C1 -->|REST & WebSockets| PWA
    M --- D1 & D2 & D3 & D4
```

---

## 3. The 10 Major Technical Modules

| Module Name | Core Responsibility & Architectural Role |
| :--- | :--- |
| **1. Frontend PWA** | Next.js application handling role-based routing (`/authority`, `/police`, `/citizen`). Implements Zustand for state and Service Workers for offline map caching. |
| **2. Auth & RBAC** | FastAPI middleware verifying JWTs. Ensures a Citizen cannot trigger interventions and a Police officer cannot alter venue configurations. |
| **3. Event Management** | Hierarchical Supabase PostgreSQL schema defining an Event $\rightarrow$ Venue $\rightarrow$ Zones $\rightarrow$ Gates $\rightarrow$ Exits $\rightarrow$ Cameras. |
| **4. Map Engine** | Central UI component (Leaflet via react-leaflet) rendering dynamic layers: zone heatmaps, gate statuses, police locations, and citizen safe routes. |
| **5. Data Hub** | Ingests varied formats (RTSP, MP4, JSON) and normalizes them into a standard `TelemetryFrame` payload for the AI pipeline. |
| **6. CV Pipeline** | Python-based OpenCV/YOLOv8 script that converts raw video frames into mathematical metadata (people count, $X/Y$ coordinates, movement direction) without storing PII. |
| **7. Analytics Engine** | Calculates localized density ($people/m^2$), average speed, and flow conflicts from the CV metadata. |
| **8. Risk Prediction** | XGBoost model utilizing time-series memory (e.g., density gradients over 5 minutes) to forecast congestion bottlenecks *before* they happen. |
| **9. Recommendation Engine** | Rule-based decision tree that takes a high Risk Score and suggests concrete interventions (e.g., "Open Gate G4", "Deploy 6 Police"). |
| **10. GenAI Engine** | Translates complex AI metrics into readable natural language (e.g., "Zone C congestion increasing rapidly") and supports hands-free voice command parsing. |

---

## 4. End-to-End Operational Workflow (The Core Loop)

1. **COLLECT:** CCTV streams enter the **Data Hub**.
2. **PROCESS:** The **CV Pipeline** detects 1,250 people moving toward Gate 3 at $0.35\text{ m/s}$.
3. **UNDERSTAND:** The **Analytics Engine** flags this as 83% capacity with a flow conflict.
4. **PREDICT:** The **Risk Engine** forecasts a `CRITICAL` state within 8 minutes.
5. **DECIDE:** The **Recommendation Engine** determines Gate 5 is open and proposes redirecting traffic.
6. **ACT:** 
   * **Authority** receives the recommendation and clicks `APPROVE`.
   * **Police** PWA receives a push task: "Proceed to Gate 3 for crowd redirection."
   * **Citizen** PWA receives an alert: "Heavy congestion at Gate 3. Please use Gate 5."
7. **VERIFY:** The system continues processing. 5 minutes later, density drops. Risk status downgrades to `SAFE`.
