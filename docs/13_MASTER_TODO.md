# CrowdShield Master TODO — Full Project Workflow Tracker
**Project:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Event / Challenge:** TechNova Challenge 2026 — Problem Statement 1
**Total Steps: 70** (9 build phases)

---

## How To Use This File

- `[ ]` = not started · `[~]` = in progress · `[x]` = done
- **Rule 1 — Phase Order:** Phases must be completed in order (docs/10_AI_AGENT_INSTRUCTIONS.md §7). Never skip ahead to Phase 7 before Phase 3 is solid.
- **Rule 2 — Ripple Effect:** After EVERY step, automatically update the related backend/frontend code AND the relevant docs in `/docs/` AND tests (`.agents/AGENTS.md`).
- **Rule 3 — No Fake Completions:** A step is `[x]` only when its `✅ Done when:` gate actually passes.
- **Rule 4 — Event Isolation:** Every data record belongs to an event. Never mix Event A with Event B (docs/08 §27).
- **Rule 5 — Real vs Simulated:** Real and simulated sources use the SAME pipeline. Simulated sources are always labeled SIMULATED (docs/10 Rule 11).

---

## Progress Summary

| Phase | Name | Total | Done | Left |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Foundation | 12 | 10 | 2 |
| 2 | Event Map | 9 | 8 | 1 |
| 3 | Data Hub | 10 | 9 | 1 |
| 4 | Real Crowd Data | 5 | 0 | 5 |
| 5 | AI | 7 | 3 | 4 |
| 6 | Decision Support | 6 | 2 | 4 |
| 7 | User Experiences | 8 | 4 | 4 |
| 8 | Simulation | 4 | 0 | 4 |
| 9 | Production + Deliverables | 9 | 1 | 8 |
| | **TOTAL** | **70** | **37** | **33** |

---

# PHASE 1 — FOUNDATION (docs/12, docs/02, docs/03 · PRD §56)

- [x] **1.1 Scaffold the monorepo**
  Create `apps/web`, `apps/api`, `ai/`, `packages/types`, `packages/config`, `simulation/`, root `package.json` (npm workspaces). Layout must match docs/12_PROJECT_STRUCTURE.md §2 exactly.
  → After: 1.2 · ✅ Done when: structure matches doc 12 §2 tree and repo builds.
- [x] **1.2 Backend core**
  `apps/api/core/` — `config.py` (env from `.env`, NO hardcoded secrets), `database.py` (SQLAlchemy + PostgreSQL/PostGIS), `redis.py`, `security.py` (JWT + password hashing), `events.py` (in-process event bus), `dependencies.py`.
  → After: 1.3 · ✅ Done when: FastAPI boots, DB connects, event bus publishes/subscribes.
- [x] **1.3 Shared kernel**
  `apps/api/shared/` — base_entity, base_value_object, base_domain_event, base_repository, event_bus, websocket_manager, exceptions, error_handlers, api/dependencies.
  → After: 1.4 · ✅ Done when: shared base classes importable and WS manager tested.
- [x] **1.4 Auth feature**
  Feature module layout per doc 12 §4.1: domain (User entity, Email/Password VOs, Role enum: AUTHORITY/POLICE/CITIZEN/EVENT_OWNER), use cases (register/login/get_current_user), JWT issuance, repository + model, routes `/api/v1/auth/*`, Pydantic schemas. **RBAC enforced on the backend only** (PRD §51).
  → After: 1.5 · ✅ Done when: Pytest proves register/login/RBAC and JWT expiry.
- [x] **1.5 Events feature**
  Domain (Event/Zone/Gate/Route entities, GeoPoint/GeoPolygon/DateRange VOs, EventStatus enum with ALL 8 statuses, GateStatus), use cases (create/update/get/list/change_status/create_zone/create_gate/create_route), repositories + models, routes `/api/v1/events/*`, domain events EventCreated + EventStatusChanged.
  → After: 1.6 · ✅ Done when: event CRUD + lifecycle transitions tested (DRAFT→CONFIGURATION→READY→LIVE).
