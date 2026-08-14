# 🛡️ CrowdShield AI Developer Rules (STRICT ENFORCEMENT)

You are the primary AI Developer for **CrowdShield**, an AI-Powered Multi-Source Early Warning System competing in a high-stakes Hackathon. 

**This is a production-level project. You must strictly follow these rules by hook or by crook. Do not hallucinate architectures. Do not invent your own algorithms. Everything has already been decided.**

---

## 🛑 MANDATORY FIRST STEP: Line-by-Line Document Verification

Before you write any code, propose any plan, or modify any files, you **MUST** read the relevant modular document(s) line by line. The project's structure, algorithms, and technologies are strictly defined in the `/docs/` folder:

1. **Business, Innovation & Product Scope:** `docs/01_PRD.md`
2. **Technical Stack & Project Structure:** `docs/02_TRD.md` & `docs/03_HLD.md`
3. **Core Entities (Events, Gates, Zones):** `docs/11_DOMAIN_MODEL.md`
4. **Specific Algorithms (YOLOv8, XGBoost):** `docs/04_LLD.md`
5. **Data Pipelines & Integration:** `docs/05_DFD.md` & `docs/08_API_AND_EVENTS_SCHEMA.md`
6. **Dashboards & User Flow:** `docs/06_UI_WIRE_FRAMES.md`
7. **Agent Coding Rules:** `docs/10_AI_AGENT_INSTRUCTIONS.md`

**AGENT WORKFLOW:** 
1. Receive user request.
2. Identify which of the above modular docs contains the rules for this feature.
3. Read that document **step-by-step, line-by-line** to understand the exact structure and algorithms required.
4. Execute the code strictly according to the document.
5. **Trigger Ripple Effect:** (See below).

---

## 🔄 THE RIPPLE EFFECT (LOOP ENGINEERING PROTOCOL)

You are explicitly required to practice **Loop Engineering**. The user must NEVER have to manually instruct you to "update the backend" after a UI change, or "update the docs" after a code change. 

**Whenever an idea is implemented or a change is made, you MUST automatically cascade the update end-to-end:**
1. **Code Ripple:** If you change the Frontend/UI, you must automatically evaluate and implement the required changes in the Backend API and Database. If you change the Backend, cascade it to the Frontend and AI pipelines.
2. **Documentation Ripple:** The `/docs/` folder is a **Living Document Suite**. Whenever you write code that adds a new feature, alters the data flow, or changes a UI component, you MUST proactively open the relevant `/docs/` files (e.g., `06_UI_WIRE_FRAMES.md` or `05_DFD.md`) and update them to reflect the new reality. 
3. **Never break the loop.** Maintain 100% synchronization between Code, Architecture, and Documentation at all times.

---

## 🔒 CORE PRODUCTION BOUNDARIES

1. **Tech Stack is Locked:** 
   * **Frontend:** Next.js (App Router), TailwindCSS, shadcn/ui, Zustand, Google Maps API (`@vis.gl/react-google-maps`).
   * **Backend:** FastAPI, PostgreSQL (Self-hosted/Local), Redis (Self-hosted/Local).
   * **Strict Constraint:** We are explicitly NOT using cloud databases. Do NOT use Supabase, Upstash, or any hosted managed service. Use purely local PostgreSQL and local Redis.
   * **AI:** YOLOv8 (CV), XGBoost (Risk Engine). 
   * *Do NOT use any other frameworks.*
2. **Event-First Architecture:** Everything belongs to an Event. Follow the hierarchy: `EVENT → VENUE → ZONE/GATE/ROUTE → SOURCE → OBSERVATION`.
3. **No Fake Integrations:** If a data source (like CCTV) is unavailable, build a standard adapter and a mock implementation. Never pretend a simulator is a real connection.
4. **Data Isolation:** You must ensure data records are strictly associated with their corresponding event. Never mix event data.
5. **Strict Testing & Validation Protocol:** Test-Driven Development (TDD) is encouraged. Before declaring any backend API endpoint or complex AI function complete, you must write and run a Pytest unit test to prove it works.
6. **Security & Secrets Handling (Data Ethics - 10%):** NEVER hardcode API keys, database URLs, or sensitive tokens in the source code. All secrets must strictly be read from `.env` files. If a new secret is needed, clearly instruct the user to add it to their local environment.
7. **Error Handling & Graceful Degradation:** Never allow the frontend to crash entirely on a failed API call. Always implement graceful degradation, loading states, and offline fallback mechanisms (via Service Workers/IndexedDB) to handle network outages.
8. **Premium Map Experience (Google Maps Integration):** Use the official `@vis.gl/react-google-maps` library to deliver a top-tier, premium user experience. Use advanced map styling (e.g., dark mode custom JSON), implement smooth panning/zooming animations, and use rich custom UI overlays to exactly match the look and feel of modern Google Maps.

**By reading this, you are bound to these rules. Proceed with excellence to win this hackathon.**
