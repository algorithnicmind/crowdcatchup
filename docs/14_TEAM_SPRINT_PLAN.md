# 🗓️ 7-Day Hackathon Granular Sprint Plan

This document breaks down the high-level delegation plan into a **highly detailed, step-by-step daily itinerary** for each of the 3 team members, mapping directly to our `13_MASTER_TODO.md` phases. 

---

## 👨‍💻 Member 1: Frontend & UI Lead (The Pixel Perfecter)
**Focus:** Next.js, TailwindCSS, shadcn/ui, SVG Maps, User Experience.

### Day 1: Frontend Foundation & Auth Wiring
- [x] **Step 1.7:** Initialize Next.js app with `next-pwa` and manifest.
- [x] **Step 1.8 (Part 1):** Install `shadcn/ui`, `zustand`, `lucide-react`.
- [x] **Step 1.8 (Part 2):** Build Login and Register Pages.
- [x] **Step 1.8 (Part 3):** Implement the `useAuthStore` to handle JWTs and Role-based redirects (Authority, Police, Citizen, Event Owner).

### Day 2: Premium Event Map Foundation (Phase 2)
- [x] **Step 1.10:** Build the Base Dashboard Layout (Header, Sidebar, Navigation).
- [x] **Step 2.1:** Implement the hero `EventMap.tsx` component using custom SVG Digital Twin.
- [x] **Step 2.1 (Aesthetic):** Configure dark mode styling for the premium SVG Digital Twin look.
- [x] **Step 2.1 (Interactivity):** Add smooth fly-to animations and zoom controls.

### Day 3: Map Builders & Visuals
- [x] **Step 2.3 & 2.4:** Build the UI for the Zone Editor and Gate Editor (allowing the Event Owner to draw polygons on the map).
- [x] **Step 2.7:** Build the custom glassmorphism markers and overlays for Temporary Infrastructure (Medical, Police posts).
- [x] **Step 2.8:** Ensure the "TechNova 2026" seeded venue renders perfectly on the map.

### Day 4: UI Dashboards (Phase 7)
- [x] **Step 7.1:** Build the **Authority Command Center** (Desktop). Add Heatmap toggles, CCTV grids, and Alert feeds.
- [x] **Step 7.2:** Build the **Event Owner Dashboard** (Desktop) showing infrastructure status and occupancy metrics.

### Day 5: Mobile Apps & Citizen Experience (Phase 7)
- [x] **Step 7.3:** Build the **Police/Security App** (Mobile-first PWA). Focus on large buttons, GPS tracking, and SOS alerts.
- [x] **Step 7.4:** Build the **Citizen App** (Mobile-first PWA). Focus on simple, clean navigation, safe route display, and multilingual support (`i18next`).

### Day 6 & 7: Real-Time Wiring, Verification & Polish
- [x] **Step 3.9:** Wire up the UI to the WebSockets. Ensure map markers change color (Green -> Amber -> Red) instantly when a WS event fires.
- [x] **Step 6.6 (Explainability UI):** Enhance the RecommendationCard component. When AI recommends an action, display the primary_reason, supporting_factors, and confidence score so the human Authority trusts the decision.
- [x] **Step 7.7 (Citizen Journey Navigation - Frontend):** Build JourneyPlanner, GroupSizeSelector, and NavigationPanel. Consume backend navigation API to display "Safe Route" (green line) and guide users turn-by-turn.
- [x] **Step 7.8 (PWA Polish & Performance):** Finalize Citizen app PWA. Register Service Worker, configure IndexedDB to cache venue map offline, ensure web push notifications work smoothly. Optimize React re-renders for large crowd state updates.
- [ ] **Day 7 (Manual UI Verification):** Manually test all 4 role workflows (Event Owner setup, Authority intervention approval, Police task acceptance, Citizen safe routing) to ensure 100% smooth end-to-end functionality.
- [ ] **Step 9.3 (Frontend Testing):** Write exhaustive Jest/Playwright tests for dashboard rendering, responsive navigation on mobile dimensions, and WebSocket state updates.
- [ ] **Step 9.1 (Frontend Security):** Verify all restricted routes properly redirect unauthenticated users. Ensure JWT tokens are stored securely and removed upon logout.
- [ ] **Step 9.5 (Deployment & HTTPS):** Configure and execute CI/CD. Deploy Next.js to Vercel. Deploy FastAPI via Docker/AWS. Connect to production Neon DB with connection pooling. Enforce global HTTPS redirects.
- [ ] **Step 9.8 & 9.9 (Pitch deck, Demo & Docs):** Create the 10-slide presentation deck. Record the official 3-minute demo video showing the full hackathon scenario story. Finalize the architecture diagram and documentation pack.
---

