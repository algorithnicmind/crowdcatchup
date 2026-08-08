# CrowdShield AI - Enterprise Architecture & Production Documentation Suite

Welcome to the central engineering documentation directory for **CrowdShield**. To facilitate a logical reading experience for evaluators, architecture review boards, human developers, and AI coding agents, our documents are sequentially arranged from high-level product strategy down to algorithmic implementations, data schemas, testing strategies, and AI automation protocols.

---

## 📖 Recommended Reading Sequence & Index

| Sequence | Document Name & Link | Target Audience | Key Highlights & Core Subject |
| :---: | :--- | :--- | :--- |
| **01** | **[Product Requirements Document (PRD)](./01_PRD.md)** | Product Evaluators, Admins | Problem Statement, Four Personas (Authority, Police, Citizen, Event Owner), Core Loop. |
| **02** | **[Technical Requirements Document (TRD)](./02_TRD.md)** | System Architects, Leads | Tech Stack (Next.js, FastAPI, PostgreSQL), PWA Offline capabilities, AI thresholds. |
| **03** | **[High-Level Design Document (HLD)](./03_HLD.md)** | Solution Designers | The 10 Major Modules, Unified PWA architecture, WebSocket integration, AI Data Hub. |
| **04** | **[Low-Level Design Document (LLD)](./04_LLD.md)** | Algorithm Specialists | YOLO/BoT-SORT pipeline, XGBoost time-series prediction, RBAC mechanisms. |
| **05** | **[Data Flow Diagrams Document (DFD)](./05_DFD.md)** | Data Architects | Universal data ingestion schema, feedback loop `Collect -> Recommend -> Verify`. |
| **06** | **[UI Specs & Wireframe Mapping](./06_UI_WIRE_FRAMES.md)** | UX/UI Designers | Map-Centric design, Authority Command Center, Police Mobile, Citizen Alert UI. |
| **07** | **[Production Deployment Playbook](./07_DEPLOYMENT_AND_OPS.md)** | DevOps | AWS infrastructure, API Gateways, Service Worker caching for network outages. |
| **08** | **[API & Event Bus Schema](./08_API_AND_EVENTS_SCHEMA.md)** | Integration Engineers | Standardized JSON structures for events, zones, risk updates, and interventions. |
| **09** | **[Testing, QA & Chaos Engineering Strategy](./09_TESTING_AND_QA_STRATEGY.md)** | QA Engineers | Playwright e2e, Pytest backend, Locust load testing, and ML performance metrics. |
| **10** | **[AI Agent Coding Instructions](./10_AI_AGENT_INSTRUCTIONS.md)** | AI Assistants, Devs | Monorepo boundaries (apps/web vs ai/), component reusability, safe GenAI practices. |

---

## 🏗️ Folder Anatomy

```
docs/
├── 01_PRD.md                   # Product Strategy, Four Roles & Core Requirements
├── 02_TRD.md                   # Engineering Stack, DB, Offline PWA
├── 03_HLD.md                   # Architecture: 10 Modules & Data Pipelines
├── 04_LLD.md                   # Computer Vision & Machine Learning Internals
├── 05_DFD.md                   # Data Flow (Ingestion to Recommendation)
├── 06_UI_WIRE_FRAMES.md        # Central Map UI & Role-Based Views
├── 07_DEPLOYMENT_AND_OPS.md    # Cloud Hosting & PWA Cache Strategies
├── 08_API_AND_EVENTS_SCHEMA.md # JSON Contracts & WebSocket Definitions
├── 09_TESTING_AND_QA_STRATEGY.md # Pytest, Playwright, and ML Metrics
├── 10_AI_AGENT_INSTRUCTIONS.md # Monorepo AI Developer Guidelines
└── README.md                   # Documentation Guide & Index (This File)
```
