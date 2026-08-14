# Technical Requirements Document (TRD)
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. System Technology Stack & Architectural Decisions

CrowdShield is engineered as a highly scalable, decoupled Monorepo architecture designed for rapid deployment and edge resilience during massive public gatherings.

### 1.1 Core Frontend Technologies (PWA)
* **Application Foundation:** Next.js (React) operating as a unified Progressive Web App (PWA).
* **Language & Styling:** TypeScript for strict type safety. Tailwind CSS and `shadcn/ui` for rapid, accessible, and responsive component design.
* **State Management:** Zustand for lightweight, fast state management across the application.
* **Map Engine:** Leaflet (via `react-leaflet`) for rendering live geospatial crowd telemetry without API key dependencies.
* **Analytics Charts:** Recharts/ECharts for analytics dashboards.
* **Offline Resilience:** Service Workers and IndexedDB are utilized to cache venue maps, emergency instructions, and offline reporting schemas when cellular networks fail.

### 1.2 Core Backend Technologies (API & Data Hub)
* **API Gateway:** FastAPI (Python) provides high-performance asynchronous REST endpoints and WebSocket connections.
* **ORM & Validation:** SQLAlchemy for database access. Pydantic for strict request/response validation.
* **Database (Persistent):** Neon DB (Cloud PostgreSQL) + PostGIS for spatial queries, event configurations, venue polygons, gate coordinates, and historical analytics.
* **Cache & State (Live):** Redis for ephemeral state data such as live risk scores, active WebSocket connections, Redis Pub/Sub for real-time event streaming.
* **Future Scalability:** Kafka for dedicated stream processing.

### 1.3 AI & Computer Vision Pipeline
* **Perception Layer:** OpenCV and YOLOv8 (Nano) for high-speed person detection, coupled with tracking algorithms (BoT-SORT) for maintaining identity tracking across frames.
* **Prediction Model:** XGBoost trained on time-series window features (e.g., density gradients over 5 minutes) to predict future risk scores.
* **Deep Learning:** PyTorch for advanced model development where needed.

### 1.4 Data Sources Architecture

| Source Type | Protocol | MVP Status | Production Status |
| :--- | :--- | :--- | :--- |
| CCTV (RTSP) | RTSP stream | Real (with recorded video) | Real |
| CCTV (MP4) | File upload | Real | Real |
| Smart Gates | HTTP/WebSocket adapter | Simulated | Real (hardware-agnostic) |
| Citizen GPS | PWA Geolocation API | Real (voluntary) | Real (consent-based) |
| Drone | RTSP/aerial stream | Simulated | Real |
| BLE | Gateway/infrastructure | Simulated | Real (authorized infra only) |
| Telecom | Adapter/gateway | Simulated | Real (partner integration) |
| Wearables | IoT adapter | Not in MVP | Future |
| Synthetic | Python generators | Real | Always available |
| Historical | Dataset files | Real | Always available |

---

## 2. Mathematical Principles & Stampede Physics Algorithms

Regardless of whether data originates from live CCTV, Smart Gates, GPS, or Digital Twin simulation, the core AI math remains consistent.

### 2.1 Critical Crowd Density Thresholds
* **Nominal Fluidity (SAFE):** d < 2.0 p/m2. Individuals retain complete freedom of physical movement.
* **Congestion & Surge (WARNING):** 2.0 <= d < 4.0 p/m2. Contact between pedestrians increases; flow velocity begins degrading below nominal 1.3 m/s.
* **Crush Hazard (CRITICAL DANGER):** d >= 4.0 p/m2. At d > 4.5 p/m2, involuntary wave motion triggers. Shockwave forces exceed human skeletal endurance.

### 2.2 Velocity & Flow Vector Approximation
When localized velocity stalls below **0.4 m/s** while simultaneous density d >= 3.8 p/m2, the Data Hub flags the coordinate zone as an **Active Structural Bottleneck**.

### 2.3 Smart Gate Flow Metrics
* **Net Flow Rate:** entry_count - exit_count per minute
* **Gate Status Thresholds:** NORMAL (< 80% capacity), HIGH_FLOW (80-95%), CONGESTED (95-100%), CRITICAL (> 100% or safety threshold breached)

---

## 3. Crowd Data Fusion Hub

The Fusion Hub is one of the most important components. It performs:

1. Data ingestion (from all source adapters)
2. Normalization (to Standard Observation Format)
3. Validation (schema + range checks)
4. Timestamp synchronization
5. Geospatial mapping (observations to zones)
6. Source health assessment (ONLINE/DELAYED/OFFLINE)
7. Confidence calculation (accuracy, freshness, latency, reliability)
8. Deduplication/overlap handling (sources report overlapping populations)
9. Sensor fusion (confidence-weighted estimation, NOT simple addition)
10. Crowd-state generation (unified per-zone state)

### 3.1 Standard Observation Format

Every source produces a standardized observation:

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

### 3.2 Crowd State Output

The Fusion Hub produces one unified crowd state per zone:

```json
{
  "event_id": "EVT-001",
  "zone_id": "ZONE-B",
  "estimated_people": 1280,
  "density_level": "HIGH",
  "average_speed": 0.34,
  "flow_direction": "NORTH",
  "entry_rate": 165,
  "exit_rate": 52,
  "bottleneck_score": 0.87,
  "risk_score": 86,
  "risk_level": "CRITICAL",
  "confidence": 0.89
}
```