## ⚙️ Member 2: Backend & Data Architect (The Plumber)
**Focus:** FastAPI, WebSockets, Neon DB, Redis, APIs, Simulation.

### Day 1: WebSocket & Pub/Sub Setup
- [x] **Step 3.1:** Implement the `StandardObservation` Pydantic models for data ingestion.
- [x] **Step 3.2:** Build the Source Registry API (CRUD for CCTV cameras, Smart Gates, etc.).
- [x] **Step 3.7 (Part 1):** Integrate Local Redis for high-frequency Pub/Sub messaging.
- [x] **Step 3.7 (Part 2):** Build the robust WebSocket Broadcaster to push updates to the UI.

### Day 2: The Data Pipeline (Phase 3)
- [x] **Step 3.4:** Build the high-throughput `/api/v1/ingest` endpoint with rate limiting.
- [x] **Step 3.5 & 3.6:** Build the Fusion Engine. Write the math to merge data from multiple sources (CCTV + Gates) into a single "Crowd State".
- [x] **Step 3.8:** Implement the Source Health Monitor (tracking if a camera goes OFFLINE).

### Day 3: External Adapters (Phase 4)
- [ ] **Step 4.1:** Build the standard CCTV Adapter API.
- [ ] **Step 4.2:** Build the Smart Gate Adapter API (RFID/Turnstile).
- [ ] **Step 4.3 & 4.4:** Build the Drone and Mobile GPS adapters. (Implement mock variants as fallbacks if real hardware is unavailable).

### Day 4: The Simulation Engine (Phase 8) & Citizen Navigation
- [x] **Step 3.3 / 8.1:** Write the Python `SyntheticSimulator`.
- [x] **Step 8.1 (Digital Twin):** Ensure Authority dashboard map syncs perfectly with live crowd state, coloring zones based on live risk levels, and showing active interventions.
- [x] **Step 8.2 (Scenario engine):** Build manual override buttons on Event Owner dashboard to inject pre-scripted scenarios ("Sudden Inflow", "Route Blocked").
- [x] **Step 8.3 (What-if analysis):** Implement a prediction tool where Authority can select a hypothetical action and the system runs a fast-forward simulation.
- [ ] **Step 8.4 (Post-event reports):** Create endpoint that aggregates all event data into a final summary report.
- [ ] **Step 7.5 (Incidents feature):** Implement backend REST API (`POST /api/v1/incidents`) and WS events for Citizen SOS reporting. Drop pins on Authority map.
- [ ] **Step 7.6 (Citizen Navigation Backend):** Implement core A* pathfinding in `route_engine.py`. Add penalty weights for crowded zones (from live density) and account for `GroupSize`.

### Day 5 & 6: Production Database & Optimization
- [x] **Step 1.1 (Database):** Ensure Neon DB (Cloud PostgreSQL) connection pooling is optimized for production.
- [x] **Step 1.1 (PostGIS):** Enable PostGIS on Neon DB for spatial queries (finding users inside a Zone polygon).
- [ ] **Step 9.4 (Performance):** Load test the WebSocket connections. Simulate high WebSocket traffic to ensure FastAPI and Redis don't crash under demo conditions.

