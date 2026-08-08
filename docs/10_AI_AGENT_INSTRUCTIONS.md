# AI Agent Coding Instructions & Developer Conventions (`AGENTIC_RULES`)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** LLM / AI Assistant Customization, Codebase Rules & Pattern Guide  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. Purpose of this Document
This specification is designed specifically for automated **AI Coding Assistants** (e.g., Antigravity, Cursor, GitHub Copilot) and human collaborative developers. 

When generating new features, refactoring components, or writing production tests for **CrowdShield**, any AI system interacting with this codebase **MUST strictly adhere to the rules, patterns, and boundaries outlined below**.

---

## 2. Mandatory Architectural Constraints (Never Violate)

### 2.1 Rule 1: Monorepo Boundary Enforcement
CrowdShield is a strict Next.js and FastAPI monorepo.
* **Frontend UI Code:** Must strictly go into `/apps/web/`. Use Next.js App Router, Tailwind CSS, and `shadcn/ui`. Do not use vanilla CSS or raw HTML canvas for core layouts.
* **Backend API Code:** Must strictly go into `/apps/api/`. Use FastAPI, Pydantic for validation, and SQLAlchemy for PostgreSQL.
* **AI Pipelines:** CV (YOLO/BoT-SORT) and Machine Learning (XGBoost) logic must go into the `/ai/` directory.

### 2.2 Rule 2: Single PWA Principle
* **Do NOT create separate web apps** for Authority, Police, and Citizen. 
* All users log into the **same** Next.js application. 
* Use Role-Based Access Control (RBAC) via JWTs to conditionally render the appropriate Dashboard layout based on the user's role.

### 2.3 Rule 3: WebSocket Real-Time Synchronization
* **Do NOT use HTTP Polling** (e.g., `setInterval` with `fetch()`) for live risk updates or alerts.
* All live telemetry must be pushed from the FastAPI backend to the Next.js frontend via WebSocket connections managed in a centralized React Context.

---

## 3. Standard Operating Procedures for Extending Code

### 3.1 Procedure: Adding a New Venue Configuration
When instructed to add a new physical venue to the system, modify the PostgreSQL Event configuration via the Admin PWA or database seeding scripts.
1. Define the Venue Polygon (Mapbox coordinates).
2. Define the discrete Zones (Zone A, Zone B).
3. Map CCTV Camera RTSP URLs to specific Zones.
4. Define Gates (Entrance, Exit, Emergency) and their spatial coordinates.

### 3.2 Procedure: Adding a New Regional Language (PWA i18n)
When instructed to introduce additional multilingual localization (e.g., Bengali, Telugu), modify the Next.js `i18next` locales:
1. Add the JSON dictionary inside `/apps/web/public/locales/bn/common.json`.
2. Provide exact translations for all critical broadcast keys (`emergencyEvac`, `gateClosed`, `oneWayFlow`).
3. **Calm Phrasing Constraint (Anti-Panic Protocol):** When crafting citizen-facing alerts, **never use vocabulary that incites panic** (e.g., *Do NOT write: "Stampede! Run for your lives!"*). Formulate reassuring, direction-oriented instruction (e.g., *Write: "To assure comfortable walking space, please follow the designated Green Route via Gate 5."*).

---

## 4. Code Style & Documentation Conventions
* **Clickable File & Symbol Links:** Whenever an AI assistant replies to user prompts or generates markdown documentation, it **must always use clickable GitHub-style file schemes** (e.g., `[filename](file:///path/to/file#L10-L20)`).
* **TypeScript & Pydantic Strictness:** Never use `any` in TypeScript. Never omit Pydantic types in FastAPI. Ensure all data structures strongly map to the JSON schemas defined in `08_API_AND_EVENTS_SCHEMA.md`.
* **Defensive Error Handling:** If the WebSocket disconnects, the UI must gracefully display an "Attempting to reconnect..." toast, and the AI Pipeline must fallback to historical ML predictions gracefully if a camera stream drops.
