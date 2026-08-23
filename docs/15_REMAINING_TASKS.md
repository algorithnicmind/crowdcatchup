# Remaining Tasks — Detailed Breakdown

As of the current project state, Phase 1 through Phase 5 have been implemented. The following is a detailed breakdown of the 20 remaining tasks across Phases 6 through 9, including the final hackathon deliverables.

---

## Phase 6: Decision Support (4 Tasks Remaining)

**6.3 Approval flow (human-in-the-loop)**
- **Detail:** The AI Recommendation Engine currently generates interventions, but they must be approved by the Authority. We need to wire up the "Approve" button on the Authority dashboard to trigger the `EXECUTE_ACTION` WebSocket event on the backend. This will broadcast an `InterventionApproved` domain event and persist the state change to the database.

**6.4 Police deployment**
- **Detail:** Upon approval of a security-related intervention, the system must dispatch a `SECURITY_TASK` WebSocket event targeted at Police user clients. This payload must include the target zone, required officer count, and specific tactical instructions. The Police dashboard needs to listen for this event and render the task.

**6.5 Announcements**
- **Detail:** We need to implement the `CITIZEN_ALERT` WebSocket event to push notifications to the Citizen PWA. This requires implementing the i18n anti-panic templates (English, Hindi, Odia) so that citizens receive clear, non-alarming instructions (e.g., "Please use Gate D" instead of "Gate C is dangerously crowded").

**6.6 Explainability UI**
- **Detail:** Enhance the `RecommendationCard` component on the frontend. When the AI recommends an action, the UI must display the `primary_reason`, `supporting_factors`, and `confidence` score so the human Authority trusts the decision before approving it.

---

## Phase 7: User Experiences (4 Tasks Remaining)

**7.5 Incidents feature (backend)**
- **Detail:** Implement the backend REST API (`POST /api/v1/incidents`) and WebSocket events for Citizen SOS reporting. When a citizen taps SOS on their app, it should drop a pin on the Authority's command map.

**7.6 Citizen Journey Navigation — Backend**
- **Detail:** Implement the core pathfinding logic in `features/navigation/route_engine.py`. This involves an A* (A-Star) search algorithm that calculates routes based on distance, but adds penalty weights for crowded zones (based on live density data). It must also account for the user's `GroupSize` (solo vs. large group) when recommending gates.

**7.7 Citizen Journey Navigation — Frontend**
- **Detail:** Build the citizen navigation interfaces: `JourneyPlanner`, `GroupSizeSelector`, and `NavigationPanel`. This UI will consume the backend navigation API, display the recommended "Safe Route" (green line) on the SVG Map UI, and guide the user turn-by-turn.

**7.8 PWA Polish**
- **Detail:** Finalize the Progressive Web App features for the Citizen app. This includes registering the Service Worker, configuring IndexedDB to cache the static venue map for offline use, and ensuring web push notifications are functional.

---

## Phase 8: Simulation (4 Tasks Remaining)

**8.1 Digital Twin**
- **Detail:** Ensure the Authority dashboard map fully acts as a digital twin by syncing perfectly with the live crowd state, coloring zones based on live risk levels, and showing active interventions.

**8.2 Scenario engine**
- **Detail:** Build manual override buttons on the Event Owner dashboard to inject pre-scripted scenarios (e.g., "Simulate Sudden Inflow", "Simulate Route Blocked"). These buttons will tell the backend simulator to rapidly alter telemetry data for the demo.

**8.3 What-if analysis**
- **Detail:** Implement a prediction tool where the Authority can select a hypothetical action (e.g., "Close Gate C") and the system will run a fast-forward simulation to show the predicted resulting density in neighboring zones.

**8.4 Post-event reports**
- **Detail:** Create an endpoint that aggregates all event data (risk timelines, density peaks, executed interventions) into a final summary report that can be viewed or exported after an event concludes.

---

## Phase 9: Production & Deliverables (8 Tasks Remaining)

**9.2 Backend tests**
- **Detail:** Fix the currently failing Pytest suite (there are validation errors on Auth routes and KeyErrors on Event routes). Ensure 100% passing tests for the core Fusion and Risk pipelines.

**9.3 Frontend tests**
- **Detail:** Write basic Jest/Playwright tests to ensure the dashboards and citizen navigation screens render without crashing.

**9.4 Performance & Monitoring**
- **Detail:** Conduct a load test simulating high WebSocket traffic to ensure the FastAPI backend and Redis pub/sub do not crash under demo conditions. Verify that if the CV pipeline drops, the system gracefully degrades.

**9.5 Deployment**
- **Detail:** Set up CI/CD. Deploy the Next.js frontend to Vercel, the FastAPI backend via Docker/AWS, and provision the production Neon PostgreSQL database. Ensure HTTPS is enabled.

**9.6 Docs final sync + README**
- **Detail:** Update the `README.md` with foolproof quick-start instructions for the judges. Ensure all `/docs/` reflect the final shipped code.

**9.7 Architecture diagram + source code pack**
- **Detail:** Generate the final required architecture diagram detailing data flow, modules, and third-party integrations.

**9.8 Pitch deck (≤10 slides) + Demo video**
- **Detail:** Create the 10-slide presentation deck. Record the official 3-minute demo video showing the full hackathon scenario story.

**9.9 Documentation pack**
- **Detail:** Compile the final tech choices, assumptions, and data ethics/privacy compliance checks into the final submission package.

---

## Final Demo Rehearsal
- **Detail:** Run through the end-to-end incident injection (Steps D1 to D10). Simulate a crowd surge, watch the AI recommend a gate closure and police deployment, approve it, and watch the risk stabilize. Ensure everything flows seamlessly for the live presentation.
