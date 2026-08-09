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
* 🗺️ **Central Map Engine:** The Leaflet instance is the hero component for every view.

---

## 2. Role-Based Wireframes

### 2.1 Authority Command Center (Desktop PWA)

```
+---------------------------------------------------------------------------------------------------------+
| CrowdShield     [Event: Rath Festival 2026]                          [Alerts] [Cmdr. Sharma]          |
+---------------------------------------------------------------------------------------------------------+
|  CONTROLS         |                                                               |  AI ALERTS          |
|                   |                                                               |                     |
|  [X] Heatmap      |                       LIVE VENUE MAP                          |  Zone C - CRITICAL  |
|  [X] CCTV Cams    |                                                               |  Risk: 87/100       |
|  [X] Smart Gates  |                GREEN              YELLOW                      |  ETA: 8 min         |
|  [X] Police       |                                                               |                     |
|  [X] Routes       |                           RED                                 |  RECOMMENDATION     |
|  [ ] Incidents    |                                                               |                     |
|  [ ] Source Health |                                                               |  Restrict Gate G3   |
|                   |                                                               |  Open Gate G5       |
|                   |                                                               |  Deploy 6 Police    |
|                   |                                                               |                     |
|                   |                                                               |  [ APPROVE PLAN ]   |
+-------------------+---------------------------------------------------------------+---------------------+
| Density: 4.2 p/m2 | Flow Conflict: YES | Active Police: 142/150 | Sources: 5/6 ONLINE              |
+---------------------------------------------------------------------------------------------------------+
```

### 2.2 Police / Security Staff (Mobile PWA)

```
+--------------------------------+
| Security Mode       [Off. 4]   |
+--------------------------------+
| PRIORITY ALERT                |
|                               |
| Zone C                        |
| 120m away                     |
| Risk: CRITICAL                |
|                               |
| TASK                          |
| Control crowd near Gate 3.    |
|                               |
| Required: 6 officers          |
| Assigned: 4                   |
|                               |
| [ NAVIGATE TO ZONE ]          |
| [ MARK ARRIVED ]              |
+--------------------------------+
|       +----------------+       |
|       | YOU       ^    |       |
|       |          |120m |       |
|       |     ZONE C     |       |
|       +----------------+       |
+--------------------------------+
```

### 2.3 Citizen / Festival Attendee (Mobile PWA)

```
+--------------------------------+
| CrowdShield           [User]   |
+--------------------------------+
| You are here                   |
| YOUR AREA IS SAFE              |
|                               |
|       +----------------+       |
|       |    MAP         |       |
|       |     GREEN      |       |
|       |         YELLOW |       |
|       +----------------+       |
|                               |
| Congestion ahead              |
| Gate 3 is currently busy.     |
| Please use Gate 4.            |
|                               |
| [ VIEW SAFE ROUTE ]           |
| [ REPORT SOS INCIDENT ]       |
+--------------------------------+
| Home   Alerts   Profile       |
+--------------------------------+
```

### 2.4 Event Organizer / Admin (Desktop PWA)

```
+---------------------------------------------------------------------------------------------------------+
| CrowdShield Admin                                                     [Event Manager]                   |
+---------------------------------------------------------------------------------------------------------+
|  CONFIGURE EVENT: Rath Festival 2026                                                                    |
|                                                                                                         |
|  [ EVENT DETAILS ]  [ VENUE MAP ]  [ ZONES & GATES ]  [ ROUTES ]  [ CAMERAS ]  [ SMART GATES ]         |
|                                                                                                         |
|       +-------------------------------------------------------------+                                   |
|       |                               G1                            |  +-----------------------------+  |
|       |                               ↓                             |  | EDIT ZONE C                 |  |
|       |                     +--------------------+                  |  |                             |  |
|       |                 G2 ->|      ZONE A        |<- G3            |  | Max Capacity: 1500          |  |
|       |                     |                    |                  |  | Connected Cams: C1, C4      |  |
|       |                     +----------+---------+                  |  | Smart Gate: SG-03           |  |
|       |                     | ZONE B   | ZONE C  |                  |  | Connected Routes: R1, R4    |  |
|       |                     |          |         |                  |  |                             |  |
|       |                     +----------+---------+                  |  | [ SAVE ] [ DELETE ]         |  |
|       |                     |      ZONE D        |                  |  +-----------------------------+  |
|       |                     +--------------------+                  |                                   |
|       |                     └───G4──────────G5───┘                  |                                   |
|  +----+----+                                                                              +----------+ |
|  | GPS ROUTE RECORDER                                                                     | SIMULATE | |
|  | [Start Recording] [Stop] [Edit Route]                                                  | [RUN]    | |
+---------------------------------------------------------------------+----------------------+----------+-+
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
