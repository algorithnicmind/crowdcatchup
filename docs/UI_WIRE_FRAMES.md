# User Interface (UI) Specifications & Wireframe Mapping
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** UI Design Tokens, Psychological Architecture & Screen Wireframes  
**Document Version:** 1.0 (Production Release)  

---

## 1. UI Design Psychology & Aesthetic Foundation

### 1.1 Tactical Dark-Mode ("Cyber Command Operations")
To minimize operator eye fatigue during multi-hour emergency surveillance in dimly lit control rooms, CrowdShield implements a dark-mode tactical UI palette (`#0a0d16` background). Glassmorphic translucent cards (`backdrop-filter: blur(12px)`) provide depth hierarchy without visual clutter.

### 1.2 Semantic Color Designations & Glowing Indicators
* 🟢 **Safe & Operational (Emerald):** `#10b981` with subtle radial shadow glows (`0 0 10px rgba(16, 185, 129, 0.2)`). Signifies normal fluidity ($<2.0\text{ p/m}^2$) and active sensor fusion connection.
* 🟡 **Elevated Surge Warning (Amber):** `#f59e0b`. Signifies developing queue congestion and prompts preventative one-way flow advisories.
* 🔴 **Critical Crush Hazard (Neon Crimson):** `#ef4444` accompanied by pulsing beacon animations (`hazard-blink 1.5s infinite`). Immediately draws operator vision to emergency bottleneck coordinates.
* 🔵 **AI Intelligence & Mesh Networking (Sci-Fi Cyan/Indigo):** `#3b82f6` to `#8b5cf6` linear gradients designating automated AI decision advisories and offline peer-to-peer mesh connectivity.

---

## 2. Screen Anatomy & Master Wireframe Layout

The primary platform interface ([index.html](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/index.html)) structured via a two-column responsive desktop grid (`grid-template-columns: 1fr 390px`):

```
+---------------------------------------------------------------------------------------------------------+
| [🛡️ CrowdShield AI]          Venue Preset: [ Maha Kumbh Mela ▼ ]     [🟢 Sensor: LIVE] [📶 Mesh Ready]  |
+---------------------------------------------------------------------------------------------------------+
| ⚡ AI SCENARIO TESTING:  (🟢 Normal)  (🌧️ Downpour)  (🚪 Gate 2 Blockage)  (🎤 Stage Rush)  (🔄 Reverse) |
+--------------------------------------------------------------------+------------------------------------+
| 🌐 Live Arena Digital Twin & Flow Map      | 📊 AI Risk Metrics   | 📱 Citizen Companion Phone Sim    |
| +-----------------------------------------+ | +------------------+ | +--------------------------------+ |
| | [X] 🔥 Heatmap [X] ↗️ Vectors [X] 👮 Sec | | |  Stampede Risk   | | | [10:45]     [🔗 Mesh] [🔋 96%] | |
| |                                         | | |    ((   12%  ))  | | | [🛡️ CrowdShield]  [Lang: HI ▼] | |
| |           [ 2D CANVAS VIEWPORT ]        | | |   [ LOW RISK ]   | | +--------------------------------+ |
| |       (Simulated moving crowd dots)     | | +------------------+ | | [🟢 All Sectors Safe         ] | |
| |                                         | | | ⏳ Time to Crush | | |  No unusual congestion nearby  | |
| |      +---------------------------+      | | |   Safe (>30m)    | | +--------------------------------+ |
| |      | ⚠️ MAP TOAST WARNING BOX  |      | | +------------------+ | | [🔔 Alerts] [🧭 Route] [🚨 SOS]| |
| |      +---------------------------+      | | | Peak: 1.4 p/m²   | | | +----------------------------+ | |
| |                                         | | | Speed: 1.3 m/s   | | | | 🚪 Gate 2 Temporarily    | | |
| |  [Gate 1: 🟢]       [Gate 2: 🔴 CLOSED] | | | Bottleneck: 0    | | | |    Closed (Live Broadcast) | | |
| +-----------------------------------------+ +--------------------+ | | +----------------------------+ | |
| Legend: [ <2.0 Safe ] [ 2.0-4.0 Congested ] [ >4.0 Stampede Risk ] | | |      [HOME NAVIGATION BAR]     | |
+--------------------------------------------------------------------+ +------------------------------------+
| 🧠 Intelligent Recommendations & Action Engine | 🎙️ Shield-AI Voice Copilot & GenAI SITREPs             |
| +--------------------------------------------+ | +------------------------------------------------------+ |
| | [!] 🚪 Open Emergency Gate 4 & Divert Flow  | | | ( 🎙️ Ask Shield-AI )  [||||||| Audio Waves Visual ||] | |
| |     Shed ~50% pressure within 180 seconds. | | | Transcript: "Open emergency exit Gate 4..."        | |
| | [📢 Broadcast Alert] [⚡ Accept & Execute]  | | +------------------------------------------------------+ |
| +--------------------------------------------+ | [ ✨ Generate GenAI Incident Summary (SITREP Modal)  ] |
+------------------------------------------------+--------------------------------------------------------+
```

