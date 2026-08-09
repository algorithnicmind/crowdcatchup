# CrowdShield AI - Enterprise Architecture & Production Documentation Suite

Welcome to the central engineering documentation directory for **CrowdShield**. Documents are sequentially arranged from the authoritative master specification down to implementation details.

---

## Recommended Reading Sequence & Index

| Seq | Document | Target Audience | Key Highlights |
| :---: | :--- | :--- | :--- |
| **00** | **[Master System Specification](./00_MASTER_SPEC.md)** | Everyone | **Authoritative 63-section spec.** Project purpose, scope, all features, architecture, build phases, demo scenario. Read this first. |
| **01** | **[Product Requirements Document (PRD)](./01_PRD.md)** | Product Evaluators | Problem statement, 4 personas, event lifecycle, functional requirements, build phases, demo scenario. |
| **02** | **[Technical Requirements Document (TRD)](./02_TRD.md)** | System Architects | Tech stack, data sources, Fusion Hub, observation format, crowd state, sensor fusion, backend modules. |
| **03** | **[High-Level Design Document (HLD)](./03_HLD.md)** | Solution Designers | Architecture diagram, 25+ modules, data pipeline, event-first model, source adapter pattern. |
| **04** | **[Low-Level Design Document (LLD)](./04_LLD.md)** | Algorithm Specialists | Smart Gate system, GPS route recording, temporary infrastructure, Gate-Zone-Route, XGBoost features, fusion math. |
| **05** | **[Data Flow Diagrams Document (DFD)](./05_DFD.md)** | Data Architects | Multi-source data flow, Level 0/1/2 diagrams, fusion pipeline, Standard Observation Format. |
| **06** | **[UI Specs & Wireframe Mapping](./06_UI_WIRE_FRAMES.md)** | UX/UI Designers | Map-centric design, 4 role dashboards, Event Owner venue builder, Smart Gate status UI, Source Health panel. |
| **07** | **[Production Deployment Playbook](./07_DEPLOYMENT_AND_OPS.md)** | DevOps | AWS infrastructure, multi-source resilience, graceful degradation, offline PWA, event isolation. |
| **08** | **[API & Event Bus Schema](./08_API_AND_EVENTS_SCHEMA.md)** | Integration Engineers | Standard Observation, Crowd State, Source Health, WebSocket events, Smart Gate config, Event config. |
| **09** | **[Testing, QA & Chaos Strategy](./09_TESTING_AND_QA_STRATEGY.md)** | QA Engineers | Pytest, Playwright, ML eval, multi-source testing, fusion accuracy, chaos playbooks. |
| **10** | **[AI Agent Coding Instructions](./10_AI_AGENT_INSTRUCTIONS.md)** | AI Assistants, Devs | Monorepo boundaries, event-first rules, adapter pattern, anti-panic protocol, build phase awareness. |

---

## Folder Anatomy

```
docs/
├── 00_MASTER_SPEC.md             # Authoritative 63-section system specification
├── 01_PRD.md                     # Product Strategy, Personas & Requirements
├── 02_TRD.md                     # Tech Stack, Data Sources, Fusion Hub
├── 03_HLD.md                     # Architecture: 25+ Modules & Data Pipelines
├── 04_LLD.md                     # Smart Gates, GPS Routes, Fusion Math
├── 05_DFD.md                     # Multi-Source Data Flow Diagrams
├── 06_UI_WIRE_FRAMES.md          # Map UI, Role Dashboards, Venue Builder
├── 07_DEPLOYMENT_AND_OPS.md      # Cloud Hosting, Resilience, Offline PWA
├── 08_API_AND_EVENTS_SCHEMA.md   # JSON Contracts & WebSocket Definitions
├── 09_TESTING_AND_QA_STRATEGY.md # Pytest, Playwright, Chaos Engineering
├── 10_AI_AGENT_INSTRUCTIONS.md   # Monorepo AI Developer Guidelines
└── README.md                     # This file (Documentation Guide & Index)
```
