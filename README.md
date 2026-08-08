# 🛡️ CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes
**TechNova Challenge 2026 — Problem Statement 1 Solution**

![Version](https://img.shields.io/badge/Version-2.0.0--PROD-00F2FE?style=for-the-badge&logo=shield&logoColor=black)
![Stack](https://img.shields.io/badge/Stack-Next.js_%7C_FastAPI_%7C_PostgreSQL-10B981?style=for-the-badge&logo=react&logoColor=white)
![AI](https://img.shields.io/badge/AI-OpenCV_%7C_YOLO_%7C_XGBoost-F59E0B?style=for-the-badge)

**CrowdShield** is an advanced AI-powered early warning public safety platform built to eliminate crowd crushes and stampedes across massive Indian gatherings—such as the Maha Kumbh Mela, stadium sports finals, and regional music festivals. 

Instead of four disjointed apps, CrowdShield is **one unified Progressive Web App (PWA)** powered by a central **AI Data Hub**. It ingests live CCTV, datasets, and simulations to predict congestion risks and push role-based, real-time alerts to Authorities, Police, Citizens, and Event Owners.

---

## 🌟 Core Features & Innovations

1. **AI Predictive Risk Engine:** Processes computer vision metrics (density, speed, flow conflict) and uses XGBoost to predict congestion risks in 5, 10, and 15-minute future windows.
2. **Unified PWA with Role-Based Access Control (RBAC):** A single application that provides four unique experiences based on user login:
   * 👮 **Authority (Command Center):** Full map overview, AI predictions, and intervention approval.
   * 🛡️ **Police/Security:** Mobile task navigation directly to critical risk zones.
   * 👤 **Citizen:** Public safety view, safe routes, and multilingual alerts (no panic-inducing metrics).
   * 🧑‍💼 **Event Owner:** Venue setup, gate configuration, and analytics.
3. **Universal Map Engine:** A dynamic central map (Mapbox/Leaflet) that serves as the core UI, overlaying density heatmaps, active incidents, and safe routes in real-time via WebSockets.
4. **Data Hub & Feedback Loop:** Accepts inputs from live RTSP feeds, MP4 uploads, or Digital Twin simulations, feeding them into a standard data pipeline: `Collect → Analyze → Predict → Recommend → Act → Verify`.
5. **Offline & Edge Resilience:** The Next.js PWA uses Service Workers and IndexedDB to cache venue maps and critical emergency instructions, ensuring operation during cellular network saturation.
6. **GenAI Integration:** Synthesizes complex AI metrics into readable incident summaries and multilingual public announcements.

---

## 🚀 Quick Start & Live Demonstration Guide

CrowdShield is a modern monorepo consisting of a Next.js frontend and a FastAPI backend.

### Step 1: Start the FastAPI Backend
Navigate to the API directory, install dependencies, and start the server:
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Step 2: Start the Next.js PWA
In a new terminal window, navigate to the Web directory:
```bash
cd apps/web
npm install
npm run dev
```

### Step 3: Open the Platform
Navigate to **`http://localhost:3000`** in your browser. Log in with different test accounts to experience the Authority, Police, and Citizen dashboards.

---

## 📚 Enterprise Technical Documentation Suite (`docs/`)

Our comprehensive engineering specifications, architectural diagrams, data flows, and AI developer protocols are arranged sequentially inside the [`docs/`](./docs) directory:

| Seq | Document Specification | Target Audience & Contents Summary |
| :---: | :--- | :--- |
| **01** | **[Product Requirements Document (PRD)](./docs/01_PRD.md)** | Product Strategy, User Personas (Authority, Police, Citizen, Admin), and Success KPIs. |
| **02** | **[Technical Requirements Document (TRD)](./docs/02_TRD.md)** | Engineering Stack (Next.js, FastAPI, PostgreSQL) and core AI prediction thresholds. |
| **03** | **[High-Level Design Document (HLD)](./docs/03_HLD.md)** | The 10 Major Modules, System Topology, and real-time WebSocket architecture. |
| **04** | **[Low-Level Design Document (LLD)](./docs/04_LLD.md)** | Computer Vision pipelines, ML prediction features, and RBAC mechanisms. |
| **05** | **[Data Flow Diagrams Document (DFD)](./docs/05_DFD.md)** | Level 0/1/2 diagrams for data ingestion, AI processing, and recommendation feedback loops. |
| **06** | **[UI Specs & Wireframe Mapping](./docs/06_UI_WIRE_FRAMES.md)** | Central map UI, role-based dashboard wireframes, and responsive PWA layouts. |
| **07** | **[Production Deployment Playbook](./docs/07_DEPLOYMENT_AND_OPS.md)** | AWS deployment, caching, and offline PWA service worker strategies. |
| **08** | **[API & Event Bus Schema](./docs/08_API_AND_EVENTS_SCHEMA.md)** | JSON schemas for standardizing CCTV, Simulation, and Dataset inputs. |
| **09** | **[Testing, QA & Chaos Strategy](./docs/09_TESTING_AND_QA_STRATEGY.md)** | Playwright (Frontend), Pytest (Backend), Locust (Load), and ML evaluation metrics. |
| **10** | **[AI Agent Coding Instructions](./docs/10_AI_AGENT_INSTRUCTIONS.md)** | Monorepo conventions, boundaries, and LLM automation rules. |
| **00** | **[Documentation Portal Index](./docs/README.md)** | Central table of contents within the `docs/` folder. |

---

## 📂 Repository Architecture (Monorepo)

```
crowdshield/
├── apps/
│   ├── web/                 # Next.js PWA (Frontend UI & Role Routing)
│   └── api/                 # FastAPI (Backend, WebSockets, DB interaction)
├── ai/
│   ├── detection/           # OpenCV/YOLO vision pipeline
│   ├── tracking/            # BoT-SORT and optical flow
│   ├── analytics/           # Density, speed, and flow math
│   ├── prediction/          # XGBoost risk modeling
│   └── recommendation/      # Decision engine for actions
├── simulation/
│   └── digital-twin/        # Scenario generation for testing
├── packages/
│   ├── types/               # Shared TypeScript definitions
│   └── config/              # Shared lint/build configs
├── data/
│   ├── raw/                 # Input video/datasets
│   └── processed/           # Feature stores
├── docs/                    # Technical documentation (01_PRD to 10_AI_AGENT)
├── README.md                # Project overview (This File)
└── package.json             # Root workspace definitions
```

---

*Designed and engineered for maximum public safety during the TechNova Challenge 2026.*
