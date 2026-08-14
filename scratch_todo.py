
import sys

with open("docs/14_TEAM_SPRINT_PLAN.md", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("- [ ] **Step 3.7 (Part 1):** Integrate Local Redis for high-frequency Pub/Sub messaging.", "- [x] **Step 3.7 (Part 1):** Integrate Local Redis for high-frequency Pub/Sub messaging.")

with open("docs/14_TEAM_SPRINT_PLAN.md", "w", encoding="utf-8") as f:
    f.write(content)

with open("docs/13_MASTER_TODO.md", "r", encoding="utf-8") as f:
    content2 = f.read()
    # Actually wait, Redis isn't explicitly named out in 13_MASTER_TODO besides inside Step 3.6/3.7 perhaps, but let's leave MASTER_TODO for now.

