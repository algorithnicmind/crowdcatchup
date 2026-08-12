# 🗓️ 7-Day Hackathon Granular Sprint Plan

This document breaks down the high-level delegation plan into a **highly detailed, step-by-step daily itinerary** for each of the 3 team members, mapping directly to our `13_MASTER_TODO.md` phases. 

---

## 👨‍💻 Member 1: Frontend & UI Lead (The Pixel Perfecter)
**Focus:** Next.js, TailwindCSS, shadcn/ui, Leaflet, User Experience.

### Day 1: Frontend Foundation & Auth Wiring
- [x] **Step 1.7:** Initialize Next.js app with `next-pwa` and manifest.
- [x] **Step 1.8 (Part 1):** Install `shadcn/ui`, `zustand`, `leaflet`, `lucide-react`.
- [x] **Step 1.8 (Part 2):** Build Login and Register Pages.
- [x] **Step 1.8 (Part 3):** Implement the `useAuthStore` to handle JWTs and Role-based redirects (Authority, Police, Citizen, Event Owner).

### Day 2: Premium Event Map Foundation (Phase 2)
- [ ] **Step 1.10:** Build the Base Dashboard Layout (Header, Sidebar, Navigation).
- [x] **Step 2.1:** Implement the hero `EventMap.tsx` component using `react-leaflet`.
- [x] **Step 2.1 (Aesthetic):** Configure CartoDB Dark Matter tiles (or similar) for the "Google Maps-like" premium look.
- [x] **Step 2.1 (Interactivity):** Add smooth fly-to animations and zoom controls.

### Day 3: Map Builders & Visuals
- [x] **Step 2.3 & 2.4:** Build the UI for the Zone Editor and Gate Editor (allowing the Event Owner to draw polygons on the map).
- [x] **Step 2.7:** Build the custom glassmorphism markers and overlays for Temporary Infrastructure (Medical, Police posts).
- [x] **Step 2.8:** Ensure the "TechNova 2026" seeded venue renders perfectly on the map.

### Day 4: UI Dashboards (Phase 7)
- [ ] **Step 7.1:** Build the **Authority Command Center** (Desktop). Add Heatmap toggles, CCTV grids, and Alert feeds.
- [ ] **Step 7.2:** Build the **Event Owner Dashboard** (Desktop) showing infrastructure status and occupancy metrics.

### Day 5: Mobile Apps & Citizen Experience (Phase 7)
- [ ] **Step 7.3:** Build the **Police/Security App** (Mobile-first PWA). Focus on large buttons, GPS tracking, and SOS alerts.
- [ ] **Step 7.4:** Build the **Citizen App** (Mobile-first PWA). Focus on simple, clean navigation, safe route display, and multilingual support (`i18next`).

### Day 6 & 7: Real-Time Wiring & Polish
- [ ] **Step 3.9:** Wire up the UI to the WebSockets. Ensure map markers change color (Green -> Amber -> Red) instantly when a WS event fires.
- [ ] **Day 7:** Final UI Polish, responsive testing on mobile devices, and recording the pitch demo.

---

## ⚙️ Member 2: Backend & Data Architect (The Plumber)
**Focus:** FastAPI, WebSockets, PostgreSQL, Redis, APIs, Simulation.

### Day 1: WebSocket & Pub/Sub Setup
- [ ] **Step 3.1:** Implement the `StandardObservation` Pydantic models for data ingestion.
- [ ] **Step 3.2:** Build the Source Registry API (CRUD for CCTV cameras, Smart Gates, etc.).
- [ ] **Step 3.7 (Part 1):** Integrate Local Redis for high-frequency Pub/Sub messaging.
- [x] **Step 3.7 (Part 2):** Build the robust WebSocket Broadcaster to push updates to the UI.

### Day 2: The Data Pipeline (Phase 3)
- [x] **Step 3.4:** Build the high-throughput `/api/v1/ingest` endpoint with rate limiting.
- [ ] **Step 3.5 & 3.6:** Build the Fusion Engine. Write the math to merge data from multiple sources (CCTV + Gates) into a single "Crowd State".
- [ ] **Step 3.8:** Implement the Source Health Monitor (tracking if a camera goes OFFLINE).

### Day 3: External Adapters (Phase 4)
- [ ] **Step 4.1:** Build the standard CCTV Adapter API.
- [ ] **Step 4.2:** Build the Smart Gate Adapter API (RFID/Turnstile).
- [ ] **Step 4.3 & 4.4:** Build the Drone and Mobile GPS adapters. (Implement mock variants as fallbacks if real hardware is unavailable).

### Day 4: The Simulation Engine (Phase 8)
- [x] **Step 3.3 / 8.1:** Write the Python `SyntheticSimulator`.
- [x] **Step 8.2:** Program specific scenarios: "Normal Inflow", "Sudden Surge", "Gate Blockage". 
- *Goal: This simulator is crucial for the Hackathon demo to prove the system works under stress!*

### Day 5 & 6: Production Database & Optimization
- [ ] **Step 1.1 (Database):** Ensure PostgreSQL connection pooling is optimized for production.
- [ ] **Step 1.1 (PostGIS):** Enable PostGIS on PostgreSQL for spatial queries (finding users inside a Zone polygon).
- [ ] **Day 6:** Load test the WebSocket connections (simulate 10,000 updates/sec).

### Day 7: Deployment
- [ ] Deploy FastAPI to production (e.g., Docker, AWS EC2).
- [ ] Ensure local PostgreSQL and Redis connections are stable.

---

## 🧠 Member 3: AI/ML Engineer (The Brains)
**Focus:** YOLOv8, BoT-SORT, XGBoost, Predictive Risk Algorithms.

### Day 1: CV Environment Setup
- [ ] Set up local PyTorch / OpenCV environment.
- [ ] **Step 5.1:** Download pre-trained YOLOv8 weights. Run a basic inference script on a sample crowd video to detect people (bounding boxes).

### Day 2: Object Tracking & Counting (Phase 5)
- [ ] **Step 5.1 (BoT-SORT):** Integrate BoT-SORT to track individuals across frames, rather than just counting bounding boxes statically.
- [ ] **Step 5.2:** Implement Line-Crossing logic (counting people walking *IN* vs *OUT* of a frame).

### Day 3: CV-to-Backend Bridge
- [ ] **Step 5.4:** Write the Python script that takes the YOLOv8 counting output, formats it into a `StandardObservation` JSON, and POSTs it to Member 2's `/api/v1/ingest` endpoint.

### Day 4: Risk Prediction Model (Phase 5)
- [x] **Step 5.5:** Gather synthetic tabular data for crowd density, weather, time of day, and gate flow.
- [x] **Step 5.5 (XGBoost):** Train a basic XGBoost model to predict "Bottleneck Risk Score" (0-100).
- [x] **Step 5.6:** Expose the XGBoost model via a local FastAPI micro-endpoint (or integrate it directly into Member 2's backend).

### Day 5: Decision Support & Rules Engine (Phase 6)
- [x] **Step 6.1:** Write the Rules Engine that triggers alerts (e.g., If Density > 4 p/m², Fire `CRITICAL` alert).
- [x] **Step 6.2:** Write the Action Recommendation logic (e.g., If Gate 3 is blocked, recommend "Deploy 5 Police" and "Redirect to Gate 4").

### Day 6 & 7: Fine-Tuning & Demo Prep
- [ ] **Step 6.4:** Fine-tune the XGBoost thresholds so that the UI flashes Red/Yellow beautifully during the demo.
- [ ] **Day 7:** Record screen-captures of the YOLOv8 pipeline actually processing video to show the judges the "AI" happening behind the scenes.
