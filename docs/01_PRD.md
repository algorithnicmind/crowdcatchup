# Product Requirements Document (PRD)
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Target Event / Challenge:** TechNova Challenge 2026 - Problem Statement 1
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)
**Status:** Approved / Completed

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. Executive Summary
India hosts some of the world largest public gatherings (e.g., Maha Kumbh Mela, Rath Yatra, regional religious festivities, music concerts, and sports stadium championships). According to national disaster records, India documented over 120 stampede-related deaths in 2024 and more than 110 in 2025.

**CrowdShield** transforms crowd management from reactive observation into **predictive public safety**. Instead of building disjointed apps for different stakeholders, CrowdShield provides a **unified Progressive Web App (PWA)** centered around an AI-driven Map Engine and a **Crowd Data Fusion Hub** that combines multiple independent data sources (CCTV, Smart Gates, GPS, Drone, BLE, Telecom) into a unified crowd state. The system forecasts congestion bottlenecks and crush risks **10 to 15 minutes before they escalate into emergencies** and recommends preventive interventions to authorized humans.

The core principle:

> **Configure the event first. Sense the crowd from multiple sources. Fuse the observations. Understand the crowd state. Predict risk. Recommend preventive action. Let authorized humans act. Measure the result.**

---

## 2. Problem Statement & Background
* **Historical Crisis:** India documented over 120 stampede-related deaths in 2024 and more than 110 in 2025.
* **The Root Cause:** In a densely packed crowd (d >= 4.5 persons/m2), individual physical agency is lost. Even a minor incident causes severe compression waves and panic propagation.
* **The Opportunity:** A software-first, role-based platform that processes multiple independent data sources to predict crush likelihood, generate 1-click countermeasures for authorities, guide on-ground police, and broadcast localized safe routes to citizens.

---

## 3. Primary Scope

CrowdShield primarily manages:

* Religious gatherings, Festivals, Melas, Rath Yatra/processions
* Concerts, Sports events, Cultural events
* Political/public gatherings, Exhibitions
* Large temporary public events

The primary scope is **event crowd safety**. Do NOT turn the project into a general city-wide traffic management system.

---

## 4. Target Audiences & User Personas

CrowdShield utilizes a **Role-Based Access Control (RBAC)** architecture. All users log into the same platform but experience vastly different interfaces tailored to their operational needs.

### Persona A: Authority / Command Center
* **Goal:** Monitor multiple events, oversee overall risk, approve interventions, deploy resources.
* **Interface:** Full map visibility, AI risk metrics, 5/10/15-min predictions, data source health, recommendation approval.
* **Key Question:** "What is happening right now, and what should I do?"

### Persona B: Security / Police Staff
* **Goal:** Execute immediate physical interventions, receive deployment recommendations.
* **Interface:** Mobile-optimized task lists, turn-by-turn navigation, incident acknowledgement.
* **Key Question:** "Where do I need to go, and what is my task?"

### Persona C: Citizen / Festival Attendee
* **Goal:** Navigate safely through massive gatherings.
* **Interface:** Simplified mobile PWA. Current location, green safe routes, localized alerts. **No panic-inducing metrics.**
* **Key Question:** "Where should I go, and what should I avoid?"

### Persona D: Event Organizer / Admin
* **Goal:** Create events, configure venue topology, manage infrastructure, run simulations.
* **Interface:** Venue configuration tools (draw zones, gates, routes, cameras, Smart Gates), pre-event simulation.
* **Key Question:** "How do I configure this event for the AI Engine?"

---

## 5. Functional Requirements & Feature Specification

