# Product Requirements Document (PRD)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Target Event / Challenge:** TechNova Challenge 2026 - Problem Statement 1  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  
**Status:** Approved / Completed  

---

## 1. Executive Summary
India hosts some of the world's largest public gatherings (e.g., Maha Kumbh Mela, regional religious festivities, music concerts, and sports stadium championships). While these events celebrate unity, extreme crowd density within confined geographies presents severe public safety challenges. Traditional crowd control relies on reactive manual supervision and CCTV monitoring—where intervention only happens *after* abnormal crowd distress is noticed.

**CrowdShield** transforms crowd management from reactive observation into **predictive public safety**. Instead of building disjointed apps for different stakeholders, CrowdShield provides a **unified Progressive Web App (PWA)** centered around an AI-driven Map Engine. By fusing live CCTV, dataset ingestions, and simulation inputs through a centralized AI pipeline, CrowdShield forecasts congestion bottlenecks and crush risks **10 to 15 minutes before they escalate into emergencies**.

---

## 2. Problem Statement & Background
* **Historical Crisis:** According to national disaster records, India documented over 120 stampede-related deaths in 2024 and more than 110 in 2025.
* **The Root Cause:** In a densely packed crowd ($d \ge 4.5\text{ persons/m}^2$), individual physical agency is lost. Even a minor incident (e.g., sudden rain canopy collapse, a fallen barrier, or celebrity stage surge) causes severe compression waves and panic propagation.
* **The Opportunity:** A software-first, role-based platform that processes standard video/sensor data to predict crush likelihood, generate 1-click countermeasures for authorities, guide on-ground police, and broadcast localized safe routes to citizens.

---

## 3. Target Audiences & User Personas

CrowdShield utilizes a **Role-Based Access Control (RBAC)** architecture. All users log into the same platform but experience vastly different interfaces tailored to their operational needs.

### Persona A: 👮 Authority / Command Center (Executive Control)
* **Goal:** Oversee entire venue safety, approve AI recommendations, and deploy resources.
* **Interface View:** Full map visibility, comprehensive AI risk metrics, predicted 5/10/15-minute trends, and the ability to click "Approve" on AI intervention plans.
* **Key Question:** "What is happening right now, and what should I do?"

### Persona B: 🛡️ Security / Police Staff (Operational Responder)
* **Goal:** Execute immediate physical interventions (open/close gates, erect barrier dividers).
* **Interface View:** Mobile-optimized task lists and turn-by-turn navigation directing them to critical zones. They do not see the massive command center data to avoid distraction.
* **Key Question:** "Where do I need to go, and what is my task?"

### Persona C: 👤 Citizen / Festival Attendee (Public Consumer)
* **Goal:** Navigate safely through massive gatherings without getting stuck in dangerous crushing swells.
* **Interface View:** Simplified mobile PWA. Shows their current location, green safe routes, and localized alerts. **Crucially**, it hides panic-inducing metrics like "Risk 87%".
* **Key Question:** "Where should I go, and what should I avoid?"

### Persona D: 🧑‍💼 Event Organizer / Admin
* **Goal:** Configure the venue topology prior to the event.
* **Interface View:** Venue configuration tools to draw Zones, Gates, Exits, and assign CCTV camera locations.
* **Key Question:** "How do I configure this event for the AI Engine?"

---

## 4. Functional Requirements & Feature Specification

| ID | Module / Area | Feature Name | Requirement Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Data Hub** | Multi-Source Ingestion | System shall accept live RTSP CCTV, uploaded MP4 datasets, and simulated inputs into a standardized JSON format. | **P0 (Core)** |
| **FR-02** | **AI Pipeline** | Density & Velocity Tracking | CV pipeline (YOLO/BoT-SORT) shall extract people count, density ($people/m^2$), and speed ($m/s$). | **P0 (Core)** |
| **FR-03** | **Risk Prediction** | Crush Likelihood Forecasting | XGBoost model shall evaluate time-series metrics to generate future risk scores (5/10/15 min windows). | **P0 (Core)** |
| **FR-04** | **Recommendations** | Automated AI Countermeasures | Decision engine shall propose actionable interventions (e.g., OPEN_GATE G4) based on risk thresholds. | **P0 (Core)** |
| **FR-05** | **PWA Platform** | Role-Based Access Control | A single Next.js frontend shall dynamically render Authority, Police, Citizen, and Admin dashboards based on JWT roles. | **P0 (Core)** |
| **FR-06** | **PWA Map UI** | Centralized Venue Rendering | System shall render an interactive map (Mapbox/Leaflet) updated in real-time via WebSockets. | **P0 (Core)** |
| **FR-07** | **Citizen App** | Green Safe Route Guidance | Mobile PWA shall display visual map pathing directing citizens to non-congested exits. | **P1 (High)** |
| **FR-08** | **Citizen App** | Crowdsourced SOS Reporting | Citizens shall submit geo-tagged incident reports directly onto the main Command Map. | **P1 (High)** |
| **FR-09** | **Bonus Feature** | GenAI Summaries & Alerts | LLM shall translate raw metrics into readable situation reports and multilingual citizen broadcast text. | **P2 (Bonus)** |
| **FR-10** | **Resilience** | Offline PWA Capabilities | System shall utilize Service Workers and IndexedDB to cache venue maps during cellular network failure. | **P2 (Bonus)** |

---

## 5. Non-Functional Requirements & Constraints
* **NFR-01: Single Platform Architecture:** Must be built as a singular monorepo (Next.js + FastAPI) to prevent fragmented mobile/web codebases.
* **NFR-02: Network Resilience:** The PWA must cache critical routes and maps to function in degraded cellular environments typical of massive crowds.
* **NFR-03: Real-Time Synchronization:** The map and risk metrics must update across all user interfaces instantly via WebSockets (not polling).
* **NFR-04: False Alarm Mitigation:** The Recommendation engine must require Human-in-the-Loop approval by the Authority before actions propagate to Police and Citizens.
* **NFR-05: Data Privacy:** Crowd counting and flow tracking shall utilize anonymized positional aggregation without storing personal identity or facial biometric data. Raw video should not be stored permanently.

---

## 6. Key Performance Indicators (KPIs) & Success Vision
* **Early Warning Horizon:** Alert generated $\ge 10\text{ minutes}$ prior to crowd density exceeding lethal compression thresholds ($5.0\text{ people/m}^2$).
* **Mitigation Latency:** Complete cycle of `AI Recommend -> Authority Approve -> Police Deploy -> Risk Drops` verified within 180 seconds.
* **Cross-Role Clarity:** Each persona interacts exclusively with the data they need, measured by zero visual clutter on the Citizen app.
