
import sys

with open("docs/14_TEAM_SPRINT_PLAN.md", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("- [ ] **Step 1.1 (Database):** Ensure PostgreSQL connection pooling is optimized for production.", "- [x] **Step 1.1 (Database):** Ensure PostgreSQL connection pooling is optimized for production.")
content = content.replace("- [ ] **Step 1.1 (PostGIS):** Enable PostGIS on PostgreSQL for spatial queries", "- [x] **Step 1.1 (PostGIS):** Enable PostGIS on PostgreSQL for spatial queries")
content = content.replace("- [ ] **Day 6:** Load test the WebSocket connections (simulate 10,000 updates/sec).", "- [x] **Day 6:** Load test the WebSocket connections (simulate 10,000 updates/sec).")

with open("docs/14_TEAM_SPRINT_PLAN.md", "w", encoding="utf-8") as f:
    f.write(content)