| ID | Module / Area | Feature Name | Requirement Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Event Management** | Event Lifecycle | System shall support 8 event statuses: Draft, Configuration, Ready, Live, Paused, Completed, Cancelled, Archived. Every data point belongs to an event. | **P0 (Core)** |
| **FR-02** | **Event Map** | Venue Builder | Event Owner can draw event boundary, create zones, define gates, create routes (one-way, two-way, emergency, police-only, temporary). | **P0 (Core)** |
| **FR-03** | **Event Map** | GPS Route Recording | Event Owner can physically walk a route; system captures GPS trajectory, smooths it, and generates an editable route. | **P1 (High)** |
| **FR-04** | **Smart Gates** | Smart Gate System | Hardware-agnostic gate counting (AI camera, IR, LiDAR, turnstile, RFID, QR). Produces entry/exit counts, flow rate, queue estimate, confidence. | **P0 (Core)** |
| **FR-05** | **Data Hub** | Multi-Source Ingestion | System shall accept CCTV (RTSP/MP4), Smart Gates, Citizen GPS, Drone, BLE, Telecom, Synthetic data through the same ingestion architecture. | **P0 (Core)** |
| **FR-06** | **Data Hub** | Standard Observation Format | All sources produce standardized observations with event_id, source_id, source_type, zone_id, timestamp, metric, value, confidence, health. | **P0 (Core)** |
| **FR-07** | **Fusion Hub** | Sensor Fusion | Crowd Data Fusion Hub performs normalization, validation, timestamp sync, geo mapping, source health, confidence calculation, deduplication, and produces unified Crowd State. | **P0 (Core)** |
| **FR-08** | **AI Pipeline** | Density & Velocity Tracking | CV pipeline (YOLO/BoT-SORT) extracts people count, density, speed, direction. | **P0 (Core)** |
| **FR-09** | **Risk Prediction** | Crush Likelihood Forecasting | XGBoost model evaluates time-series metrics to generate risk scores (5/10/15 min windows). | **P0 (Core)** |
| **FR-10** | **Recommendations** | Automated AI Countermeasures | Decision engine proposes actionable interventions with explanations. Human-in-the-loop approval required. | **P0 (Core)** |
| **FR-11** | **PWA Platform** | Role-Based Access Control | Single Next.js frontend dynamically renders Authority, Police, Citizen, Event Owner dashboards based on JWT roles. | **P0 (Core)** |
| **FR-12** | **PWA Map UI** | Centralized Venue Rendering | Interactive map with event boundary, zones, gates, routes, heatmaps, risk overlays, incidents, Smart Gates, cameras. | **P0 (Core)** |
| **FR-13** | **Citizen App** | Green Safe Route Guidance | Mobile PWA displays visual pathing directing citizens to non-congested exits. | **P1 (High)** |
| **FR-14** | **Citizen App** | Crowdsourced SOS Reporting | Citizens submit geo-tagged incident reports onto the main Command Map. | **P1 (High)** |
| **FR-15** | **Simulation** | Pre-Event Simulation | Event Owner can run scenarios (normal arrival, sudden inflow, route blocked, gate unavailable, crowd surge). | **P1 (High)** |
| **FR-16** | **Digital Twin** | Event Digital Twin | Event map evolves into lightweight Digital Twin representing venue, zones, routes, gates, sensors, crowd state, risk. | **P2 (Bonus)** |
| **FR-17** | **GenAI** | GenAI Summaries & Alerts | LLM translates metrics into readable situation reports and multilingual citizen broadcast text. | **P2 (Bonus)** |
| **FR-18** | **Resilience** | Offline PWA Capabilities | Service Workers and IndexedDB cache venue maps during cellular network failure. | **P2 (Bonus)** |
| **FR-19** | **Voice** | Voice Command Center | Authority can query system via natural language. | **P3 (Future)** |

---

## 6. Event Lifecycle

The system follows an event-first architecture:

```
CREATE EVENT → DEFINE VENUE → CREATE ZONES → DEFINE GATES → CREATE ROUTES
→ ADD CAMERAS → ADD DATA SOURCES → CONFIGURE CAPACITIES → VALIDATE VENUE
→ RUN SIMULATION → PUBLISH EVENT → LIVE MONITORING → RISK PREDICTION
→ INTERVENTION → POST-EVENT ANALYTICS
```

