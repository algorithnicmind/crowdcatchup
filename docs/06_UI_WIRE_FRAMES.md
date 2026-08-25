# User Interface (UI) Specifications & Wireframe Mapping
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. UI Design Psychology & Aesthetic Foundation

CrowdShield emphasizes **Rich Aesthetics and Dynamic Design** using Next.js, Tailwind CSS, and `shadcn/ui`.

* 🟢 **Safe (Emerald):** `#10b981`. Normal fluidity (< 2.0 p/m2).
* 🟡 **Surge Warning (Amber):** `#f59e0b`. Developing queue congestion.
* 🟠 **High Risk (Orange):** `#f97316`. Elevated risk, action needed.
* 🔴 **Critical Hazard (Crimson):** `#ef4444`. Immediate danger/bottleneck.
* 🗺️ **Premium Map Engine:** The Custom SVG Digital Twin Map is the hero component for every view. It **MUST** be styled to deliver a premium experience, utilizing custom dark map styling, smooth animations, custom dynamic markers, and interactive glassmorphism detail panels.

---

## 2. Role-Based Wireframes (Unified Global Sidebar Architecture)

All user roles (Authority, Police, Citizen, Organizer) now share a unified **Global Sidebar** on the left, featuring a high-tech `DotPattern` background, with the interactive SVG Digital Twin Map occupying the main right-hand canvas. This eliminates floating panels and maximizes map visibility.

### 2.1 Authority Command Center (Desktop PWA)

```text
+-------------------------+-------------------------------------------------------------------------------+
| CROWDSHIELD (Cmdr)      |  [Search venue, gates, zones...]                                [Alerts] [U]  |
| . . . . . . . . . . .   +-------------------------------------------------------------------------------+
| [ ] Command Center      |                                                                               |
| [ ] Staff Management    |                                                                               |
| [ ] Live Map            |                                                                               |
| . . . . . . . . . . .   |                                LIVE VENUE MAP                                 |
| MAP CONTROLS            |                                                                               |
| [X] Crowd Heatmap       |                                                                               |
| [X] CCTV Cameras        |               GREEN                               YELLOW                      |
| [X] Police Units        |                                                                               |
| [ ] Smart Gates         |                                                                               |
| . . . . . . . . . . .   |                                     RED                                       |
| [ ] Settings            |                                                                               |
| [ ] Logout              |                                                                               |
|                         |                                                                               |
+-------------------------+-------------------------------------------------------------------------------+
```

### 2.2 Police / Security Staff (Mobile/Desktop PWA)

```text
+-------------------------+-------------------------------------------------------------------------------+
| CROWDSHIELD (Off. 4)    |  [Search TechNova 2026...]                                      [Alerts] [U]  |
| . . . . . . . . . . .   +-------------------------------------------------------------------------------+
| [ * ] SOS EMERGENCY     |                                                                               |
| [ ! ] Incident  [U] B/U |  +--------------------------------+                                           |
| . . . . . . . . . . .   |  | PRIORITY ALERT                 |                                           |
| [ ] Dashboard           |  | Zone: Zone B (Gate 3)          |            LIVE VENUE MAP                 |
| [ ] Map View            |  |                                |                                           |
| [ ] Active Tasks        |  | Proceed to Gate 3 to manage    |                                           |
| [ ] Unit Radar          |  | crowd bottleneck.              |                                           |
| [ ] Incident Logs       |  |                                |                                           |
| . . . . . . . . . . .   |  | [ NAVIGATE TO ZONE ]           |                                           |
| ! CURRENT OBJECTIVE     |  | [ MARK ARRIVED ]               |                                           |
| Control crowd Gate 3    |  +--------------------------------+                                           |
+-------------------------+-------------------------------------------------------------------------------+
```

### 2.3 Citizen / Festival Attendee (Mobile/Desktop PWA)