- [x] **1.6 Seed script**
  Demo event "TechNova 2026" with 5 zones, 6 gates, 8 routes, 2 emergency routes, CCTV cameras, Smart Gates (PRD §58).
  → After: 1.7 · ✅ Done when: seed runs and demo event is queryable via API.
- [x] **1.7 PWA setup**
  `manifest.json`, theme colors, icons, service worker, installability, meta tags, offline shell.
  → After: 1.8 · ✅ Done when: app is installable and offline shell loads.
- [x] **1.8 Frontend foundation**
  Install shadcn/ui, zustand, leaflet, i18next. `shared/lib/api-client.ts`, `ws-client.ts`, `useWebSocket`. Stores (auth/event/ui). Login + register pages. Role-based route guard `(dashboard)/authority|police|citizen|event-owner`.
  → After: 1.9 · ✅ Done when: login as each of the 4 roles lands on the correct dashboard route.
- [ ] **1.9 Frontend events UI**
  Event list + create event + status change screens for the Event Owner role.
  → After: 1.10 · ✅ Done when: creating an event from the UI persists and shows in the list.
- [x] **1.10 Base dashboard layout**
  Header, Sidebar, DashboardLayout, role-aware navigation (doc 12 frontend section).
  → After: 1.11 · ✅ Done when: layout renders for all 4 roles.
- [x] **1.11 Unit tests**
  Pytest for auth + events use cases; Jest setup for frontend.
  → After: 1.12 · ✅ Done when: `pytest` green and `npm run lint` green.
- [x] **1.12 Docs ripple**
  Verify README quick-start works; docs reflect the actual repo state.
  → After: PHASE 1 GATE · ✅ Done when: quick-start runs from scratch.
- [ ] **🚧 PHASE 1 GATE** *(pass before Phase 2)*
  Create event persists · JWT + RBAC work · WebSocket connects · PWA installable.
  → After: Phase 2 starts.

# PHASE 2 — EVENT MAP (docs/11 §7–11, docs/06, docs/04 §3)

- [x] **2.1 Leaflet map feature**
  `EventMap.tsx` + ZoneLayer, GateLayer, RouteLayer, HeatmapLayer, CrowdOverlay; `useMapEngine`, `useMapLayers`, `geo-utils.ts`.
  → After: 2.2 · ✅ Done when: map renders with base tiles.
- [x] **2.2 Venue boundary**
  Draw/edit/save event polygon on the map; backend persistence (PostGIS).
  → After: 2.3 · ✅ Done when: saved polygon reloads on the map.
- [x] **2.3 Zone builder**
  ZoneEditor — draw zone polygons, name, capacity, warning + critical thresholds (doc 11 §10).
  → After: 2.4 · ✅ Done when: zones persist and thresholds validated (warning < critical).
- [x] **2.4 Gate builder**
  GateEditor — entry/exit/smart gates, Gate-Zone-Route relationships (LLD §5), SmartGateConfig schema (doc 08 §6).
  → After: 2.5 · ✅ Done when: gate→zone→routes links validated on backend.
- [x] **2.5 Route builder**
  RouteEditor — draw/edit routes; types: one-way, two-way, emergency, police-only, temporary; activate/deactivate; capacity (doc 11 §11).
  → After: 2.6 · ✅ Done when: all route types persist and render.
- [ ] **2.6 GPS route recording** (P1, LLD §3)
  Walk-a-route capture → trajectory smoothing → editable route; accuracy handling (LLD §3.2).
  → After: 2.7 · ✅ Done when: recorded trajectory becomes a route.
- [x] **2.7 Temporary infrastructure**
  Medical camps, police posts, barricades, water stations, restricted zones as map markers + backend models (LLD §4).
  → After: 2.8 · ✅ Done when: markers persist and render per event.
- [x] **2.8 Map wiring**
  Full venue (boundary + zones + gates + routes + infrastructure) rendered for the seeded event.
  → After: 2.9 · ✅ Done when: demo venue fully visible on the map.