Event statuses: **Draft** → **Configuration** → **Ready** → **Live** → **Paused** / **Completed** / **Cancelled** → **Archived**

---

## 7. Data Sources

| Category | Sources | Status |
| :--- | :--- | :--- |
| **Core** | CCTV, Smart Gates, Citizen GPS, Venue/entry systems | Real (MVP) |
| **Advanced** | Drone, BLE/proximity, Telecom, Wearables/IoT | Simulated (MVP), Real later |
| **Development** | Synthetic data, Historical datasets, Replay data | Always available |

All sources enter through the same data-ingestion architecture. Real and simulated sources produce the same standardized observation format.

---

## 8. Non-Functional Requirements & Constraints
* **NFR-01: Single Platform Architecture:** Monorepo (Next.js + FastAPI). No fragmented codebases.
* **NFR-02: Network Resilience:** PWA caches critical routes/maps. Graceful degradation when sources fail.
* **NFR-03: Real-Time Synchronization:** WebSocket push for live updates. No HTTP polling.
* **NFR-04: Human-in-the-Loop:** AI recommends. Authorized humans approve critical interventions.
* **NFR-05: Data Privacy:** Estimate the crowd, not unnecessarily track the person. No raw biometric storage.
* **NFR-06: Event Isolation:** Never mix data between events. Every observation has an event_id.
* **NFR-07: Source Resilience:** No single sensor is permanently reliable. System continues operating when any source fails.
* **NFR-08: Explainable AI:** Every recommendation must explain why.

---

## 9. Key Performance Indicators (KPIs) & Success Vision
* **Early Warning Horizon:** Alert generated >= 10 minutes prior to crowd density exceeding lethal compression thresholds.
* **Mitigation Latency:** Complete cycle of AI Recommend -> Authority Approve -> Police Deploy -> Risk Drops verified within 180 seconds.
* **Cross-Role Clarity:** Each persona interacts exclusively with the data they need.
* **Source Resilience:** System continues operating with degraded accuracy when any single source fails.

---

## 10. Build Phases

| Phase | Name | Scope |
| :---: | :--- | :--- |
| 1 | Foundation | Repo, Auth, RBAC, Database, Event Management, PWA |
| 2 | Event Map | Map builder, zones, gates, routes, GPS recording, temporary infra |
| 3 | Data Hub | Source registry, observation model, synthetic data, ingestion, fusion |
| 4 | Real Crowd Data | CCTV, Smart Gate, GPS adapters |
| 5 | AI | Crowd analytics, risk model, prediction, bottleneck detection |
| 6 | Decision Support | Recommendations, deployment, announcements |
| 7 | User Experiences | Authority, Police, Event Owner, Citizen dashboards |
| 8 | Simulation | Digital Twin, scenario simulation, what-if analysis |
| 9 | Production | Security, testing, monitoring, performance, deployment |

---

## 11. Hackathon Demo Scenario

The demo tells a story:

1. **Create event** with 5 zones, 6 gates, 8 routes, 2 emergency routes, CCTV cameras, Smart Gates
2. **Start simulation** — normal state: Zone A, B, C all GREEN
3. **Generate incident** — Gate G3 high inflow, Zone B density increasing, Route R4 congested, CCTV detecting slowing, GPS showing more devices
4. **Fusion engine** — crowd state changes
5. **Risk engine** — Zone B risk increases to CRITICAL
6. **Prediction** — "High risk developing in Zone B within approximately 10 minutes"
7. **Decision engine** — Restrict G3, Open G5, Redirect crowd, Deploy police, Broadcast warning
8. **Authority approves**
9. **Crowd state improves, risk falls**
10. **Result: Incident prevented / risk mitigated**

---

*Designed and engineered for maximum public safety during the TechNova Challenge 2026.*