### Day 7: Testing, Security, Performance & Deployment
- [ ] **Day 7 (Manual Data Pipeline Verification):** Manually trigger the Simulation Engine and verify that synthetic data strictly triggers the Fusion Engine, updates the Neon Database, and broadcasts the correct WebSocket payloads without data race conditions.
- [ ] **Step 9.1 (Backend Security Adding):** Implement strict Rate Limiting on public `/ingest` routes. Add Security Headers, enforce CORS lockdown (restrict to Vercel domain), and validate all Pydantic inputs. Guarantee secrets are handled exclusively via `.env`.
- [ ] **Step 9.2 (Backend Testing):** Fix any remaining Pytest suite issues. Achieve 100% test coverage for the core Fusion, Risk prediction pipelines, and WebSocket authentication flow.
- [ ] **Step 9.4 (Performance & Stability):** Conduct aggressive load testing on the WebSocket manager. Simulate 500+ concurrent connections to ensure FastAPI and Redis pub/sub do not drop packets under demo conditions. Verify graceful degradation if AI adapters disconnect.

---

## 🧠 Member 3: AI/ML Engineer (The Brains)
**Focus:** YOLOv8, BoT-SORT, XGBoost, Predictive Risk Algorithms.

### Day 1: CV Environment Setup
- [x] Set up local PyTorch / OpenCV environment.
- [x] **Step 5.1:** Download pre-trained YOLOv8 weights. Run a basic inference script on a sample crowd video to detect people (bounding boxes).

### Day 2: Object Tracking & Counting (Phase 5)
- [x] **Step 5.1 (BoT-SORT):** Integrate BoT-SORT to track individuals across frames, rather than just counting bounding boxes statically.
- [x] **Step 5.2:** Implement Line-Crossing logic (counting people walking *IN* vs *OUT* of a frame).

### Day 3: CV-to-Backend Bridge
- [x] **Step 5.4:** Write the Python script that takes the YOLOv8 counting output, formats it into a `StandardObservation` JSON, and POSTs it to Member 2's `/api/v1/ingest` endpoint.

### Day 4: Risk Prediction Model (Phase 5)
- [x] **Step 5.5:** Gather synthetic tabular data for crowd density, weather, time of day, and gate flow.
- [x] **Step 5.5 (XGBoost):** Train a basic XGBoost model to predict "Bottleneck Risk Score" (0-100).
- [x] **Step 5.6:** Expose the XGBoost model via a local FastAPI micro-endpoint (or integrate it directly into Member 2's backend).

### Day 5: Decision Support & Rules Engine (Phase 6)
- [x] **Step 6.1:** Write the Rules Engine that triggers alerts (e.g., If Density > 4 p/m², Fire `CRITICAL` alert).
- [x] **Step 6.2:** Write the Action Recommendation logic (e.g., If Gate 3 is blocked, recommend "Deploy 5 Police" and "Redirect to Gate 4").

### Day 6 & 7: Fine-Tuning & Demo Prep
- [ ] **Step 6.3 (Approval flow):** Wire up the "Approve" button on Authority dashboard to trigger `EXECUTE_ACTION` WS. Broadcast `InterventionApproved` event.
- [ ] **Step 6.4 (Police deployment):** Upon approval of security intervention, dispatch `SECURITY_TASK` WS payload (zone, required officers, instructions) to Police clients.
- [ ] **Step 6.5 (Announcements):** Implement `CITIZEN_ALERT` WS to push notifications to Citizen PWA using i18n anti-panic templates (EN/HI/OD).
- [ ] **Step 6.4:** Fine-tune the XGBoost thresholds so that the UI flashes Red/Yellow beautifully during the demo.
- [ ] **Day 7:** Record screen-captures of the YOLOv8 pipeline actually processing video to show the judges the "AI" happening behind the scenes.