- [x] **2.9 Tests + docs ripple**
  Polygon/route validation tests; update docs 06 and 11.
  → After: PHASE 2 GATE · ✅ Done when: tests green and docs updated.
- [x] **🚧 PHASE 2 GATE** *(pass before Phase 3)*
  Full demo venue drawn, saved, and rendered on the map.
  → After: Phase 3 starts.

# PHASE 3 — DATA HUB (docs/05, docs/08, docs/02 §3, docs/04 §7, docs/10 Rule 5) — HACKATHON-CRITICAL

- [x] **3.1 Standard Observation Format**
  `packages/types/src/observation.ts` + Pydantic schema — event_id, source_id, source_type, zone_id, timestamp, metric, value, confidence, latency_ms, health (doc 08 §1). ONE contract for real AND simulated sources.
  → After: 3.2 · ✅ Done when: TS + Python types match doc 08 exactly.
- [x] **3.2 Source registry**
  Register sources per event (CCTV, SMART_GATE, GPS, DRONE, BLE, TELECOM, SYNTHETIC); SourceHealth schema (doc 08 §3); strict event isolation (doc 08 §27).
  → After: 3.3 · ✅ Done when: sources CRUD per event, isolated by event_id.
- [x] **3.3 Synthetic simulator**
  `simulation/` generator + synthetic_adapter — normal inflow, sudden surge, gate blockage, route blocked, crowd surge scenarios; labeled SIMULATED.
  → After: 3.4 · ✅ Done when: simulator emits valid StandardObservations at a configurable rate.
- [x] **3.4 Ingestion endpoint**
  Production-grade `/api/v1/ingest` replacing the current stub — Pydantic validation, event isolation, rate limiting, source health updates.
  → After: 3.5 · ✅ Done when: invalid observations rejected; valid ones persist.
- [x] **3.5 Normalization + validation pipeline**
  data_normalization + data_validation modules (HLD §3).
  → After: 3.6 · ✅ Done when: all adapter outputs normalize to one format.
- [x] **3.6 Fusion engine**
  Confidence-weighted estimation, timestamp sync, dedup, disagreement detection (LLD §7); Crowd State output per zone (doc 08 §2).
  → After: 3.7 · ✅ Done when: fusion math unit tests pass (LLD §7 formulas).
- [x] **3.7 Crowd state + events**
  CrowdState entity; publish CrowdStateUpdated domain event → WebSocket `CROWD_STATE_UPDATE` (doc 08 §4.2).
  → After: 3.8 · ✅ Done when: WS delivers crowd state to all roles.
- [x] **3.8 Source health monitor**
  ONLINE/DELAYED/OFFLINE tracking, confidence_impact, `SOURCE_HEALTH` WS event (doc 08 §4.7); graceful degradation when a source fails.
  → After: 3.9 · ✅ Done when: killing a source degrades fusion but the system survives.
- [x] **3.9 Frontend crowd panels**
  CrowdMetrics, ZoneStatusCard, SourceHealthPanel, RiskPanel skeleton; `useCrowdState`, `useRiskUpdates` hooks (doc 12 frontend).
  → After: 3.10 · ✅ Done when: live zone status + source health on dashboard.
- [ ] **3.10 End-to-end + tests + docs ripple**
  Simulator → ingest → fusion → WS → UI verified end-to-end; fusion accuracy tests (doc 09).
  → After: PHASE 3 GATE · ✅ Done when: full pipeline verified and tested.
- [ ] **🚧 PHASE 3 GATE** *(pass before Phase 4)*
  Fake telemetry flows live to the map — the demo backbone works.
  → After: Phase 4 starts.

# PHASE 4 — REAL CROWD DATA (docs/05 §18–24, docs/10 Rule 5 & 11)

- [ ] **4.1 CCTV adapter**
  Real (RTSP/MP4) + clearly-marked mock implementation of the IDataSource interface (doc 10 §6 — never pretend a simulator is a real connection).
  → After: 4.2 · ✅ Done when: adapter emits observations; mock labeled SIMULATED.