---

## 3. Detailed Component & Wireframe Breakdown

### 3.1 Scenario Stress Simulation Toolbar ([dashboard.css](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/styles/dashboard.css))
* **Visual Styling:** Horizontal dark glass panel located beneath the global header.
* **Interaction Contract:** Clicking any scenario button transitions the active class (`active`), instantly mutating simulated particle targets in [digitalTwinEngine.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/simulation/digitalTwinEngine.js). Buttons feature specialized color hover indicators (Red for hazard simulation, Amber for surge warning).

### 3.2 Predictive AI Risk Gauges & Telemetry Panel
* **Hero Radial Gauge:** SVG animated circular progress meter (`viewBox="0 0 100 100"`). The inner ring (`stroke-dasharray: 264`) adjusts its dash offset dynamically via JavaScript as calculated stampede probability scales from 0% to 100%.
* **Diagnostic Breakdown Grid:** Displays numerical peak density, movement speed, and active bottleneck counting boxes formatted in monospace high-contrast typography (`JetBrains Mono`).

### 3.3 Interactive Recommendation Action Card
* **Structure:** A vertically grouped advisory queue card featuring left border color-coding ($4\text{px}$ solid `#f59e0b` or `#ef4444` for critical alarms).
* **Action Controls:**
  1. `[📢 Broadcast Multilingual Alert]`: Triggers push notifications across regional languages to the mobile emulator.
  2. `[⚡ Accept & Execute Advisory]`: Directly modifies simulation gates, dispatches Rapid Action security cordons, and switches card status to green `[✔ EXECUTED IN SIMULATION]`.

---

## 4. Companion Mobile App Wireframes ([mobile-emulator.css](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/styles/mobile-emulator.css))

The smartphone simulator presents a realistic hardware chassis with front speaker notch, status bar, and three switchable tab screens:

```
+----------------------------------------+       +----------------------------------------+       +----------------------------------------+
| 📱 SCREEN 1: ALERTS FEED TAB           |       | 📱 SCREEN 2: SAFE ROUTE NAVIGATION     |       | 📱 SCREEN 3: REPORT SOS FORM           |
+----------------------------------------+       +----------------------------------------+       +----------------------------------------+
| Live Multi-Lingual Broadcasts     [1]  |       | 📍 Personalized Exit Guide             |       | 🚨 Crowdsourced Early Warning          |
|                                        |       | Nearest designated Green Safe Route:   |       | Alert Control Room instantly of panic. |
| +------------------------------------+ |       | Gate 4 & Gate 5                        |       |                                        |
| | 🚨 URGENT: High Density Alert      | |       |                                        |       | Incident Type:                         |
| | Crowd density exceeded limits in   | |       | +------------------------------------+ |       | [ Medical Emergency in Crowd       ▼ ] |
| | Ghat Central. Immediate slow paced | |       | |               📍 YOU               | |       |                                        |
| | dispersal to Gate 5 required.      | |       | |                 │ (Green Path)     | |       | Location / Sector:                     |
| | 📣 Emergency Response Command      | |       | |                 ▼                  | |       | [ Near Sector B / Ghat Central Area  ] |
| +------------------------------------+ |       | |         🚪 GATE 4 (CLEAR)          | |       |                                        |
|                                        |       | +------------------------------------+ |       | Additional Details:                    |
| +------------------------------------+ |       | 🟢 Safe One-Way Flow Active          |       | [ Elderly pilgrims trapped by fence  ] |
| | 🚪 Gate 2 Temporarily Closed       | |       |                                        |       |                                        |
| +------------------------------------+ |       | [ 🔊 PLAY AUDIO GUIDANCE (VOICE)     ] |       | [ ⚡ SEND URGENT SOS TO COMMAND ROOM ] |
+----------------------------------------+       +----------------------------------------+       +----------------------------------------+
```

### 4.1 Real-Time Language Switching ([translations.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/data/translations.js))
* When an evaluator switches the header dropdown from **English (`en`)** to **Hindi (`hi`)**, **Marathi (`mr`)**, or **Tamil (`ta`)**, the DOM controller instantaneously rewrites all visible banner headers, alert paragraphs, and navigation instructions into native Unicode scripts without requiring an application refresh.
