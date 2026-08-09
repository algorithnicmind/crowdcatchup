# CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**TechNova Challenge 2026 — Problem Statement 1 Solution**

![Version](https://img.shields.io/badge/Version-3.0.0--MULTI--SOURCE-00F2FE?style=for-the-badge&logo=shield&logoColor=black)
![Stack](https://img.shields.io/badge/Stack-Next.js_%7C_FastAPI_%7C_PostGIS-10B981?style=for-the-badge&logo=react&logoColor=white)
![AI](https://img.shields.io/badge/AI-OpenCV_%7C_YOLOv8_%7C_XGBoost-F59E0B?style=for-the-badge)

**CrowdShield** is an AI-powered event crowd-safety platform that detects dangerous crowd conditions **before they develop into crowd crushes or stampedes** and provides actionable recommendations to authorities, police, and event organizers.

Instead of monitoring a single CCTV feed, CrowdShield combines **multiple independent data sources** (CCTV, Smart Gates, GPS, Drone, BLE, Telecom) into a unified **Crowd Data Fusion Hub** that produces a single crowd state per zone, predicts risk, and recommends preventive interventions.

The core principle:

> **Configure the event first. Sense the crowd from multiple sources. Fuse the observations. Understand the crowd state. Predict risk. Recommend preventive action. Let authorized humans act. Measure the result.**

---

## Core Features & Innovations

1. **Multi-Source Data Fusion Hub:** Combines CCTV, Smart Gates, Citizen GPS, Drone, BLE, and Telecom through standardized adapters into a unified crowd state. No single sensor is permanently reliable — the system continues operating when any source fails.
2. **Standard Observation Format:** Every data source produces the same standardized observation (event_id, source_id, source_type, zone_id, metric, value, confidence, health). Real and simulated sources use identical formats.
3. **AI Predictive Risk Engine:** XGBoost model forecasts crush likelihood in 5, 10, and 15-minute future windows with explainable recommendations.
4. **Unified PWA with RBAC:** One application, four experiences — Authority, Police, Citizen, Event Owner — differentiated by JWT-based role routing.
5. **Event-First Architecture:** Every data point belongs to an event. Event lifecycle: Draft → Configuration → Ready → Live → Completed.
6. **Smart Gate System:** Hardware-agnostic gate counting (AI camera, IR, LiDAR, turnstile, RFID, QR) with real-time status monitoring.
7. **Custom Route System:** Routes that don't exist in normal maps — one-way, emergency, police-only, temporary, GPS-recorded.
8. **Digital Twin & Simulation:** Pre-event what-if scenarios (sudden inflow, route blockage, gate failure, crowd surge).
9. **Offline & Edge Resilience:** Service Workers + IndexedDB cache venue maps during cellular network failure.
10. **Human-in-the-Loop:** AI recommends. Authorized humans approve. Every recommendation explains why.
11. **Citizen Journey Navigation (Innovation):** Google Maps-style safe routing from source to destination with group-aware recommendations. Adapts routes based on group size, special needs (elderly, children, wheelchair), and real-time crowd conditions. Three-phase journey: Getting to event → Inside event → Going home.
12. **Group-Aware Routing:** Modified Dijkstra algorithm with crowd weights. Routes adapt for solo travelers, couples, families, groups, and large groups. Special needs get priority routing.

---

## Quick Start

CrowdShield is a modern monorepo consisting of a Next.js frontend and a FastAPI backend.

### Step 1: Start the FastAPI Backend
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Step 2: Start the Next.js PWA
```bash
cd apps/web
npm install
npm run dev
```

### Step 3: Open the Platform
Navigate to **`http://localhost:3000`** in your browser.

---

## Documentation Suite (`docs/`)

| Seq | Document | Target Audience | Key Highlights |
| :---: | :--- | :--- | :--- |
| **01** | **[PRD](./docs/01_PRD.md)** | Product Evaluators | Problem statement, 4 personas, event lifecycle, functional requirements, build phases, demo scenario. |
| **02** | **[TRD](./docs/02_TRD.md)** | System Architects | Tech stack, data sources, Fusion Hub, observation format, crowd state, sensor fusion, backend modules. |
| **03** | **[HLD](./docs/03_HLD.md)** | Solution Designers | Architecture diagram, 25+ modules, data pipeline, event-first model, source adapter pattern. |
| **04** | **[LLD](./docs/04_LLD.md)** | Algorithm Specialists | Smart Gate system, GPS route recording, temporary infrastructure, Gate-Zone-Route, XGBoost features, fusion math. |
| **05** | **[DFD](./docs/05_DFD.md)** | Data Architects | Multi-source data flow, Level 0/1/2 diagrams, fusion pipeline, Standard Observation Format. |
| **06** | **[UI Specs](./docs/06_UI_WIRE_FRAMES.md)** | UX/UI Designers | Map-centric design, 4 role dashboards, Event Owner venue builder, Smart Gate status UI, Source Health panel. |
| **07** | **[Deployment](./docs/07_DEPLOYMENT_AND_OPS.md)** | DevOps | AWS infrastructure, multi-source resilience, graceful degradation, offline PWA, event isolation. |
| **08** | **[API Schema](./docs/08_API_AND_EVENTS_SCHEMA.md)** | Integration Engineers | Standard Observation, Crowd State, Source Health, WebSocket events, Smart Gate config, Event config. |
| **09** | **[Testing](./docs/09_TESTING_AND_QA_STRATEGY.md)** | QA Engineers | Pytest, Playwright, ML eval, multi-source testing, fusion accuracy, chaos playbooks. |
| **10** | **[AI Agent Rules](./docs/10_AI_AGENT_INSTRUCTIONS.md)** | AI Assistants, Devs | Monorepo boundaries, event-first rules, adapter pattern, anti-panic protocol, build phase awareness. |
| **11** | **[Domain Model](./docs/11_DOMAIN_MODEL.md)** | Database Designers | Domain entities, Event map layers, zones, custom route system. |

---

## Repository Architecture (Monorepo)

```
crowdshield/
├── apps/
│   ├── web/                 # Next.js PWA (Frontend UI & Role Routing)
│   └── api/                 # FastAPI (Backend, WebSockets, DB interaction)
├── ai/                      # AI/ML Pipeline (OpenCV, YOLOv8, XGBoost)
├── data/
│   ├── raw/                 # Input video/datasets
│   └── processed/           # Feature stores
├── simulation/
│   └── digital-twin/        # Scenario generation for testing
├── docs/                    # Technical documentation (00_MASTER_SPEC to 10_AI_AGENT)
├── README.md                # Project overview (This File)
└── package.json             # Root workspace definitions
```

---

## Data Sources

| Category | Sources | MVP Status |
| :--- | :--- | :--- |
| **Core** | CCTV, Smart Gates, Citizen GPS | Real |
| **Advanced** | Drone, BLE, Telecom | Simulated (architecture ready for real) |
| **Development** | Synthetic, Historical, Replay | Always available |

---

## Build Phases

| Phase | Name | Scope |
| :---: | :--- | :--- |
| 1 | Foundation | Auth, RBAC, Database, Event Management, PWA |
| 2 | Event Map | Map builder, zones, gates, routes, GPS recording |
| 3 | Data Hub | Source registry, observation model, fusion |
| 4 | Real Data | CCTV, Smart Gate, GPS adapters |
| 5 | AI | Analytics, risk model, prediction |
| 6 | Decision | Recommendations, deployment, announcements |
| 7 | UX | Authority, Police, Event Owner, **Citizen Journey Navigation** |
| 8 | Simulation | Digital Twin, scenario simulation |
| 9 | Production | Security, testing, monitoring, deployment |

---

*Designed and engineered for maximum public safety during the TechNova Challenge 2026.*
