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


---

## 2. PROJECT PURPOSE

CrowdShield is an AI-powered event crowd-safety platform designed specifically for **large public gatherings and events**.

The primary objective is to detect dangerous crowd conditions **before they develop into crowd crushes or stampedes** and provide actionable recommendations to authorities, police and event organizers.

CrowdShield must not be designed merely as a CCTV monitoring dashboard.

The core concept is:

> **Create an event-specific digital representation of the venue and continuously combine multiple independent crowd-data sources into a unified Crowd Data Fusion Hub. Use the resulting crowd state to predict risk and recommend preventive interventions.**

The system must be resilient.

No single sensor/source should be treated as permanently reliable.

If CCTV fails, GPS or Smart Gates may still provide information.

If telecom data is unavailable, CCTV + Smart Gates + other sources can continue.

If a drone is unavailable, the system must continue operating.

---

## 3. PRIMARY SCOPE

CrowdShield primarily manages:

* Religious gatherings
* Festivals
* Melas
* Rath Yatra/processions
* Concerts
* Sports events
* Cultural events
* Political/public gatherings
* Exhibitions
* Large temporary public events

The primary scope is **event crowd safety**.

Do NOT turn the project into a general city-wide traffic management system.

Traffic/transport information may be added later as an external supporting signal, but event crowd safety remains the core product.

---

## 4. CORE USERS

The system uses one PWA/application ecosystem with role-based interfaces.

There are four primary user roles:

## 4.1 Authority

Responsible for:

* Monitoring multiple events
* Monitoring overall risk
* Viewing live crowd maps
* Viewing incidents
* Approving interventions
* Deploying/reallocating police/security resources
* Managing emergency responses
* Viewing analytics
* Reviewing historical incidents
* Managing event-level permissions

## 4.2 Police/Security

Responsible for:

* Viewing assigned event
* Viewing high-risk zones
* Receiving alerts
* Viewing incidents
* Receiving deployment recommendations
* Viewing safest routes
* Updating incident status
* Confirming field actions
* Reporting field conditions

## 4.3 Event Owner/Organizer

Responsible for:

* Creating events
* Configuring event details
* Defining venue boundary
* Creating zones
* Defining entries/exits
* Configuring Smart Gates
* Creating routes
* Recording routes using GPS
* Creating temporary routes
* Adding emergency routes
* Registering cameras/sensors
* Configuring capacities
* Running pre-event simulations
* Monitoring event status
* Managing event infrastructure

## 4.4 Citizen

Responsible for:

* Viewing event information
* Receiving congestion/safety alerts
* Receiving location-based warnings
* Viewing safe routes
* Reporting incidents
* Optionally sharing location with permission
* Receiving multilingual announcements

Citizens must NOT receive sensitive authority/police operational information.

---

## 5. PWA REQUIREMENT

CrowdShield must primarily be implemented as a **Progressive Web App (PWA)**.

The PWA should provide:

* Responsive UI
* Desktop support
* Mobile support
* Installability
* Push notifications where supported
* Offline-friendly capabilities
* Service worker
* Cached critical information
* Role-based dashboards
* Map-based interfaces

However, do not assume a PWA can perform unrestricted background GPS or Bluetooth scanning.

Where advanced native capabilities are required in the future, design the architecture so a native companion application/SDK can be added without rewriting the backend.

---

## 38. HUMAN-IN-THE-LOOP

CrowdShield is a decision-support system.

AI recommends.

Authorized humans approve or execute.

Do not design the MVP to autonomously control public infrastructure without authorization.

Example:

AI:
"Recommend restricting G3."

Authority:
APPROVE

Then:

System:
"Intervention recorded."

---

## 47. MULTILINGUAL COMMUNICATION

The system should support multilingual alerts.

Architecture should allow:

* English
* Hindi
* Odia
* Additional Indian languages later

Messages should be short and safety-focused.

Example:

"Please avoid Gate 3. Use Gate 5."

AI may generate incident summaries and recommended announcements, but safety-critical messages should use controlled templates and human approval where appropriate.

---

## 48. GENERATIVE AI

Use Generative AI for:

* Incident summaries
* Authority reports
* Event summaries
* Natural-language dashboard queries
* Multilingual announcement drafts
* Explanation of risk
* Event post-analysis

Do not let generative AI directly override deterministic safety controls.

---

