# Technical Requirements Document (TRD)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Technical Systems Specification & Engineering Foundation  
**Document Version:** 1.0 (Production Release)  

---

## 1. System Technology Stack & Architectural Decisions

### 1.1 Core Frontend Technologies
* **Application Foundation:** HTML5 (Semantic Markup, Web API access), Vanilla CSS3 (Custom design system with tokens, variables, and glassmorphic styling), and ES6+ JavaScript (Native standard module syntax via `<script type="module">`).
* **Simulation Engine:** Native **HTML5 Canvas 2D API** (`CanvasRenderingContext2D`) running optimized particle fluid physics animation via `requestAnimationFrame`.
* **Zero-Build Dependency:** To ensure extreme portability, rapid deployment, and minimal hardware requirements, the core application runs without compilation overhead (e.g., Webpack/Babel) or external third-party GUI library bloat.

### 1.2 Web & Media API Integrations
* **Web Speech API:** Ingests executive voice inputs via `SpeechRecognition` / `webkitSpeechRecognition` for audio command parsing and automated simulation fallbacks.
* **Web Audio & Speech Synthesis:** Engages `window.speechSynthesis` (`SpeechSynthesisUtterance`) to synthesize conversational voice co-pilot responses and citizen navigational guidance.
* **Document Printing / PDF Generation:** Utilizing standard browser formatting via `window.print()` for Generative AI executive SITREP export.

---

## 2. Mathematical Principles & Stampede Physics Algorithms

### 2.1 Critical Crowd Density ($d$) Thresholds
In accordance with international pedestrian dynamics engineering, CrowdShield classifies crowd safety into distinct states based on localized area density ($d$) measured in $\text{people/m}^2$:
* **Nominal Fluidity (`SAFE`):** $d < 2.0\text{ p/m}^2$. Individuals retain complete freedom of physical movement and walking pace.
* **Congestion & Surge (`WARNING`):** $2.0 \le d < 4.0\text{ p/m}^2$. Contact between pedestrians increases; flow velocity begins degrading below nominal $1.3\text{ m/s}$.
* **Crush Hazard & Stampede Risk (`CRITICAL DANGER`):** $d \ge 4.0\text{ p/m}^2$. At $d > 4.5\text{ p/m}^2$, involuntary wave motion triggers due to excessive chest physical contact. Shockwave forces exceed human skeletal endurance, presenting immediate asphyxiation and trampling risk.

### 2.2 Velocity & Flow Vector Approximation
Crowd migration velocity ($\vec{v}$) is computed across spatial sector grids ($40\text{px} \times 40\text{px}$ simulation quadrants) using averaged vector components:

$$\vec{V}_{avg} = \left( \frac{1}{n} \sum_{i=1}^{n} v_{x,i}, \quad \frac{1}{n} \sum_{i=1}^{n} v_{y,i} \right)$$

When localized velocity $\vec{V}_{avg}$ stalls below **$0.4\text{ m/s}$** while simultaneous grid density $d \ge 3.8\text{ p/m}^2$, the system marks the coordinate as an **Active Structural Bottleneck**.

---

## 3. Rendering Budget & Edge Performance Constraints

### 3.1 Canvas Simulation Performance (FPS Optimization)
To guarantee real-time evaluation without CPU thread choking on low-power municipal control room hardware:
* **Max Particle Cap:** The engine enforces a soft ceiling of $N = 2,500$ simultaneously evaluated fluid particles per rendering window.
* **Spatial Binning Grid:** Rather than executing $O(N^2)$ collision checks for heatmaps, the canvas is subdivided into an integer lookup grid ($C = \lceil W / 40 \rceil, R = \lceil H / 40 \rceil$), lowering spatial calculation complexity to $O(N)$.
* **Telemetry Decoupling:** While screen rendering executes at up to 60 FPS via animation loops, deep diagnostic AI state transitions and UI gauge DOM updates occur at fixed **400ms decoupling intervals** (`lastTelemetryEmit`).

---

## 4. Network Payload Specs & Mesh Offline Resiliency

### 4.1 Low-Bandwidth Mesh Alert Payload Format
During severe gathering congestion, standard 4G/5G cellular towers fail due to packet signaling saturation. To ensure citizen companion alerts penetrate offline environments via simulated **Bluetooth Low Energy (BLE) / Wi-Fi Direct peer-to-peer mesh networking**, broadcast payloads are serialized into compact JSON tuples under $\le 256\text{ bytes}$:

```json
{
  "id": "em_8041",
  "k": "emergencyEvac",
  "l": ["en", "hi", "mr", "ta"],
  "g": "Gate 5",
  "t": 1754418652000,
  "p": 1
}
```

* **Field Definitions:** 
  * `id`: Unique deduplication string for peer-to-peer relay forwarding.
  * `k`: Translation dictionary key matching localized device storage (`translations.js`).
  * `l`: Allowed language rendering bit-mask.
  * `g`: Recommended target escape vector / gate.
  * `t`: Epoch timestamp in milliseconds.
  * `p`: Priority level (`0` Info, `1` Warning, `2` Critical Alarm).

---

## 5. Security & Privacy Compliance Specifications
* **Zero Biometric Retention:** All incoming vision feeds (from simulated optical flow cameras) shall undergo instantaneous abstract feature extraction. No raw video frames, facial geometry parameters, or citizen personal identifiable information (PII) are persisted to storage.
* **Role-Based Command Execution:** Execution of structural countermeasures (e.g., closing main entrance gates, deploying Rapid Action Force units) requires verified operational tokens within the command UI event bus before state transitions propagate to public broadcasting channels.