```text
+-------------------------+-------------------------------------------------------------------------------+
| CROWDSHIELD (Citizen)   |  [Search venue, gates, zones...]                                [Alerts] [U]  |
| . . . . . . . . . . .   +-------------------------------------------------------------------------------+
| PUBLIC DASHBOARD        |                                                                               |
| [ ] Event Selector      |                                                                               |
| [ ] Live Map            |                                                                               |
| [ ] Alerts              |                                                                               |
| [ ] Profile             |                                LIVE VENUE MAP                                 |
| . . . . . . . . . . .   |                                                                               |
| JOURNEY PLANNER         |                                                                               |
| Where to? [Search]      |                                                                               |
| Group [4]  [Heart]      |                                                                               |
| [ FIND SAFE ROUTE ]     |                                                                               |
| . . . . . . . . . . .   |                                                                               |
| [ ] Settings            |                                                                               |
| [ ] Logout              |                                                                               |
+-------------------------+-------------------------------------------------------------------------------+
```

### 2.4 Event Organizer / Map Builder (Desktop PWA)

```text
+-------------------------+-------------------------------------------------------------------------------+
| CROWDSHIELD (Admin)     |  [Search venue, gates, zones...]                                [Alerts] [U]  |
| . . . . . . . . . . .   +-------------------------------------------------------------------------------+
| ORGANIZER DASHBOARD     |                                                                               |
| [ ] Event Management    |                                                                               |
|     - Create Event      |                                                                               |
| . . . . . . . . . . .   |                                LIVE VENUE MAP                                 |
| BUILDER TOOLS           |                                                                               |
| [ ] Venue Boundary      |                                                                               |
| [ ] Crowd Zones         |                                                                               |
| [ ] Smart Gates         |                                                                               |
| [ ] Flow Routes         |                                                                               |
| [ ] Infrastructure      |                                                                               |
| . . . . . . . . . . .   |                                                                               |
| [ ] Settings            |                                                                               |
| [ ] Logout              |                                                                               |
+-------------------------+-------------------------------------------------------------------------------+
```

---

## 3. Smart Gate Status UI

The map and dashboards show gate status with clear color coding:

| Gate Status | Visual Indicator |
| :--- | :--- |
| NORMAL | 🟢 Green gate icon |
| HIGH_FLOW | 🟡 Amber gate icon, pulse animation |
| CONGESTED | 🟠 Orange gate icon, warning badge |
| CRITICAL | 🔴 Red gate icon, flashing |
| CLOSED | ⚫ Gray gate icon, X overlay |
| EMERGENCY_ONLY | 🔵 Blue gate icon, emergency badge |
| OFFLINE | ⚪ Gray gate icon, disconnect badge |

---

## 4. Source Health Panel

The Authority dashboard includes a Source Health panel showing all active data sources:

```
+-----------------------------+
| DATA SOURCE HEALTH          |
+-----------------------------+
| CCTV-01    ONLINE    98%    |
| CCTV-02    ONLINE    95%    |
| CCTV-03    DELAYED   72%    |
| SG-01      ONLINE    99%    |
| SG-02      ONLINE    97%    |
| SG-03      OFFLINE    0%    |
| GPS        ONLINE    85%    |
| Drone-01   OFFLINE    0%    |
| Telecom    SIMULATED  --    |
+-----------------------------+
| Active Sources: 5/9         |
| Fusion Confidence: 89%      |
+-----------------------------+
```

---

## 5. Real-Time Language Switching (i18next)

When a citizen opens the PWA, their device locale determines the language. Broadcasted emergency instructions are pushed over WebSockets and rendered natively in **English, Hindi, Odia, or additional Indian languages** instantly.

Messages are short and safety-focused: "Please avoid Gate 3. Use Gate 5."


---

## 6. POLICE DASHBOARD

Police interface should show:

* Assigned events
* Live map
* High-risk zones
* Incident locations
* Recommended deployment
* Safest route
* Emergency route
* Nearby police units
* Tasks
* Alerts
* Incident acknowledgement
* Incident resolution

---

## 7. AUTHORITY DASHBOARD

