# 🛡️ CrowdShield: Detailed Granular TODO Registry (Backend & AI)

This document breaks down the remaining work (Backend, Data Hub, AI, and Routing) into single, granular steps. As we complete each task, we will check it off here.

---

## 🟡 PHASE 5: Backend Database & ORM Foundation

- [ ] **5.1 Database Connection:** Configure PostgreSQL connection (e.g., async SQLAlchemy/SQLModel) in `apps/api/src/core/database.py`.
- [ ] **5.2 Environment Variables:** Add `.env` parsing for `DATABASE_URL`, `REDIS_URL`, and API secrets using Pydantic Settings.
- [ ] **5.3 Event & Venue Models:** Create SQLAlchemy ORM models for `Event`, `Venue`, `Zone`, `Gate`, and `Route`.
- [ ] **5.4 Sensor & Data Models:** Create ORM models for `Sensor`, `Observation`, `CrowdState`, and `Incident`.
- [ ] **5.5 Pydantic Schemas:** Create Pydantic DTOs (Data Transfer Objects) for input validation (e.g., `ZoneCreate`, `ObservationPayload`).
- [ ] **5.6 Database Migrations:** Initialize Alembic, generate the first migration schema, and apply it to the database.

---

## 🟡 PHASE 6: Multi-Source Data Hub (Ingestion Layer)

- [ ] **6.1 Ingestion Router:** Create `apps/api/src/routers/ingestion.py` for all incoming sensor telemetry.
- [ ] **6.2 CCTV Endpoint:** Implement POST `/ingest/cctv` endpoint for AI vision payloads.
- [ ] **6.3 Smart Gate Endpoint:** Implement POST `/ingest/smart-gate` endpoint for hardware gate counts.
- [ ] **6.4 GPS/Citizen Endpoint:** Implement POST `/ingest/citizen-gps` endpoint for anonymous PWA location pings.
- [ ] **6.5 Standardizer Service:** Write a service that normalizes payloads from all 3 endpoints into a single `StandardObservation` format.
- [ ] **6.6 Mock Telemetry Script:** Write a Python script (`scripts/mock_telemetry_pump.py`) to continuously fire fake data into these endpoints for testing.

---

## 🟡 PHASE 7: Crowd Data Fusion Engine

- [ ] **7.1 Fusion Service Setup:** Create `apps/api/src/services/fusion_engine.py`.
- [ ] **7.2 Time-Window Grouping:** Write logic to group all incoming observations by `zone_id` over the last 10-second rolling window.
- [ ] **7.3 Confidence Weighting:** Implement the math to merge overlapping sensor data (e.g., weight CCTV data higher than Drone data if CCTV confidence > 0.9).
- [ ] **7.4 State Generation:** Calculate the definitive `estimated_people`, `density`, and `velocity` for each zone.
- [ ] **7.5 State Persistence:** Save the resulting unified `CrowdState` to both the PostgreSQL DB and Redis (for fast live access).

---

## 🟡 PHASE 8: Real-Time Synchronization (Backend to Frontend)

- [ ] **8.1 WebSocket Manager Upgrade:** Enhance the existing `ConnectionManager` in `apps/api/main.py` to broadcast specific channels.
- [ ] **8.2 State Broadcaster:** Write a background task that reads the latest `CrowdState` from Redis every 1 second and pushes it over WebSockets.
- [ ] **8.3 Frontend Sync:** Update `apps/web/src/stores/crowd-store.ts` to connect to the WebSocket and map incoming data directly to the HUD and Digital Twin variables.

---

## 🟡 PHASE 9: AI Computer Vision Pipeline (Perception)

- [ ] **9.1 AI Architecture Setup:** Create structure inside the `ai/` folder (`src/vision`, `src/risk`, `src/utils`).
- [ ] **9.2 YOLOv8 Inference Loop:** Write a script using `ultralytics` to process RTSP streams or `.mp4` video files frame-by-frame.
- [ ] **9.3 Object Tracking:** Integrate BoT-SORT or ByteTrack so the AI doesn't double-count the same person in the next frame.
- [ ] **9.4 ROI Polygon Mapping:** Write a function to map bounding boxes to specific geographic Zones drawn on the video.
- [ ] **9.5 Velocity Calculation:** Calculate the optical flow/speed of tracked IDs to determine crowd movement speed in meters per second.
- [ ] **9.6 AI-to-API Bridge:** Write the logic to package the YOLO density/velocity metrics into JSON and POST them to the backend `/ingest/cctv` endpoint.

---

## 🟡 PHASE 10: AI Predictive Risk Engine (Intelligence)

- [ ] **10.1 Feature Engineering:** Write a function that calculates the *Density Gradient* (how fast density is increasing over the last 1, 3, and 5 minutes).
- [ ] **10.2 XGBoost Integration:** Setup the XGBoost model to evaluate the time-series features.
- [ ] **10.3 Risk Classification:** Output a normalized Risk Score (0-100) and classify it as NORMAL, ELEVATED, DANGER, or CRITICAL.
- [ ] **10.4 Bottleneck Flags:** Flag a "CRITICAL BOTTLENECK" if local speed < 0.4 m/s AND density > 3.8 p/m².

---

## 🟡 PHASE 11: Decision Engine & Countermeasures

- [ ] **11.1 Rules Engine:** Write the `DecisionService` that maps Risk levels to logical actions (e.g., "If Zone A > 80 Risk -> Restrict Gate 1").
- [ ] **11.2 Authority API:** Create `/api/interventions/recommendations` to fetch active AI suggestions.
- [ ] **11.3 Approval Endpoint:** Create `/api/interventions/{id}/approve` that allows the Authority frontend to execute a recommendation.
- [ ] **11.4 Execution Trigger:** When approved, push an alert via WebSockets to the Citizen PWA and Police Dashboards.

---

## 🟡 PHASE 12: Citizen Route Navigation

- [ ] **12.1 OpenStreetMap Integration:** Use `osmnx` to download and generate a road/walking network graph for the venue area.
- [ ] **12.2 Graph Penalty Injection:** Dynamically increase the "weight" of graph edges that pass through high-density (Red) Zones.
- [ ] **12.3 Modified Routing Algo:** Write a Python function using Dijkstra/A* that finds the shortest path while avoiding the heavily weighted (dangerous) zones.
- [ ] **12.4 Routing Endpoint:** Create `/api/routing` for the Citizen PWA to request directions from point A to point B.
