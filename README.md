# 🛡️ CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes
**TechNova Challenge 2026 — Problem Statement 1 Solution**

![Version](https://img.shields.io/badge/Version-1.0.0--PROD-00F2FE?style=for-the-badge&logo=shield&logoColor=black)
![Stack](https://img.shields.io/badge/Stack-ES6%20Modules_%7C_Vanilla_CSS_%7C_Canvas-10B981?style=for-the-badge&logo=javascript&logoColor=white)
![Languages](https://img.shields.io/badge/Multilingual-English_%7C_Hindi_%7C_Marathi_%7C_Tamil-F59E0B?style=for-the-badge)

**CrowdShield** is an advanced AI-powered early warning public safety platform built to eliminate crowd crushes and stampedes across massive Indian gatherings—such as the Maha Kumbh Mela, stadium sports finals, and regional music festivals. By replacing reactive CCTV video playback with **predictive density forecasting** and **1-click intelligent countermeasures**, CrowdShield alerts authorities and citizens **minutes before** dangerous compression occurs.

---

## 🌟 Core Features & Innovations

1. **AI Predictive Risk Engine:** Continuously analyzes simulated optical flow and wireless MAC probe metrics. Automatically flags critical density thresholds ($d \ge 4.0\text{ p/m}^2$) and movement speed stalls ($< 0.5\text{ m/s}$).
2. **Interactive Digital Twin Simulation:** Rendered using zero-dependency HTML5 Canvas. Features real-time fluid particle physics across three Indian venue presets (*Kumbh Ghat Sector 4*, *Metro Sports Stadium*, and *Open Amphitheatre*) with dynamic heatmaps and velocity vectors.
3. **Intelligent Countermeasure Decisions:** Converts complicated sensor math into simple executive action buttons:
   * 🚪 *Open Emergency Gate 4 & Reroute Flow* (Dynamically modifies running arena simulation!)
   * 👮 *Deploy Rapid Action Force (+40 Units)* to break compression waves.
4. **Citizen Companion Smartphone Emulator:** A side-by-side interactive simulated mobile interface demonstrating:
   * Instantaneous multilingual switching across **English, Hindi (हिंदी), Marathi (मराठी), and Tamil (தமிழ்)**.
   * Offline-resilient push broadcast warnings simulating Bluetooth Low Energy (BLE) peer-to-peer mesh routing.
   * Personalized Green Safe Route navigation maps.
   * Crowdsourced SOS emergency reporter that drops visual alarm beacons directly onto the Command Room map.
5. **Completed Bonus Capabilities 🚀:**
   * 🎙️ **Shield-AI Voice Copilot:** Hands-free Web Speech API vocal querying and audio synthesis response (*"What is the bottleneck status at Gate 2?"*).
   * ✨ **GenAI SITREP Engine:** Automatically synthesizes real-time metrics into professional executive disaster briefings formatted for print/PDF distribution to District Administration.

---

## 🚀 Quick Start & Live Demonstration Guide

Because CrowdShield leverages modular ES6 imports (`<script type="module">`), modern browser security standards require serving the application via local HTTP rather than launching file pathways directly.

### Step 1: Start a Local Web Server
In your terminal inside this project repository folder, run:

```bash
npx -y serve .
```
*(Alternatively, you can use `python -m http.server 8000` or launch via the VS Code / Cursor Live Server extension).*

### Step 2: Open Dashboard in Browser
Navigate to **`http://localhost:3000`** (or your specified localhost port).

---

## 📚 Enterprise Technical Documentation Suite (`docs/`)

Our comprehensive engineering specifications, architectural diagrams, data flows, testing strategies, and AI developer protocols are arranged sequentially inside the [`docs/`](./docs) directory:

| Seq | Document Specification | Target Audience & Contents Summary |
| :---: | :--- | :--- |
| **01** | **[Product Requirements Document (PRD)](./docs/01_PRD.md)** | **Product Strategy:** Problem Background, User Personas (Magistrate, Police Responder, Citizen), Feature Matrix (FR-01 to FR-10), and Success KPIs. |
| **02** | **[Technical Requirements Document (TRD)](./docs/02_TRD.md)** | **Engineering Foundation:** Mathematical physics ($d \ge 4.5\text{ p/m}^2$, momentum dropouts), Canvas 60fps budget limits, Web Speech API, and compact ($256\text{-byte}$) Mesh Alert schemas. |
| **03** | **[High-Level Design Document (HLD)](./docs/03_HLD.md)** | **System Architecture:** Three-ring system topology, comprehensive **Mermaid Component Graph**, and closed-loop mitigation workflows. |
| **04** | **[Low-Level Design Document (LLD)](./docs/04_LLD.md)** | **Code & Algorithms:** Modular Class Diagrams, single-pass $O(N)$ Spatial Grid Heatmap rendering pseudocode, multilingual translation resolver, and System Safety State Machine. |
| **05** | **[Data Flow Diagrams Document (DFD)](./docs/05_DFD.md)** | **Data Architecture:** Level 0 Context Diagram, Level 1 Module Data Pathways, and Level 2 closed-loop Sequence Charts for Scenario Countermeasure Execution and Citizen SOS alerting. |
| **06** | **[UI Specs & Wireframe Mapping](./docs/06_UI_WIRE_FRAMES.md)** | **UX / UI Design:** Cyber-Tactical dark mode psychology (reducing control-room eye fatigue), semantic color designations, master interface ASCII grids, and smartphone emulator tab wireframes. |
| **07** | **[Production Deployment Playbook](./docs/07_DEPLOYMENT_AND_OPS.md)** | **Operations & DevOps:** Hybrid Edge Computing specs, cellular blackout mitigation via **Offline Bluetooth & Wi-Fi Direct Mesh Node Hopping**, and disaster recovery False Alarm SLAs. |
| **08** | **[API & Event Bus Schema](./docs/08_API_AND_EVENTS_SCHEMA.md)** | **Backend Contracts:** Definitive schema payloads (`TelemetryFrame`, `InterventionCommand`, `SosIncidentReport`), Edge WebSocket streams, and BLE advertisement UDP parsing. |
| **09** | **[Testing, QA & Chaos Strategy](./docs/09_TESTING_AND_QA_STRATEGY.md)** | **Quality & Resilience:** Unit math validation, defensive Edge Case matrix ($N=0$, audio block, spam protection), and Chaos Playbooks (Cellular Blackout & SOS flooding). |
| **10** | **[AI Agent Coding Instructions](./docs/10_AI_AGENT_INSTRUCTIONS.md)** | **AI Developer Rules:** Zero-Build boundary enforcement, loop decoupling rules, explicit operating procedures for extending venues/languages, and calm messaging anti-panic protocols. |
| **00** | **[Documentation Portal Index](./docs/README.md)** | **Executive Index:** Central table of contents within the `docs/` folder. |

---

## 📂 Repository Architecture

```
crowdcatchup/
├── index.html                   # Master interface viewport structure
├── README.md                    # Project overview & quick start (This File)
├── docs/                        # Enterprise technical documentation suite (01_PRD to 10_AI_AGENT)
├── styles/
│   ├── main.css                 # Dark-mode cyber-tactical design system & variables
│   ├── dashboard.css            # Command telemetry dials & interactive advisory queues
│   └── mobile-emulator.css      # Embedded citizen companion smartphone hardware frame
└── src/
    ├── main.js                  # Platform orchestrator & event bus bootstrap
    ├── data/
    │   └── translations.js      # Multilingual dictionaries (EN, HI, MR, TA)
    ├── simulation/
    │   ├── venuePresets.js      # Map topologies (Kumbh Mela, Cricket Stadium, Amphitheatre)
    │   └── digitalTwinEngine.js   # Canvas fluid physics & dynamic spatial heatmap renderer
    ├── ai/
    │   ├── riskPredictionEngine.js # Density threshold evaluation & UI gauge synchronizer
    │   └── recommendationSystem.js # Rule-based actionable countermeasure synthesis engine
    └── modules/
        ├── voiceAssistant.js    # Web Speech API conversational copilot ("Shield-AI")
        ├── genAiSummary.js      # Generative AI emergency SITREP briefing creator
        └── mobileAppController.js # Citizen app tab routing, alerts, navigation & SOS reports
```

---

*Designed and engineered for maximum public safety and zero hardware dependency during the TechNova Challenge 2026.*
