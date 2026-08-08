# Enterprise Testing, Quality Assurance (QA) & Chaos Engineering Playbook
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Verification Strategy, Edge Case Matrix & Chaos Resilience  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. Quality Assurance Philosophy (Life-Critical Systems)
Because CrowdShield is designed as a mission-critical early warning system for large Indian public gatherings, software defects or unhandled exceptions can directly compromise situational awareness during physical emergencies. 

Both human engineers and automated AI coding agents must evaluate any future architectural changes against this comprehensive Testing & QA Strategy prior to merging code or staging builds.

---

## 2. Test Pyramid & Automation Strategy

Because CrowdShield uses a Next.js/FastAPI monorepo, testing is split across three distinct environments.

### 2.1 Backend API & Logic Testing (Pytest)
Located in `/apps/api/tests/`, these headless unit tests validate Python logic and Database ORM interactions without HTTP overhead.
* **Auth & RBAC:** Assert that a token with `CITIZEN` role receives a `403 Forbidden` when attempting to POST to the `/interventions/approve` endpoint.
* **Risk Engine Math:** 
  * Assert that a mock JSON payload of 4,000 people inside a $1000m^2$ polygon calculates a density of `4.0 p/m²`.
  * Assert the XGBoost feature extraction correctly calculates a `density_growth_rate` over simulated 5-minute historical Redis keys.
* **WebSockets:** Test that a single `RISK_UPDATE` event successfully broadcasts to multiple connected mock clients simultaneously.

### 2.2 Frontend PWA Testing (Playwright)
Located in `/apps/web/e2e/`, Playwright handles end-to-end browser simulation to ensure the unified UI renders correctly across roles and device sizes.
* **Role-Based Routing:**
  * Login as `Authority_1` $\rightarrow$ Expect redirect to `/app/authority/map`.
  * Login as `Police_1` $\rightarrow$ Expect redirect to `/app/police/tasks` and mobile viewport constraints.
* **Offline Service Worker Check:** 
  * Playwright sets `context.setOffline(true)`.
  * Asserts the venue map continues to render from IndexedDB and the "No Connection" toast appears without crashing the UI.

### 2.3 Machine Learning Pipeline Testing (MLFlow / Evaluation)
Located in `/ai/tests/`, evaluating the XGBoost and YOLO pipelines.
* **CV Precision & Recall:** Evaluate detection on standard dense-crowd datasets (e.g., ShanghaiTech). Ensure False Negatives remain $< 5\%$.
* **Risk Model Evaluation:** Measure F1-Score, Mean Absolute Error (MAE), and False Alarm Rate on the prediction models.

---

## 3. Comprehensive Edge Case & Defensive Matrix

| Edge Case Scenario | Potential Risk / Failure Mode | Mandatory System Defensive Behavior |
| :--- | :--- | :--- |
| **Zero Crowd Population ($N=0$)** | Division-by-zero Errors during velocity vector averaging ($\frac{1}{0}$) in the CV Pipeline. | Python Analytics Engine must apply conditional short-circuiting: If `people_count == 0`, default speed to $1.3\text{ m/s}$ and risk to $0$. |
| **Camera Feed Dropout** | Network glitch disconnects the RTSP stream. | FastAPI marks camera as `DISCONNECTED`. XGBoost model falls back to forecasting based on historical memory, decaying confidence over time. |
| **PWA Disconnection** | Authority dashboard drops WebSocket connection due to Wi-Fi swap. | Next.js Socket context must auto-reconnect with exponential backoff and fetch the latest missed states via REST upon reconnection. |
| **Corrupt Citizen SOS Submissions** | Attendee submits malicious script tags (`<script>alert('xss')</script>`) via mobile form. | FastAPI must use Pydantic validation to strip raw HTML. Next.js must render descriptions as text nodes, completely preventing XSS. |

---

## 4. Chaos Engineering & Resilience Playbooks

To evaluate production robustness before deploying to live event environments, run these simulated stress exercises:

### 4.1 Chaos Playbook A: "The Cellular Blackout Simulation"
* **Test Condition:** Manually throttle network capability in Chrome DevTools to "Offline" while running the local Next.js server.
* **Validation Criteria:** Verify that the UI dashboard continues executing. Navigate to a different page and ensure the Service Worker successfully serves the cached HTML shell.

### 4.2 Chaos Playbook B: "The SOS Flood Test (Locust)"
* **Test Condition:** Execute a Locust load testing script injecting 10,000 concurrent `SOS_INCIDENT_REPORT` POST requests within a 5-second window into the FastAPI Gateway.
* **Validation Criteria:** Verify that the database connection pool (PgBouncer/SQLAlchemy) manages the spikes without crashing the server. Assert that the Authority dashboard groups clustered coordinates into a single heat-zone rather than rendering 10,000 separate overlapping DOM markers and freezing the browser.
