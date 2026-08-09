# High-Level Design Document (HLD)
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. System Architectural Overview

CrowdShield is architected as an interconnected, event-driven reactive platform. It centralizes multi-source data ingestion through a **Crowd Data Fusion Hub**, scales AI processing on the backend, and distributes actionable intelligence to four distinct user roles via a unified Progressive Web App (PWA).

The core principle:

> **Configure the event first. Sense the crowd from multiple sources. Fuse the observations. Understand the crowd state. Predict risk. Recommend preventive action. Let authorized humans act. Measure the result.**

### 1.1 Three-Layer Architecture
1. **The Ingestion & AI Layer:** Processes CCTV, Smart Gates, GPS, Drone, BLE, Telecom, and Synthetic data through the Data Fusion Hub and AI pipeline.
2. **The API & Services Layer (FastAPI):** Manages routing, RBAC, WebSockets, and database persistence.
3. **The Presentation Layer (Next.js PWA):** Renders the central interactive map and role-specific dashboards.

---

## 2. Component Architecture Diagram

```text
                    CROWDShield PWA
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    AUTHORITY           POLICE         EVENT OWNER
        │                                   │
        │                                EVENT SETUP
        │                                   │
        │                            ┌──────┴──────┐
        │                            ↓             ↓
        │                         MAP BUILDER   CONFIGURATION
        │                            │             │
        │                            └──────┬──────┘
        │                                   ↓
        │                           EVENT DIGITAL TWIN
        │                                   │
        └───────────────────────────────────┤
                                            ↓
                                  DATA SOURCE REGISTRY
                                            │
          ┌──────────┬──────────┬──────────┼──────────┬──────────┐
          ↓          ↓          ↓          ↓          ↓          ↓
        CCTV     SMART GATE    GPS       DRONE       BLE     TELECOM
          │          │          │          │          │          │
          └──────────┴──────────┴──────────┴──────────┴──────────┘
                                            │
                                    DATA FUSION HUB
                                            │
                           ┌────────────────┼────────────────┐
                           ↓                ↓                ↓
                      NORMALIZE         VALIDATE        SOURCE HEALTH
                           └────────────────┼────────────────┘
                                            ↓
                                      SENSOR FUSION
                                            ↓
                                       CROWD STATE
                                            ↓
                                    AI RISK ENGINE
                                            ↓
                                  PREDICTION ENGINE
                                            ↓
                                    DECISION ENGINE
                                            ↓
                                   RECOMMENDATIONS
                                            ↓
                               AUTHORITY / POLICE ACTION
                                            ↓
                                      CROWD RESPONSE
                                            ↓
                                      FEEDBACK LOOP
```

---

## 3. The 25+ Backend Modules

| Module | Core Responsibility |
| :--- | :--- |
| **auth** | Authentication, JWT, session management |
| **users** | User profiles, role assignment |
| **organizations** | Multi-tenant organization management |
| **events** | Event lifecycle (8 statuses), event CRUD |
| **venues** | Venue geometry, boundaries |
| **zones** | Zone builder, capacity, thresholds |
| **gates** | Gate configuration, Gate-Zone-Route relationships |
| **routes** | Custom routes (one-way, emergency, police, temporary) |
| **sensors** | Sensor/camera registration, source registry |
| **data_ingestion** | Multi-source adapter framework |
| **data_normalization** | Standard Observation Format conversion |
| **data_validation** | Schema + range validation |
| **source_health** | ONLINE/DELAYED/OFFLINE monitoring per source |
| **sensor_fusion** | Confidence-weighted fusion, disagreement detection |
| **crowd_state** | Unified per-zone crowd state generation |
| **analytics** | Density, speed, flow, queue, occupancy calculations |
| **risk_engine** | XGBoost risk prediction (5/10/15 min horizons) |
| **recommendations** | Decision engine, intervention proposals with explanations |
| **incidents** | Incident creation, tracking, resolution |
| **alerts** | Alert generation and distribution |
| **notifications** | Push notifications, multilingual broadcasts |
| **police** | Task assignment, deployment tracking |
| **simulation** | Pre-event scenario simulation, Digital Twin |
| **digital_twin** | Event digital representation |
| **reports** | Post-event analytics, historical reports |
| **audit** | Audit logging, security trail |

---

## 4. End-to-End Operational Workflow (The Core Loop)

1. **CONFIGURE:** Event Owner creates event, defines venue, zones, gates, routes, cameras, Smart Gates.
2. **SENSE:** CCTV, Smart Gates, GPS, and other sources continuously send observations.
3. **NORMALIZE:** All sources converted to Standard Observation Format.
4. **FUSE:** Fusion Hub combines overlapping observations, calculates confidence-weighted crowd state.
5. **UNDERSTAND:** Analytics Engine calculates density, speed, flow conflicts per zone.
6. **PREDICT:** Risk Engine forecasts crush likelihood in 5/10/15-minute windows.
7. **RECOMMEND:** Decision Engine proposes concrete interventions with explanations.
8. **APPROVE:** Authority reviews and clicks APPROVE on intervention plan.
9. **ACT:** Police receive tasks. Citizens receive safe-route alerts.
10. **VERIFY:** System continues processing. Risk downgrades when conditions improve.

---

## 5. Event-First Data Model

Every data point belongs to an event. The hierarchy is:

```
EVENT → VENUE → ZONE/GATE/ROUTE → SOURCE → OBSERVATION
```

This is a fundamental data-integrity rule. Never mix Event A with Event B.

---

## 6. Source Adapter Pattern

Each data source connects through a standardized adapter:

```text
REAL SOURCE → ADAPTER → STANDARD OBSERVATION FORMAT → FUSION HUB
SIMULATED SOURCE → ADAPTER → STANDARD OBSERVATION FORMAT → FUSION HUB
```

Real and simulated sources must produce identical output formats. Never pretend a simulator is a real connection.

---

## 7. Source Health & Confidence

| Source Health | Confidence Impact |
| :--- | :--- |
| ONLINE | Full confidence weight |
| DELAYED | Reduced confidence weight |
| OFFLINE | Minimal confidence weight, fallback to other sources |

Confidence considers: accuracy, freshness, latency, historical reliability, coverage, sensor health, data completeness.

---

## 8. Hackathon MVP Scope

### Real Implementation
* PWA, Authentication, Event creation, Event map, Zones, Routes
* Smart Gate simulation, CCTV/video processing, Citizen GPS
* Real-time dashboard, Crowd heatmap, Risk prediction, Recommendations
* Role-based interfaces (Authority, Police, Event Owner, Citizen)

### Simulated (architecture ready for real later)
* Telecom, Drone, BLE, Wearables

### Demo Story
Normal state -> Gate G3 high inflow -> Zone B density rising -> Fusion detects change -> Risk CRITICAL -> AI recommends intervention -> Authority approves -> Risk falls -> Incident prevented.