- [ ] **4.2 Smart Gate adapter**
  Entry/exit counts, flow rate, queue estimate, confidence (LLD §2 + gate status thresholds).
  → After: 4.3 · ✅ Done when: gate observations flow through the same pipeline.
- [ ] **4.3 GPS adapter**
  Citizen device telemetry → zone_device_count per zone.
  → After: 4.4 · ✅ Done when: GPS observations fuse with other sources.
- [ ] **4.4 Drone / BLE / Telecom adapters** (simulated for MVP)
  Same interface, architecture ready for real sources later.
  → After: 4.5 · ✅ Done when: all 7 source types registered in one event.
- [ ] **4.5 Transparency in UI**
  Simulated sources show a SIMULATED badge in the Source Health panel (Rule 11).
  → After: PHASE 4 GATE · ✅ Done when: badges visible and honest.
- [ ] **🚧 PHASE 4 GATE** *(pass before Phase 5)*
  Every adapter produces valid observations through ONE pipeline.
  → After: Phase 5 starts.

# PHASE 5 — AI (docs/04 §6 & §32–36, `ai/` folder)

- [ ] **5.1 AI package scaffold**
  `ai/domain/interfaces` (IDetector, ITracker, IRiskPredictor), Detection entity, pipelines folder.
  → After: 5.2 · ✅ Done when: `ai/` imports cleanly and requirements install.
- [ ] **5.2 CV pipeline**
  yolo_detector (YOLOv8), bot_sort_tracker (BoT-SORT), cv_pipeline → people count, density, speed, direction per zone.
  → After: 5.3 · ✅ Done when: processed video frame → per-zone metrics.
- [ ] **5.3 Analytics pipeline**
  Density, flow rates, dwell time, occupancy (LLD §33).
  → After: 5.4 · ✅ Done when: analytics consumed by fusion/risk.
- [x] **5.4 Risk model**
  xgboost_predictor — time-series features → risk score 0–100; risk levels LOW/MODERATE/HIGH/CRITICAL (LLD §6, §36).
  → After: 5.5 · ✅ Done when: model outputs scores for seeded history.
- [x] **5.5 Prediction engine**
  5/10/15-minute forecasts → `RISK_UPDATE` WebSocket with plus_5/plus_10/plus_15 (doc 08 §4.1).
  → After: 5.6 · ✅ Done when: predictions push to Authority dashboard.
- [x] **5.6 Bottleneck + anomaly detection**
  bottleneck_score 0–1, flow conflict, stagnant movement flags (LLD §34).
  → After: 5.7 · ✅ Done when: congested scenario triggers flags.
- [ ] **5.7 ML tests + fallback**
  Model evaluation tests (doc 09); risk pipeline falls back to historical predictions if the camera drops.
  → After: PHASE 5 GATE · ✅ Done when: tests green + fallback verified.
- [ ] **🚧 PHASE 5 GATE** *(pass before Phase 6)*
  Per-zone risk + predictions driven by fusion output.
  → After: Phase 6 starts.

# PHASE 6 — DECISION SUPPORT (docs/04 §37–39, PRD §38, doc 08 §8)

- [x] **6.1 Decision engine**
  Risk + crowd state → recommendations; InterventionType enum (12 types, doc 08 §8); Recommendation entity with explanation (LLD §8: primary_reason, supporting_factors, source_agreement).
  → After: 6.2 · ✅ Done when: HIGH/CRITICAL risk produces recommendations.
- [x] **6.2 Recommendation WebSocket**
  `RECOMMENDATION_ALERT` to Authority (doc 08 §4.3).
  → After: 6.3 · ✅ Done when: recommendation card appears live.
- [ ] **6.3 Approval flow (human-in-the-loop)**
  Authority approves → `EXECUTE_ACTION` WS (doc 08 §4.4) → InterventionApproved event → state recorded → broadcast.
  → After: 6.4 · ✅ Done when: approve → intervention recorded → UI updates.
- [ ] **6.4 Police deployment**
  `SECURITY_TASK` WebSocket (doc 08 §4.5) — zone, distance, required_officers, instructions.
  → After: 6.5 · ✅ Done when: police receive task on approval.