Authority dashboard should show:

* All active events
* Event risk
* Live map
* Crowd heatmap
* Zone risk
* Gate status
* Route status
* Incidents
* Security deployment
* AI recommendations
* Historical analytics
* System health
* Data source health

### 7.1 Authority Intervention Modal (Explainability & Approval)
When the AI Risk Engine generates a recommendation, the Authority sees this modal:
```text
+-------------------------------------------------------------+
| ⚠️ AI RECOMMENDATION: CRITICAL RISK IN ZONE B              |
+-------------------------------------------------------------+
| Action: [ RESTRICT GATE 3 ]                                 |
|                                                             |
| 🧠 Why is this recommended?                                 |
| Primary Reason: Flow conflict detected at Gate 3 entry.     |
| Supporting Factors:                                         |
|  • Zone B density approaching critical threshold (3.8 p/m2) |
|  • Sudden influx of 400 people detected via CCTV-02         |
|                                                             |
| Confidence: 94% | Based on 3 active sources                 |
|                                                             |
| [ DECLINE ]                             [ APPROVE ACTION ]  |
+-------------------------------------------------------------+
```

---

## 8. EVENT OWNER DASHBOARD

Event Owner should see:

* Event status
* Crowd count
* Occupancy
* Gate flow
* Zone conditions
* Route status
* Incidents
* Infrastructure status
* Pre-event simulation
* Event analytics

---

## 9. CITIZEN PWA

Citizen interface should remain simple.

Show:

* Event map
* Current congestion
* Safety alerts
* Safe route
* Emergency information
* Incident reporting
* Multilingual notifications

Do not expose sensitive operational information.

---

## 10. CITIZEN JOURNEY PLANNER WIREFRAME (Sidebar Integrated)

### Journey Input State (Inside Global Sidebar)
```text
+-------------------------+
| JOURNEY PLANNER         |
|                         |
| Where to?               |
| [🔍 Maha Kumbh Mela  ]  |
|                         |
| Group          [Heart]  |
| [👥 4]         [Pulse]  |
|                         |
| [ FIND SAFE ROUTE ]     |
+-------------------------+
```

### Route Results & Navigation State (Inside Global Sidebar)
```text
+-------------------------+
| JOURNEY PLANNER         |
|                         |
| [✓] SAFE ROUTE          |
| [  25 MIN  ]            |
|                         |
| Start: Current Loc      |
| Gate:  Gate G5          |
|                         |
| [ START NAVIGATION ]    |
| [ Cancel ]              |
+-------------------------+
```

### Group Coordination Screen
```
+--------------------------------+
| 👥 Group: Sharma Family (4)    |
+--------------------------------+
| ┌──────────────────────────┐   |
| │ MAP                      │   |
| │ 👤 Dad ── 📍 You         │   |
| │ 👤 Mom 50m behind        │   |
| │ 👤 Kid with Dad          │   |
| └──────────────────────────┘   |
|                                 |
| Dad: 200m ahead ✓              |
| Mom: 50m behind ⚠️             |
| Kid: With Dad ✓                |
|                                 |
| 💡 Mom is falling behind.      |
|    Wait at next landmark       |
|    (Temple, 100m ahead)        |
|                                 |
| [📍 Share My Location]         |
| [📢 Call Group]                |
+--------------------------------+
```

### Exit Planner Screen
```
+--------------------------------+
| 🚪 EXIT PLANNER                |
+--------------------------------+
| Best exit for you:             |
|                                 |
| 🟢 Gate G4 — East Exit         |
| Queue: 2 min (8 people)        |
| Route: 400m, clear             |
|                                 |
| Other options:                  |
| Gate G5 — 5 min queue          |
| Gate G1 — 8 min queue          |
|                                 |
| Route to your destination:      |
| Gate G4 → Route R6 → NH-27     |
| Time: 25 min to reach home     |
|                                 |
| [🧭 Navigate to Gate G4]       |
+--------------------------------+

---