### 3.3 Sensor Fusion Rules

* Do NOT add source counts together (they represent overlapping populations).
* Use confidence-weighted estimation initially.
* Detect sensor disagreement (if one source deviates significantly, reduce its confidence).
* Source health influences confidence (OFFLINE sources have reduced influence).

---

## 4. Communication & Payload Specs

### 4.1 Real-Time WebSocket Telemetry
Live risk updates are pushed from FastAPI to the Next.js PWA clients via WebSockets.

### 4.2 Low-Bandwidth Alert Payload (Offline/Mesh Fallback)
```json
{
  "id": "em_8041",
  "k": "emergencyEvac",
  "g": "Gate 5",
  "t": 1754418652000,
  "p": 1
}
```

---

## 5. Security & Privacy Compliance
* **Zero Biometric Retention:** No raw video frames, facial geometry, or PII persisted.
* **JWT & Role-Based Security:** Frontend is untrusted. All role verifications enforced by FastAPI backend.
* **Human-in-the-Loop:** Critical interventions require verified APPROVE tokens from AUTHORITY role.
* **Privacy Principle:** Estimate the crowd, not unnecessarily track the person.
* **Event Isolation:** Never mix data between events.

---

## 6. Backend Module Architecture

Recommended modules (modular monolith):

```text
auth, users, organizations, events, venues, zones, gates, routes,
sensors, data_ingestion, data_normalization, data_validation,
source_health, sensor_fusion, crowd_state, analytics, risk_engine,
recommendations, incidents, alerts, notifications, police,
simulation, digital_twin, reports, audit
```

---

## 7. Data Pipeline Architecture

```text
SOURCE → ADAPTER → INGESTION → NORMALIZATION → VALIDATION →
GEO MAPPING → SOURCE HEALTH → CONFIDENCE → FUSION →
CROWD STATE → RISK → RECOMMENDATION
```


---

## 54. BACKEND MODULES

Recommended modules:

```text
auth
users
organizations
events
venues
zones
gates
routes
sensors
data_ingestion
data_normalization
data_validation
source_health
sensor_fusion
crowd_state
analytics
risk_engine
recommendations
incidents
alerts
notifications
police
simulation
digital_twin
reports
audit
```

Keep business logic separated.
    # Width penalty: road too narrow for group = high penalty
    required_width = group_size * 0.5  # 0.5m per person
    if road_width >= required_width:
        width_penalty = 1.0
    elif road_width >= required_width * 0.6:
        width_penalty = 2.0  # Tight but possible
    else:
        width_penalty = 100.0  # Impossible for this group
    
    # Group risk: separation risk in crowded areas
    group_risk = 1.0
    if group_size > 5 and crowd_density > 2.0:
        group_risk = 2.0
    if group_size > 10 and crowd_density > 3.0:
        group_risk = 5.0
    if group_profile.has_children and crowd_density > 2.5:
        group_risk *= 1.5
    
    return distance * crowd_multiplier * width_penalty * group_risk
```

### Gate Recommendation Logic

```python
def recommend_gate(gates, group_size, group_profile, current_crowd_state):
    scored_gates = []
    for gate in gates:
        score = 0
        # Queue time (lower is better)
        score -= gate.queue_estimate * 2
        # Capacity (higher is better for large groups)
        if group_size > 5:
            score += gate.max_capacity_per_minute * 0.5
        # Width suitability
        if gate.width >= group_size * 0.5:
            score += 10
        # Current crowd at gate
        score -= current_crowd_state.get_density(gate.zone_id) * 5
        # Special needs
        if group_profile.has_mobility_issues and gate.accessible:
            score += 20
        scored_gates.append((gate, score))
    
    return sorted(scored_gates, key=lambda x: x[1], reverse=True)[0]
```

### Reroute Trigger Logic

```python
def check_reroute_needed(current_route, live_crowd_state, group_profile):
    for segment in current_route.segments:
        live_density = live_crowd_state.get_density(segment.zone_id)
        if live_density > 3.0:  # Dangerous density ahead
            return True, "Density ahead exceeding safe threshold"
        if segment.road_width < group_profile.group_size * 0.3:
            return True, "Road ahead too narrow for group"
    return False, None
```

---

## 65. OPENSTREETMAP INTEGRATION

### Road Network Data
- Use OpenStreetMap (OSM) road network for route calculation
- Import OSM data using `osmnx` Python library
- Convert road network to graph for A* algorithm
- Add CrowdShield operational routes (temporary, emergency) as additional graph edges

### Geocoding
- Use Nominatim (OSM) for address → coordinate conversion
- Use reverse geocoding for coordinate → address display

### Map Tiles
- Use OpenStreetMap tiles for Leaflet (no API key required)
- Fallback: MapTiler or Stamen tiles

---

## 63. BUILDING INSTRUCTION

Do not immediately generate the entire application in one step.

First:

**Analyze the repository and create a technical implementation plan based on this specification.**

Then identify:

* Existing code
* Existing architecture
* Missing modules
* Database changes
* API changes
* Frontend changes
* AI/ML requirements
* Infrastructure requirements
* Dependencies
* Risks

After the plan is approved, implement the system incrementally.

The final implementation must be:

**Modular + Secure + Testable + Scalable + Explainable + Event-centric + Multi-source + Production-oriented.**

Do not sacrifice architecture quality merely to create a visual demo.