- [ ] **6.5 Announcements**
  `CITIZEN_ALERT` WS (doc 08 §4.6), message_key → i18n templates EN/HI/OD (PRD §47), anti-panic protocol (doc 10 §3.3), human-approved broadcast.
  → After: 6.6 · ✅ Done when: multilingual alert reaches citizen PWA.
- [ ] **6.6 Explainability UI**
  RecommendationCard + ExplanationPanel (doc 12 frontend).
  → After: PHASE 6 GATE · ✅ Done when: explanation visible with every recommendation.
- [ ] **🚧 PHASE 6 GATE** *(pass before Phase 7)*
  Full loop works — recommend → approve → deploy/broadcast → risk drops.
  → After: Phase 7 starts.

# PHASE 7 — USER EXPERIENCES (docs/06, PRD §4, doc 12)

- [x] **7.1 Event Owner dashboard**
  Event management, venue builder, simulations access, status controls.
  → After: 7.2 · ✅ Done when: owner completes the full setup flow.
- [x] **7.2 Authority dashboard**
  Multi-event overview, risk panels, predictions, recommendations + approval, source health, intervention log.
  → After: 7.3 · ✅ Done when: authority sees everything for all events.
- [x] **7.3 Police dashboard**
  Tactical map, task list, incident acknowledge, route-to-zone guidance.
  → After: 7.4 · ✅ Done when: police receives and acknowledges a task.
- [x] **7.4 Citizen app**
  Safe route guidance, alerts, SOS reporting (FR-13/14, doc 08 §5). NO panic-inducing metrics (PRD §4).
  → After: 7.5 · ✅ Done when: citizen sees green routes + alerts only.
- [ ] **7.5 Incidents feature (backend)**
  Create/resolve incident, IncidentCreated event, citizen SOS → command map.
  → After: 7.6 · ✅ Done when: SOS appears on Authority map.
- [ ] **7.6 Citizen Journey Navigation — backend** (innovation, docs/04 §64, docs/08 §64)
  `features/navigation/` — Group/Journey/SafeRoute entities; use cases plan_group_journey, navigate, check_reroute; route_engine (A* (A-Star) + crowd weights); navigation_engine (turn-by-turn); osm_adapter; `POST /api/v1/navigation/plan`, `POST /exit-plan`, WS `/api/v1/navigation/live` (NAVIGATION_UPDATE, REROUTE_ALERT, GROUP_MEMBER_ALERT).
  → After: 7.7 · ✅ Done when: plan request returns SafeRoutes with gate recommendations (doc 08 §64 schemas).
- [ ] **7.7 Citizen Journey Navigation — frontend**
  JourneyPlanner, GroupSizeSelector, RouteMap, NavigationPanel, CrowdOverlay, GateRecommendation, GroupTipCard, ExitPlanner; hooks useJourney/useNavigation/useLiveReroute/useGroupCoordination; group profiles SOLO→LARGE_GROUP + special needs priority (PRD §9B).
  → After: 7.8 · ✅ Done when: 3 journey phases (to / inside / going home from event) work in demo.
- [ ] **7.8 PWA polish**
  Push notifications, offline map cache (Service Worker + IndexedDB), mobile install.
  → After: PHASE 7 GATE · ✅ Done when: all mobile flows work offline-aware.
- [ ] **🚧 PHASE 7 GATE** *(pass before Phase 8)*
  All 4 roles complete a live walkthrough.
  → After: Phase 8 starts.

# PHASE 8 — SIMULATION (FR-15/16, PRD §57, doc 10 Rule 10)

- [ ] **8.1 Digital Twin**
  Event map + live crowd state + risk as a virtual replica.
  → After: 8.2 · ✅ Done when: twin renders current state.
- [ ] **8.2 Scenario engine**
  Pre-scripted scenarios — normal arrival, sudden inflow, route blocked, gate unavailable, crowd surge; manual controls for demo control.
  → After: 8.3 · ✅ Done when: each scenario changes crowd state on demand.
