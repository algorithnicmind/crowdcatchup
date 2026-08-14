
import sys
with open("docs/13_MASTER_TODO.md", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("- [ ] **3.1 Standard Observation Format**", "- [x] **3.1 Standard Observation Format**")
content = content.replace("- [ ] **3.2 Source registry**", "- [x] **3.2 Source registry**")
content = content.replace("- [ ] **3.5 Normalization + validation pipeline**", "- [x] **3.5 Normalization + validation pipeline**")
content = content.replace("- [ ] **3.6 Fusion engine**", "- [x] **3.6 Fusion engine**")
content = content.replace("- [ ] **3.8 Source health monitor**", "- [x] **3.8 Source health monitor**")

with open("docs/13_MASTER_TODO.md", "w", encoding="utf-8") as f:
    f.write(content)

