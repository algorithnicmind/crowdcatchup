# User Interface (UI) Specifications & Wireframe Mapping
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** UI Design Tokens, Psychological Architecture & Screen Wireframes  
**Document Version:** 2.0 (Monorepo/PWA Architecture Release)  

---

## 1. UI Design Psychology & Aesthetic Foundation

CrowdShield emphasizes **Rich Aesthetics and Dynamic Design** using Next.js, Tailwind CSS, and `shadcn/ui`. The UI must wow the user with a premium, state-of-the-art feel, utilizing sleek dark modes, vibrant alerts, and smooth micro-animations.

* 🟢 **Safe (Emerald):** `#10b981`. Signifies normal fluidity ($<2.0\text{ p/m}^2$).
* 🟡 **Surge Warning (Amber):** `#f59e0b`. Signifies developing queue congestion.
* 🔴 **Critical Hazard (Crimson):** `#ef4444`. Immediate danger/bottleneck coordinates.
* 🗺️ **Central Map Engine:** The Mapbox/Leaflet instance is the hero component for almost every view. It is not hidden behind menus; it is the primary workspace.

---

## 2. Role-Based Wireframes (The 4 Personas)

Because CrowdShield is a unified PWA, users log in and are routed to their role-specific experience.

### 2.1 👮 Authority Command Center (Desktop PWA)
The Authority needs comprehensive visibility and decision-making power.

```
+---------------------------------------------------------------------------------------------------------+
| 🛡️ CrowdShield     [Event: Rath Festival 2026]                          [🔔 Alerts] [👤 Cmdr. Sharma] |
+---------------------------------------------------------------------------------------------------------+
|  CONTROLS         |                                                               |  AI ALERTS          |
|                   |                                                               |                     |
|  [X] Heatmap      |                       LIVE VENUE MAP                          |  🔴 Zone C          |
|  [X] CCTV Cams    |                                                               |  Risk: 87 / 100     |
|  [X] Police       |                🟢                      🟡                     |  ETA: 8 min         |
|  [X] Gates        |                                                               |                     |
|  [ ] Safe Routes  |                           🔴                                  |  RECOMMENDED ACTION |
|  [ ] Incidents    |                                                               |                     |
|                   |                                                               |  ✓ Open Gate G4     |
|                   |                                                               |  ✓ Deploy 6 Police  |
|                   |                                                               |                     |
|                   |                                                               | [ APPROVE PLAN ]    |
+-------------------+---------------------------------------------------------------+---------------------+
| 📊 Analytics:  Density: 4.2 p/m²  |  Flow Conflict: YES  |  Active Police: 142 / 150                    |
+---------------------------------------------------------------------------------------------------------+
```

### 2.2 🛡️ Police / Security Staff (Mobile PWA)
Police do not need the giant control-room dashboard. They need to know where to go.

```
+--------------------------------+
| 🛡️ Security Mode    [👤 Off. 4]|
+--------------------------------+
| 🚨 PRIORITY ALERT              |
|                                |
| Zone C                         |
| 120m away                      |
| Risk: 🔴 CRITICAL              |
|                                |
| TASK                           |
| Control crowd near Gate 3.     |
|                                |
| 👥 Required: 6 officers        |
| 👮 Assigned: 4                 |
|                                |
| [ NAVIGATE TO ZONE ]           |
| [ MARK ARRIVED ]               |
+--------------------------------+
|       +----------------+       |
|       | YOU 👮   ↑     |       |
|       |          │120m |       |
|       |     🔴 ZONE C  |       |
|       +----------------+       |
+--------------------------------+
```

### 2.3 👤 Citizen / Festival Attendee (Mobile PWA)
Citizens should see none of the complicated AI information (e.g., Risk Score: 87, Density Growth: 17%). That causes panic. They need simple, localized routing.

```
+--------------------------------+
| 🛡️ CrowdShield        [👤 User]|
+--------------------------------+
| 📍 You are here                |
| 🟢 YOUR AREA IS SAFE           |
|                                |
|       +----------------+       |
|       |    MAP         |       |
|       |     🟢         |       |
|       |         🟡     |       |
|       +----------------+       |
|                                |
| ⚠️ Congestion ahead            |
| Gate 3 is currently busy.      |
| Please use Gate 4.             |
|                                |
| [ VIEW SAFE ROUTE ]            |
| [ REPORT SOS INCIDENT ]        |
+--------------------------------+
| 🏠 Home   🔔 Alerts   👤 Profile|
+--------------------------------+
```

### 2.4 🧑‍💼 Event Organizer / Admin (Desktop PWA)
The Admin configures the system before the event starts.

```
+---------------------------------------------------------------------------------------------------------+
| 🛡️ CrowdShield Admin                                                              [👤 Event Manager]  |
+---------------------------------------------------------------------------------------------------------+
|  CONFIGURE EVENT: Rath Festival 2026                                                                    |
|                                                                                                         |
|  [ EVENT DETAILS ]    [ VENUE MAP ]    [ ZONES & GATES ]    [ CAMERAS ]    [ POLICE ASSIGNMENT ]        |
|                                                                                                         |
|       +-------------------------------------------------------------+                                   |
|       |                               G1                            |  +-----------------------------+  |
|       |                               ↓                             |  | EDIT ZONE C                 |  |
|       |                     +--------------------+                  |  |                             |  |
|       |                 G2 →|      ZONE A        |← G3              |  | Max Capacity: 1500          |  |
|       |                     |                    |                  |  | Connected Cams: C1, C4      |  |
|       |                     +----------+---------+                  |  |                             |  |
|       |                     | ZONE B   | ZONE C  |                  |  | [ SAVE ] [ DELETE ]         |  |
|       |                     |          |         |                  |  +-----------------------------+  |
|       |                     +----------+---------+                  |                                   |
|       |                     |      ZONE D        |                  |                                   |
|       |                     +--------------------+                  |                                   |
|       |                     └───G4──────────G5───┘                  |                                   |
+---------------------------------------------------------------------+-----------------------------------+
```

---

## 3. Real-Time Language Switching (i18next)
When a citizen opens the PWA, their device locale determines the language. Broadcasted emergency instructions generated by GenAI are pushed over WebSockets and rendered natively in **English, Hindi (`hi`), Marathi (`mr`), or Tamil (`ta`)** instantly.