- [ ] **8.3 What-if analysis**
  E.g. "close Gate C?" → predicted ripple effects on zones and routes.
  → After: 8.4 · ✅ Done when: what-if output visible on Authority dashboard.
- [ ] **8.4 Post-event reports**
  Event summary, risk timeline, intervention history (reports module, HLD §3).
  → After: PHASE 8 GATE · ✅ Done when: report generated from a completed event.
- [ ] **🚧 PHASE 8 GATE** *(pass before Phase 9)*
  Demo story (PRD §11) runs end-to-end flawlessly.
  → After: Phase 9 starts.

# PHASE 9 — PRODUCTION & DELIVERABLES (docs/07, docs/09, PRD §2 & §51)

- [ ] **9.1 Security hardening**
  RBAC audit, rate limiting, security headers, CORS lockdown, audit logging, input validation, secrets via env only (PRD §51).
  → After: 9.2 · ✅ Done when: security checklist from PRD §51 complete.
- [x] **9.2 Backend tests**
  Pytest unit/integration/e2e for all features; fusion accuracy tests + chaos playbooks (doc 09).
  → After: 9.3 · ✅ Done when: full test suite green.
- [ ] **9.3 Frontend tests**
  Jest/Playwright for dashboards + navigation.
  → After: 9.4 · ✅ Done when: frontend test suite green.
- [ ] **9.4 Performance + monitoring**
  WebSocket load, AI latency, logging, graceful degradation verification.
  → After: 9.5 · ✅ Done when: WS handles demo load; degraded mode verified.
- [ ] **9.5 Deployment**
  CI/CD — Vercel (web), Docker/AWS (API), Neon DB (Cloud PostgreSQL) (DB); env config; HTTPS (doc 07).
  → After: 9.6 · ✅ Done when: both apps deploy from CI and talk over HTTPS.
- [ ] **9.6 Docs final sync + README**
  Verify quick-start; docs 01–12 match the code.
  → After: 9.7 · ✅ Done when: README quick-start works from scratch.
- [ ] **9.7 Architecture diagram + source code pack** (mandatory deliverable)
  Data flow, modules, third-party APIs used.
  → After: 9.8 · ✅ Done when: diagram matches implemented system.
- [ ] **9.8 Pitch deck (≤10 slides) + Demo video** (mandatory)
  → After: 9.9 · ✅ Done when: deck ≤10 slides, video recorded.
- [ ] **9.9 Documentation pack** (mandatory)
  Tech choices, assumptions, compliance checks (data ethics & privacy).
  → After: DEMO REHEARSAL · ✅ Done when: all 5 deliverables present.

---

# FINAL: DEMO REHEARSAL (PRD §58 — the hackathon story)

- [ ] **D1** Create event with 5 zones, 6 gates, 8 routes, 2 emergency routes, CCTV cameras, Smart Gates
- [ ] **D2** Start simulation — normal state: Zone A, B, C all GREEN
- [ ] **D3** Inject incident — Gate G3 high inflow, Zone B density increasing, Route R4 congested, CCTV detecting slowing, GPS showing more devices
- [ ] **D4** Fusion engine — crowd state changes
- [ ] **D5** Risk engine — Zone B risk increases to CRITICAL
- [ ] **D6** Prediction — "High risk developing in Zone B within approximately 10 minutes"
- [ ] **D7** Decision engine — Restrict G3, Open G5, Redirect crowd, Deploy police, Broadcast warning
- [ ] **D8** Authority approves
- [ ] **D9** Crowd state improves, risk falls
- [ ] **D10** Result — Incident prevented / risk mitigated

# FINAL: DELIVERABLE CHECKLIST (PRD §2 — missing any = disqualification)

- [ ] Working prototype: Citizen PWA + Command Dashboard
- [ ] Architecture diagram + source code (data flow, modules, third-party APIs)
- [ ] Pitch deck (max 10 slides)
- [ ] Demo video
- [ ] Documentation (tech choices, assumptions, compliance checks)
