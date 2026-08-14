
import sys

with open("docs/14_TEAM_SPRINT_PLAN.md", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the "=" glitch with the actual Member 2 section, updated with our progress
member_2_section = """
---

## ?? Member 2: Backend & Data Architect (The Plumber)
**Focus:** FastAPI, WebSockets, PostgreSQL, Redis, APIs, Simulation.

### Day 1: WebSocket & Pub/Sub Setup
- [x] **Step 3.1:** Implement the `StandardObservation` Pydantic models for data ingestion.
- [x] **Step 3.2:** Build the Source Registry API (CRUD for CCTV cameras, Smart Gates, etc.).
- [ ] **Step 3.7 (Part 1):** Integrate Local Redis for high-frequency Pub/Sub messaging.
- [x] **Step 3.7 (Part 2):** Build the robust WebSocket Broadcaster to push updates to the UI.

### Day 2: The Data Pipeline (Phase 3)
- [x] **Step 3.4:** Build the high-throughput `/api/v1/ingest` endpoint with rate limiting.
- [x] **Step 3.5 & 3.6:** Build the Fusion Engine. Write the math to merge data from multiple sources (CCTV + Gates) into a single "Crowd State".
- [x] **Step 3.8:** Implement the Source Health Monitor (tracking if a camera goes OFFLINE).

### Day 3: External Adapters (Phase 4)
- [ ] **Step 4.1:** Build the standard CCTV Adapter API.
- [ ] **Step 4.2:** Build the Smart Gate Adapter API (RFID/Turnstile).
- [ ] **Step 4.3 & 4.4:** Build the Drone and Mobile GPS adapters. (Implement mock variants as fallbacks if real hardware is unavailable).

### Day 4: The Simulation Engine (Phase 8)
- [x] **Step 3.3 / 8.1:** Write the Python `SyntheticSimulator`.
- [x] **Step 8.2:** Program specific scenarios: "Normal Inflow", "Sudden Surge", "Gate Blockage". 
- *Goal: This simulator is crucial for the Hackathon demo to prove the system works under stress!*

### Day 5 & 6: Production Database & Optimization
- [ ] **Step 1.1 (Database):** Ensure PostgreSQL connection pooling is optimized for production.
- [ ] **Step 1.1 (PostGIS):** Enable PostGIS on PostgreSQL for spatial queries (finding users inside a Zone polygon).
- [ ] **Day 6:** Load test the WebSocket connections (simulate 10,000 updates/sec).
"""

if "=" in content:
    content = content.replace("=", member_2_section)

with open("docs/14_TEAM_SPRINT_PLAN.md", "w", encoding="utf-8") as f:
    f.write(content)