## 49. VOICE COMMAND CENTER

Future/bonus feature:

Authority can ask:

"Which zone currently has the highest risk?"

System:

"Zone B has the highest current risk."

Or:

"Which gate should receive more security?"

System provides an explainable recommendation.

---

## 50. OFFLINE / NETWORK FAILURE

The system must be resilient.

Possible failures:

* Internet outage
* CCTV disconnection
* GPS unavailable
* Telecom unavailable
* Drone unavailable
* Sensor failure
* Server connectivity problems

The system should support:

* Local buffering
* Eventual synchronization
* Cached map
* Last-known state
* Source health status
* Degraded operation

Do not pretend the entire cloud system can operate normally without connectivity.

Instead implement graceful degradation.

---

## 51. SECURITY

Implement:

* Authentication
* Authorization
* RBAC
* Strong password handling
* JWT/session security
* HTTPS
* Encryption in transit
* Encryption at rest where appropriate
* API validation
* Rate limiting
* Audit logging
* Secure file uploads
* Input validation
* Secrets management
* Security headers
* CORS configuration
* Logging
* Monitoring

Roles must be enforced on the backend, not only in the frontend.

---

## 52. PRIVACY

The system deals with potentially sensitive:

* Location
* Video
* Device information
* Telecom-derived information
* Potential wearable signals

Therefore:

* Minimize personal data
* Prefer aggregation
* Use consent where required
* Avoid unnecessary identity tracking
* Define retention policies
* Restrict access
* Audit access
* Separate operational data from personally identifiable information
* Do not store raw data indefinitely
* Provide appropriate deletion/retention mechanisms

Core principle:

> **Estimate the crowd, not unnecessarily track the person.**

---

## 56. DO NOT BUILD EVERYTHING AT ONCE

Build in phases.

## Phase 1 — Foundation

* Repository
* Architecture
* Authentication
* RBAC
* Database
* Event management
* PWA

## Phase 2 — Event Map

* Map
* Event boundary
* Zones
* Gates
* Routes
* Emergency routes
* GPS route recording
* Temporary infrastructure

## Phase 3 — Data Hub

* Source registry
* Standard observation model
* Synthetic data
* Data ingestion
* Validation
* Source health
* Fusion

## Phase 4 — Real Crowd Data

* CCTV
* Smart Gate
* GPS

## Phase 5 — AI

* Crowd analytics
* Risk model
* Prediction
* Bottleneck detection
* Anomaly detection

## Phase 6 — Decision Support

* Recommendations
* Police deployment
* Gate recommendations
* Route recommendations
* Announcements

## Phase 7 — User Experiences

* Authority
* Police
* Event Owner
* Citizen

## Phase 8 — Simulation

* Digital Twin
* Scenario simulation
* What-if analysis

## Phase 9 — Production Readiness

* Security
* Testing
* Monitoring
* Performance
* Deployment
* Documentation

---

## 57. HACKATHON MVP

Do NOT attempt to connect every real-world source.

Implement strongly:

### Real

* PWA
* Authentication
* Event creation
* Event map
* Zones
* Routes
* Smart Gate simulation
* CCTV/video processing
* Citizen GPS
* Real-time dashboard
* Crowd heatmap
* Risk prediction
* Recommendations
* Role-based interfaces

### Simulated

* Telecom
* Drone
* BLE
* Wearables

The architecture must still support them as real adapters later.

---

## 58. DEMO SCENARIO

The final demo should tell a story.

Create an event.

Configure:

* Event boundary
* 5 zones
* 6 gates
* 8 routes
* 2 emergency routes
* CCTV cameras
* Smart Gates

Start simulation/live data.

Normal:

🟢 Zone A
🟢 Zone B
🟢 Zone C

Then generate:

* Gate G3 high inflow
* Zone B density increasing
* Route R4 becoming congested
* CCTV detecting slowing movement
* GPS showing increasing participating devices

Fusion engine:

→ Crowd state changes.

Risk engine:

→ Zone B risk increases.

Prediction:

> "High risk developing in Zone B within approximately 10 minutes."

Decision engine:

> Restrict G3
> Open G5
> Redirect crowd
> Deploy police
> Broadcast warning

Authority approves.

Crowd state changes.

Risk falls.

Then show:

**Incident prevented / risk mitigated.**

This should be the central hackathon story.

---

