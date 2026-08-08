# Technical Requirements Document (TRD)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Technical Systems Specification & Engineering Foundation  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. System Technology Stack & Architectural Decisions

CrowdShield is engineered as a highly scalable, decoupled Monorepo architecture designed for rapid deployment and edge resilience during massive public gatherings.

### 1.1 Core Frontend Technologies (PWA)
* **Application Foundation:** Next.js (React) operating as a unified Progressive Web App (PWA). 
* **Language & Styling:** TypeScript for strict type safety. Tailwind CSS and `shadcn/ui` for rapid, accessible, and responsive component design.
* **Map Engine:** Mapbox GL JS or Leaflet integration for rendering live geospatial crowd telemetry.
* **Offline Resilience:** Service Workers and IndexedDB are utilized to cache venue maps, emergency instructions, and offline reporting schemas when cellular networks fail.

### 1.2 Core Backend Technologies (API & Data Hub)
* **API Gateway:** FastAPI (Python) provides high-performance asynchronous REST endpoints and WebSocket connections.
* **Database (Persistent):** PostgreSQL + PostGIS extension for storing event configurations, venue polygons, gate coordinates, and historical analytics.
* **Cache & State (Live):** Redis manages ultra-low latency, ephemeral state data such as live risk scores, active WebSocket connections, and real-time police locations.

### 1.3 AI & Computer Vision Pipeline
* **Perception Layer:** OpenCV and YOLO for high-speed person detection, coupled with ByteTrack or BoT-SORT for maintaining identity tracking across frames.
* **Prediction Model:** XGBoost trained on time-series window features (e.g., density gradients over 1, 5, and 10 minutes) to predict future risk scores.

---

## 2. Mathematical Principles & Stampede Physics Algorithms

Regardless of whether data originates from live CCTV or Digital Twin simulation, the core AI math remains consistent.

### 2.1 Critical Crowd Density ($d$) Thresholds
CrowdShield classifies crowd safety into distinct states based on localized area density ($d$) measured in $\text{people/m}^2$:
* **Nominal Fluidity (`SAFE`):** $d < 2.0\text{ p/m}^2$. Individuals retain complete freedom of physical movement and walking pace.
* **Congestion & Surge (`WARNING`):** $2.0 \le d < 4.0\text{ p/m}^2$. Contact between pedestrians increases; flow velocity begins degrading below nominal $1.3\text{ m/s}$.
* **Crush Hazard & Stampede Risk (`CRITICAL DANGER`):** $d \ge 4.0\text{ p/m}^2$. At $d > 4.5\text{ p/m}^2$, involuntary wave motion triggers due to excessive chest physical contact. Shockwave forces exceed human skeletal endurance, presenting immediate asphyxiation and trampling risk.

### 2.2 Velocity & Flow Vector Approximation
Crowd migration velocity ($\vec{v}$) is computed across spatial zones using averaged vector components extracted from the tracking IDs:

$$\vec{V}_{avg} = \left( \frac{1}{n} \sum_{i=1}^{n} v_{x,i}, \quad \frac{1}{n} \sum_{i=1}^{n} v_{y,i} \right)$$

When localized velocity $\vec{V}_{avg}$ stalls below **$0.4\text{ m/s}$** while simultaneous density $d \ge 3.8\text{ p/m}^2$, the Data Hub flags the coordinate zone as an **Active Structural Bottleneck**.

---

## 3. Communication & Payload Specs

### 3.1 Real-Time WebSocket Telemetry
To prevent HTTP polling overhead, live risk updates are pushed from FastAPI to the Next.js PWA clients via WebSockets.

```json
{
  "type": "RISK_UPDATE",
  "zone": "ZONE_C",
  "risk": 87,
  "level": "CRITICAL",
  "timestamp": "2026-08-08T11:30:00Z"
}
```

### 3.2 Low-Bandwidth Alert Payload Format (Offline/Mesh Fallback)
During severe gathering congestion, standard 4G/5G cellular towers fail due to packet signaling saturation. To ensure citizen alerts penetrate offline environments via local caching or simulated Bluetooth Low Energy (BLE) mesh networking, broadcast payloads are serialized into compact JSON tuples:

```json
{
  "id": "em_8041",
  "k": "emergencyEvac",
  "g": "Gate 5",
  "t": 1754418652000,
  "p": 1
}
```

* **Field Definitions:** 
  * `id`: Unique deduplication string.
  * `k`: Translation dictionary key matching localized device storage (PWA cache).
  * `g`: Recommended target escape vector / gate.
  * `t`: Epoch timestamp in milliseconds.
  * `p`: Priority level (`0` Info, `1` Warning, `2` Critical Alarm).

---

## 4. Security & Privacy Compliance Specifications

* **Zero Biometric Retention:** All incoming vision feeds (from RTSP cameras or MP4 datasets) undergo instantaneous abstract feature extraction in the CV pipeline. No raw video frames, facial geometry parameters, or citizen personal identifiable information (PII) are persisted to the PostgreSQL database.
* **JWT & Role-Based Security:** The Next.js frontend is untrusted. All role verifications (Authority, Police, Citizen, Admin) are enforced exclusively by the FastAPI backend using signed JWT access tokens.
* **Human-in-the-Loop Countermeasures:** Execution of structural countermeasures (e.g., closing gates, deploying police) requires verified `APPROVE` tokens signed by an `AUTHORITY` role before state transitions propagate to public broadcasting channels.
