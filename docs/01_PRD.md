# Product Requirements Document (PRD)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Target Event / Challenge:** TechNova Challenge 2026 - Problem Statement 1  
**Document Version:** 1.0 (Production Release)  
**Status:** Approved / Completed  

---

## 1. Executive Summary
India hosts some of the world's largest public gatherings (e.g., Maha Kumbh Mela, regional religious festivities, music concerts, and sports stadium championships). While these events celebrate unity, extreme crowd density within confined geographies presents severe public safety challenges. Traditional crowd control relies on reactive manual supervision and CCTV monitoring—where intervention only happens *after* abnormal crowd distress is noticed.

**CrowdShield** transforms crowd management from reactive observation into **predictive public safety**. By fusing low-cost sensor data, real-time AI optical flow approximation, and interactive Digital Twin simulation, CrowdShield forecasts congestion bottlenecks and crush risks **10 to 15 minutes before they escalate into emergencies**.

---

## 2. Problem Statement & Background
* **Historical Crisis:** According to national disaster records, India documented over 120 stampede-related deaths in 2024 and more than 110 in 2025.
* **The Root Cause:** In a densely packed crowd ($d \ge 4.5\text{ persons/m}^2$), individual physical agency is lost. Even a minor incident (e.g., sudden rain canopy collapse, a fallen barrier, or celebrity stage surge) causes severe compression waves and panic propagation.
* **The Opportunity:** A software-first, low-cost platform that functions independently of expensive proprietary IoT infrastructure to monitor density, predict crush likelihood, generate 1-click countermeasures for authorities, and broadcast localized citizen advisories over mesh networks.

---

## 3. Target Audiences & User Personas

### Persona A: District Magistrate / Police Commissioner (Executive Control)
* **Goal:** Oversee entire venue safety, deploy Rapid Action Forces, and prevent casualty events.
* **Pain Point:** Overloaded by complex multi-screen CCTV feeds during an evolving crisis with zero actionable statistical forecasting.
* **CrowdShield Solution:** 1-Click Intelligent Recommendations Engine, visual stampede probability dials, and automated GenAI Situation Reports (SITREPs).

### Persona B: On-the-Ground Police Cordon Commander (Operational Responder)
* **Goal:** Execute immediate physical interventions (open/close gates, erect barrier dividers).
* **Pain Point:** Delayed communication and lack of visibility on which specific gate is creating an upstream bottleneck.
* **CrowdShield Solution:** Real-time interactive Digital Twin heatmap marking precise blockage zones and emergency exit paths.

### Persona C: Pilgrim / Festival Attendee (Citizen Consumer)
* **Goal:** Navigate safely through massive gatherings without getting stuck in dangerous crushing swells.
* **Pain Point:** Mobile network collapse during high-density convergence; inability to comprehend announcements in unfamiliar regional languages.
* **CrowdShield Solution:** Companion Mobile App with offline/mesh network resistance, real-time translated push alerts in **English, Hindi, Marathi, and Tamil**, and color-coded Green Safe Route guidance.

---

## 4. Functional Requirements & Feature Specification

| ID | Module / Area | Feature Name | Requirement Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Crowd Monitoring** | Density & Velocity Tracking | System shall continuously calculate average movement speed ($m/s$) and localized crowd density ($people/m^2$). | **P0 (Core)** |
| **FR-02** | **Risk Prediction** | Crush Likelihood Forecasting | System shall evaluate real-time metrics to generate a percentage-based Stampede Likelihood Gauge (0-100%) and estimated Time-to-Crush countdown timer. | **P0 (Core)** |
| **FR-03** | **Risk Prediction** | Anomaly & Bottleneck Detection | System shall identify physical barrier blockages, counter-flow reverse waves, and panic propagation velocity. | **P0 (Core)** |
| **FR-04** | **Recommendations** | Automated AI Countermeasures | System shall propose actionable interventions (e.g., open Gate 4, deploy +40 security units) that dynamically modify active simulation states upon approval. | **P0 (Core)** |
| **FR-05** | **Dashboard** | Digital Twin Arena Canvas | System shall render an interactive 2D spatial simulation of venues with toggles for heatmaps, flow vectors, and security outposts. | **P0 (Core)** |
| **FR-06** | **Citizen App** | Multilingual Push Broadcasts | System shall transmit urgent advisories to citizen mobile devices across English, Hindi (हिंदी), Marathi (मराठी), and Tamil (தமிழ்). | **P0 (Core)** |
| **FR-07** | **Citizen App** | Green Safe Route Guidance | Mobile interface shall display visual map pathing directing citizens to non-congested exits. | **P1 (High)** |
| **FR-08** | **Citizen App** | Crowdsourced SOS Reporting | Citizens shall be able to submit geo-tagged incident reports (overcrowding, medical emergency) directly onto the main Command Map. | **P1 (High)** |
| **FR-09** | **Bonus Feature** | GenAI Incident SITREPs | System shall generate structured executive incident logs and mitigation records for administrative distribution. | **P2 (Bonus)** |
| **FR-10** | **Bonus Feature** | Voice Copilot ("Shield-AI") | System shall integrate Web Speech API recognition and synthesis for hands-free voice command inquiries. | **P2 (Bonus)** |

---

## 5. Non-Functional Requirements & Constraints
* **NFR-01: Hardware Independence (Low Cost):** System must function without mandatory specialized sensor installations, relying on software simulation, CCTV optical flow approximations, and wireless probe counts.
* **NFR-02: Network Resilience:** Mobile notifications must be compatible with low-bandwidth offline Bluetooth/Wi-Fi mesh networking topologies during cellular tower failure.
* **NFR-03: Real-Time Performance:** Frontend UI telemetry frame calculation must execute at $\le 400\text{ms}$ intervals without visual rendering jitter or frame dropping.
* **NFR-04: False Alarm Mitigation:** Alerts must escalate gradually through designated safety states (`SAFE` $\rightarrow$ `WARNING` $\rightarrow$ `CRITICAL HAZARD`) to prevent warning-induced panic.
* **NFR-05: Data Privacy:** Crowd counting and flow tracking shall utilize anonymized positional aggregation without storing personal identity or facial biometric data.

---

## 6. Key Performance Indicators (KPIs) & Success Vision
* **Early Warning Horizon:** Alert generated $\ge 10\text{ minutes}$ prior to crowd density exceeding lethal compression thresholds ($5.0\text{ people/m}^2$).
* **Mitigation Latency:** Reduction of localized peak congestion back to safe parameters within $180\text{ seconds}$ of executing an AI recommended intervention.
* **Multilingual Accessibility:** 100% alert coverage across target Indian regional languages (Hindi, Marathi, Tamil, English) within zero additional operational clicks.
