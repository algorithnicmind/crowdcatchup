# Enterprise Testing, Quality Assurance (QA) & Chaos Engineering Playbook
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. Quality Assurance Philosophy

Because CrowdShield is a mission-critical early warning system, software defects or unhandled exceptions can directly compromise situational awareness during physical emergencies.

---

## 2. Test Pyramid & Automation Strategy

### 2.1 Backend API & Logic Testing (Pytest)
Located in `/apps/api/tests/`.

| Test Area | What to Test |
| :--- | :--- |
| **Auth & RBAC** | CITIZEN role gets 403 on `/interventions/approve`. POLICE cannot alter venue config. |
| **Event Isolation** | Observations from Event A never affect Event B. |
| **Standard Observation** | All adapters produce valid StandardObservation format. |
| **Smart Gate Logic** | Gate status thresholds: NORMAL -> HIGH_FLOW -> CONGESTED -> CRITICAL. |
| **GPS Route Processing** | Outlier filtering, smoothing, map-matching produce valid routes. |
| **Fusion Engine** | Confidence-weighted estimation produces correct fused values. |
| **Disagreement Detection** | Sources with 30%+ deviation are flagged. |
| **Risk Engine Math** | Mock CrowdState of 4000 people in 1000m2 calculates density 4.0 p/m2. |
| **WebSockets** | RISK_UPDATE broadcasts to multiple connected clients simultaneously. |
| **Source Health** | OFFLINE sources have reduced confidence weight. |

### 2.2 Frontend PWA Testing (Playwright)
Located in `/apps/web/e2e/`.

| Test Area | What to Test |
| :--- | :--- |
| **Role-Based Routing** | Authority -> `/app/authority/map`. Police -> `/app/police/tasks`. |
| **Event Owner Flow** | Create event -> Draw boundary -> Create zones -> Configure gates -> Run simulation. |
| **Smart Gate Status UI** | Gate status colors update correctly (GREEN/AMBER/RED). |
| **Source Health Panel** | Shows ONLINE/DELAYED/OFFLINE per source. |
| **Offline Mode** | Service Worker serves cached map when offline. |
| **Map Rendering** | Event boundary, zones, gates, routes render on SVG Digital Twin Map. |

### 2.3 Machine Learning Pipeline Testing
Located in `/apps/cv_engine/tests/`.

| Test Area | What to Test |
| :--- | :--- |
| **CV Precision/Recall** | Detection on dense-crowd datasets. False Negatives < 5%. |
| **Risk Model Evaluation** | F1-Score, MAE, False Alarm Rate on prediction models. |
| **Feature Extraction** | Time-series features correctly calculated from historical data. |

### 2.4 Multi-Source & Fusion Testing

| Test Area | What to Test |
| :--- | :--- |
| **Source Adapter Compliance** | Each adapter (CCTV, Smart Gate, GPS, Synthetic) produces valid StandardObservation. |
| **Fusion Accuracy** | Fused crowd state is within acceptable error margin of ground truth. |
| **Source Failure Resilience** | System continues operating when any single source goes OFFLINE. |
| **Sensor Disagreement** | Anomalous source detected and confidence reduced. |
| **Confidence Calculation** | Confidence correctly factors in accuracy, freshness, health. |
| **Event Isolation** | Fusion never mixes observations from different events. |

---

## 3. Comprehensive Edge Case & Defensive Matrix

| Edge Case | Risk | Defensive Behavior |
| :--- | :--- | :--- |
| **Zero Crowd (N=0)** | Division-by-zero in velocity averaging | If people_count == 0, default speed to 1.3 m/s, risk to 0 |
| **Camera Feed Dropout** | Lost CV data | Mark OFFLINE, XGBoost falls back to historical, confidence decays |
| **Smart Gate Offline** | Lost entry/exit data | Mark OFFLINE, fusion relies on CCTV + GPS |
| **GPS Unavailable** | Lost crowd participation data | Continue with CCTV + Smart Gates |
| **PWA Disconnection** | Lost WebSocket connection | Auto-reconnect with exponential backoff, fetch latest state on reconnect |
| **Corrupt SOS Submission** | XSS injection | Pydantic validation strips HTML, render as text nodes |
| **All Sources Offline** | No data | Minimal mode: serve cached state, alert Authority to deploy manual verification |
| **Observation from Wrong Event** | Event mixing | Reject observation if event_id doesn't match active event context |
| **High Latency Observation** | Stale data | Reduce confidence based on latency_ms |
| **Duplicate Observations** | Double counting | Deduplication in Fusion Hub based on source_id + timestamp |

---

## 4. Chaos Engineering & Resilience Playbooks

### 4.1 Chaos Playbook A: "The Cellular Blackout"
* **Condition:** Throttle network to Offline in Chrome DevTools.
* **Validation:** UI continues executing. Service Worker serves cached HTML shell.

### 4.2 Chaos Playbook B: "The SOS Flood Test (Locust)"
* **Condition:** 10,000 concurrent SOS_INCIDENT_REPORT requests in 5 seconds.
* **Validation:** Database connection pool manages spikes. Authority dashboard groups clustered coordinates.

### 4.3 Chaos Playbook C: "Source Cascade Failure"
* **Condition:** Sequentially disable CCTV-01, then SG-03, then GPS.
* **Validation:** Fusion confidence decreases gracefully. System never crashes. Authority sees source health updates.

### 4.4 Chaos Playbook D: "Sensor Disagreement"
* **Condition:** Send CCTV observation with value 5000 while GPS reports 1200.
* **Validation:** Disagreement alert triggered. CCTV confidence reduced. Fused state not skewed.

### 4.5 Chaos Playbook E: "Event Isolation Breach"
* **Condition:** Send observation with wrong event_id.
* **Validation:** Observation rejected. No cross-event contamination.

---

## 5. Testing Commands

| Layer | Command |
| :--- | :--- |
| Backend unit tests | `cd apps/api && python -m pytest tests/ -v` |
| Frontend lint | `cd apps/web && npm run lint` |
| Frontend build | `cd apps/web && npm run build` |
| E2E tests | `cd apps/web && npx playwright test` |
| AI pipeline tests | `cd ai && python -m pytest tests/ -v` |
