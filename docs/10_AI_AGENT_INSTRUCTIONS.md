# AI Agent Coding Instructions & Developer Conventions
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. Purpose

This specification is designed for automated AI Coding Assistants and human collaborative developers. Any AI system interacting with this codebase MUST strictly adhere to the rules below.

---

## 2. Mandatory Architectural Constraints (Never Violate)

### 2.1 Rule 1: Monorepo Boundary Enforcement
* **Frontend UI Code:** `/apps/web/` — Next.js App Router, Tailwind CSS, `shadcn/ui`, Zustand, Leaflet.
* **Backend API Code:** `/apps/api/` — FastAPI, Pydantic, SQLAlchemy, PostgreSQL/PostGIS, Redis.
* **AI Pipelines:** `/ai/` — YOLOv8, BoT-SORT, XGBoost, OpenCV.

### 2.2 Rule 2: Single PWA Principle
Do NOT create separate web apps for different roles. All users log into the same Next.js application. RBAC via JWT conditionally renders the appropriate dashboard.

### 2.3 Rule 3: WebSocket Real-Time Synchronization
Do NOT use HTTP Polling for live updates. All live telemetry must use WebSockets managed in a centralized React Context.

### 2.4 Rule 4: Event-First Architecture
Every data point must belong to an event. Never mix Event A with Event B. The hierarchy is: EVENT → VENUE → ZONE/GATE/ROUTE → SOURCE → OBSERVATION.

### 2.5 Rule 5: Source Adapter Pattern
All data sources (real and simulated) connect through standardized adapters that produce the Standard Observation Format. Never create a separate "fake data system" — real and simulated sources use the same pipeline.

### 2.6 Rule 6: Human-in-the-Loop
AI recommends. Authorized humans approve. Do not design the MVP to autonomously control public infrastructure without authorization.

---

## 3. Standard Operating Procedures

### 3.1 Adding a New Data Source Adapter
1. Create adapter class implementing the SourceAdapter interface.
2. Adapter must produce StandardObservation format.
3. Register adapter in the Data Source Registry.
4. Add source to Source Health monitoring.
5. Test: adapter produces valid observations, health status reported correctly.

### 3.2 Adding a New Venue Configuration
1. Define Venue Polygon (coordinates).
2. Define Zones (Zone A, Zone B, etc.).
3. Define Gates with Gate-Zone-Route relationships.
4. Map CCTV Cameras to Zones.
5. Configure Smart Gates.
6. Define Routes (one-way, emergency, temporary).

### 3.3 Adding a New Regional Language
1. Add JSON dictionary in `/apps/web/public/locales/{lang}/common.json`.
2. Translate all critical broadcast keys.
3. **Anti-Panic Protocol:** Never use vocabulary that incites panic. Use reassuring, direction-oriented instructions.

---

## 4. Code Style & Documentation Conventions

* **Clickable File Links:** Always use GitHub-style file links in documentation.
* **TypeScript Strictness:** Never use `any`. All data structures must map to schemas in `08_API_AND_EVENTS_SCHEMA.md`.
* **Pydantic Strictness:** Never omit types in FastAPI. All API inputs validated.
* **Defensive Error Handling:** WebSocket disconnects show "Attempting to reconnect..." toast. AI pipeline falls back to historical predictions if camera drops.
* **Logging:** Add logging for important operations.
* **Error Handling:** Graceful degradation. Never crash on sensor failure.

---

## 5. Development Principles

The coding agent must:

1. Understand the complete architecture before coding.
2. Never randomly rewrite working code.
3. Inspect the existing repository before making changes.
4. Preserve existing functionality.
5. Follow modular architecture.
6. Use TypeScript strictly on frontend.
7. Use typed Pydantic schemas on backend.
8. Validate all API inputs.
9. Never put secrets in source code.
10. Never implement authorization only in frontend.
11. Write tests for important business logic.
12. Use migrations for database changes.
13. Avoid unnecessary dependencies.
14. Avoid premature microservices.
15. Keep code production-oriented.
16. Add logging and error handling.
17. Handle sensor failures gracefully.
18. Keep real and synthetic sources compatible through the same data contracts.
19. Keep every data record associated with an event.
20. Never mix event data.
21. Make AI recommendations explainable.
22. Keep humans in control of critical interventions.
23. Treat privacy as a design requirement.
24. Document major architectural decisions.
25. Never claim a feature works unless it is actually implemented and tested.

---

## 6. AI Agent Behavior Before Implementation

Before implementing any major feature:

1. Inspect repository.
2. Understand existing architecture.
3. Identify affected modules.
4. Plan changes.
5. Implement incrementally.
6. Run tests.
7. Run lint/type checks.
8. Verify database migrations.
9. Verify API behavior.
10. Verify frontend behavior.
11. Verify security implications.
12. Document changes.

Do not create fake integrations. If an external system is unavailable, create a clearly marked adapter/interface and a simulator/mock implementation. Never pretend the simulator is a real connection.

---

## 7. Build Phase Awareness

Implement features according to the 9-phase build order:

| Phase | Scope |
| :--- | :--- |
| 1 - Foundation | Auth, RBAC, Database, Event Management, PWA |
| 2 - Event Map | Map builder, zones, gates, routes, GPS recording |
| 3 - Data Hub | Source registry, observation model, synthetic data, fusion |
| 4 - Real Data | CCTV, Smart Gate, GPS adapters |
| 5 - AI | Analytics, risk model, prediction |
| 6 - Decision | Recommendations, deployment, announcements |
| 7 - UX | Authority, Police, Event Owner, Citizen dashboards |
| 8 - Simulation | Digital Twin, scenario simulation |
| 9 - Production | Security, testing, monitoring, deployment |

Do not jump ahead to Phase 7 features before Phase 3 is solid.


---

## 59. DEVELOPMENT PRINCIPLES FOR THE AI CODING AGENT

The coding agent must:

1. Understand the complete architecture before coding.
2. Never randomly rewrite working code.
3. Inspect the existing repository before making changes.
4. Preserve existing functionality.
5. Follow modular architecture.
6. Use TypeScript strictly on frontend.
7. Use typed Pydantic schemas on backend.
8. Validate all API inputs.
9. Never put secrets in source code.
10. Never implement authorization only in frontend.
11. Write tests for important business logic.
12. Use migrations for database changes.
13. Avoid unnecessary dependencies.
14. Avoid premature microservices.
15. Keep code production-oriented.
16. Add logging and error handling.
17. Handle sensor failures gracefully.
18. Keep real and synthetic sources compatible through the same data contracts.
19. Keep every data record associated with an event.
20. Never mix event data.
21. Make AI recommendations explainable.
22. Keep humans in control of critical interventions.
23. Treat privacy as a design requirement.
24. Document major architectural decisions.
25. Never claim a feature works unless it is actually implemented and tested.

---

## 60. IMPORTANT AI AGENT BEHAVIOR

Before implementing any major feature:

1. Inspect repository.
2. Understand existing architecture.
3. Identify affected modules.
4. Plan changes.
5. Implement incrementally.
6. Run tests.
7. Run lint/type checks.
8. Verify database migrations.
9. Verify API behavior.
10. Verify frontend behavior.
11. Verify security implications.
12. Document changes.

Do not create fake integrations.

If an external system such as telecom or live drone infrastructure is unavailable, create a clearly marked adapter/interface and a simulator/mock implementation.

Never pretend the simulator is a real telecom connection.

---

