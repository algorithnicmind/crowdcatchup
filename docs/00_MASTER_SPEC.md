# CROWDShield — Master System Specification

## 1. PROJECT TITLE

**CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events**

---

# 2. PROJECT PURPOSE

CrowdShield is an AI-powered event crowd-safety platform designed specifically for **large public gatherings and events**.

The primary objective is to detect dangerous crowd conditions **before they develop into crowd crushes or stampedes** and provide actionable recommendations to authorities, police and event organizers.

CrowdShield must not be designed merely as a CCTV monitoring dashboard.

The core concept is:

> **Create an event-specific digital representation of the venue and continuously combine multiple independent crowd-data sources into a unified Crowd Data Fusion Hub. Use the resulting crowd state to predict risk and recommend preventive interventions.**

The system must be resilient.

No single sensor/source should be treated as permanently reliable.

If CCTV fails, GPS or Smart Gates may still provide information.

If telecom data is unavailable, CCTV + Smart Gates + other sources can continue.

If a drone is unavailable, the system must continue operating.

---

# 3. PRIMARY SCOPE

CrowdShield primarily manages:

* Religious gatherings
* Festivals
* Melas
* Rath Yatra/processions
* Concerts
* Sports events
* Cultural events
* Political/public gatherings
* Exhibitions
* Large temporary public events

The primary scope is **event crowd safety**.

Do NOT turn the project into a general city-wide traffic management system.

Traffic/transport information may be added later as an external supporting signal, but event crowd safety remains the core product.

---

# 4. CORE USERS

The system uses one PWA/application ecosystem with role-based interfaces.

There are four primary user roles:

## 4.1 Authority

Responsible for:

* Monitoring multiple events
* Monitoring overall risk
* Viewing live crowd maps
* Viewing incidents
* Approving interventions
* Deploying/reallocating police/security resources
* Managing emergency responses
* Viewing analytics
* Reviewing historical incidents
* Managing event-level permissions

## 4.2 Police/Security

Responsible for:

* Viewing assigned event
* Viewing high-risk zones
* Receiving alerts
* Viewing incidents
* Receiving deployment recommendations
* Viewing safest routes
* Updating incident status
* Confirming field actions
* Reporting field conditions

## 4.3 Event Owner/Organizer

Responsible for:

* Creating events
* Configuring event details
* Defining venue boundary
* Creating zones
* Defining entries/exits
* Configuring Smart Gates
* Creating routes
* Recording routes using GPS
* Creating temporary routes
* Adding emergency routes
* Registering cameras/sensors
* Configuring capacities
* Running pre-event simulations
* Monitoring event status
* Managing event infrastructure

## 4.4 Citizen

Responsible for:

* Viewing event information
* Receiving congestion/safety alerts
* Receiving location-based warnings
* Viewing safe routes
* Reporting incidents
* Optionally sharing location with permission
* Receiving multilingual announcements

Citizens must NOT receive sensitive authority/police operational information.

---

# 5. PWA REQUIREMENT

CrowdShield must primarily be implemented as a **Progressive Web App (PWA)**.

The PWA should provide:

* Responsive UI
* Desktop support
* Mobile support
* Installability
* Push notifications where supported
* Offline-friendly capabilities
* Service worker
* Cached critical information
* Role-based dashboards
* Map-based interfaces

However, do not assume a PWA can perform unrestricted background GPS or Bluetooth scanning.

Where advanced native capabilities are required in the future, design the architecture so a native companion application/SDK can be added without rewriting the backend.

---

# 6. EVENT-FIRST ARCHITECTURE

CrowdShield begins with an event.

The lifecycle is:

CREATE EVENT
→ DEFINE VENUE
→ DEFINE EVENT AREA
→ CREATE ZONES
→ CREATE ENTRY/EXIT POINTS
→ CONFIGURE SMART GATES
→ CREATE ROUTES
→ CREATE EMERGENCY ROUTES
→ ADD CAMERAS
→ ADD OTHER DATA SOURCES
→ CONFIGURE CAPACITIES
→ VALIDATE VENUE
→ RUN SIMULATION
→ PUBLISH EVENT
→ LIVE MONITORING
→ RISK PREDICTION
→ INTERVENTION
→ POST-EVENT ANALYTICS

Every data point must belong to an event.

---

# 7. EVENT CREATION

Event Owner must be able to create:

* Event name
* Event type
* Description
* Date
* Start time
* End time
* Expected total attendance
* Maximum configured venue/zone capacities
* Emergency contacts
* Organizer details
* Venue
* Event status

Event statuses:

* Draft
* Configuration
* Ready
* Live
* Paused
* Completed
* Cancelled
* Archived

---

# 8. EVENT MAP / VENUE BUILDER

The system must provide a dedicated event map builder.

The map has two conceptual layers:

## Base Geographic Layer

Provided by a suitable mapping provider.

Contains:

* Roads
* Buildings
* Geographic features
* Existing paths
* Normal geographic information

## CrowdShield Operational Event Layer

CrowdShield-owned data containing:

* Event boundary
* Zones
* Entry gates
* Exit gates
* Smart Gates
* Temporary roads
* Temporary routes
* Emergency routes
* Police posts
* Medical camps
* Barricades
* Restricted zones
* CCTV cameras
* Drone areas
* Sensors
* Live crowd
* Heatmaps
* Risk zones

The Event Manager must NOT be limited to whatever routes the normal map provider knows.

---

# 9. EVENT BOUNDARY

Event Owner must be able to:

* Select a location
* Search a location
* Draw polygon
* Edit polygon
* Add/remove boundary points
* Save event boundary

The boundary defines the operational event area.

---

# 10. ZONE BUILDER

Event Owner can divide the venue into operational zones.

Each zone should have:

* Zone ID
* Name
* Polygon
* Area
* Maximum safe capacity
* Warning threshold
* Critical threshold
* Connected routes
* Connected gates
* Sensors
* Cameras
* Risk level

Example:

ZONE-A
ZONE-B
ZONE-C
ZONE-D

---

# 11. CUSTOM ROUTE SYSTEM

This is a core feature.

CrowdShield must support routes that do not exist in the normal geographic map.

The Event Owner can:

* Draw a route manually
* Edit route
* Delete route
* Create one-way route
* Create two-way route
* Create emergency-only route
* Create police-only route
* Create temporary route
* Activate/deactivate route
* Define route capacity
* Connect route to zones
* Connect route to gates

---

# 12. GPS ROUTE RECORDING

Event Owner should have:

**"Record Route"**

The Event Owner can physically move along a route using a phone.

The application collects GPS points with appropriate permission.

GPS trajectory:

Location points
→ route processing
→ smoothing/map matching
→ route generation
→ editable route

After recording, the Event Owner can manually edit the route.

Do not assume GPS is perfectly accurate.

---

# 13. TEMPORARY EVENT INFRASTRUCTURE

The system must support temporary event infrastructure.

Examples:

* Temporary gate
* Temporary road
* Temporary route
* Temporary barricade
* Temporary exit
* Temporary police post
* Temporary medical camp
* Temporary restricted area

Each temporary object should support:

* Start time
* End time
* Status
* Capacity
* Location
* Owner
* Notes

---

# 14. SMART GATE SYSTEM

Smart Gates are a core CrowdShield data source.

A Smart Gate can use:

* AI camera counting
* Stereo camera
* IR counting
* LiDAR
* Turnstile
* RFID
* QR scanning
* Existing venue access-control systems

The system should be hardware-agnostic.

Each Smart Gate should produce data such as:

* Gate ID
* Event ID
* Zone ID
* Timestamp
* Entry count
* Exit count
* Current flow rate
* Queue estimate
* Configured capacity
* Direction
* Device health
* Confidence

Example:

Gate G01:

Entry = 124/min
Exit = 32/min
Net = +92/min
Status = HIGH FLOW
Confidence = 0.94

---

# 15. SMART GATE STATUS

Possible statuses:

* NORMAL
* HIGH_FLOW
* CONGESTED
* CRITICAL
* CLOSED
* EMERGENCY_ONLY
* OFFLINE

The UI should clearly communicate gate status.

---

# 16. GATE-ZONE-ROUTE RELATIONSHIP

Every gate must be associated with:

* One or more zones
* One or more routes
* Entry/exit direction
* Configured capacity

Example:

GATE-03
→ ZONE-B
→ ROUTE-R04
→ EXIT-02

This allows the system to predict downstream crowd impact.

---

# 17. DATA SOURCES

CrowdShield must support multiple data sources.

## Core sources

1. CCTV
2. Smart Gates
3. Citizen GPS
4. Venue/entry systems

## Advanced sources

5. Drone
6. BLE/proximity sensing
7. Aggregated telecom data
8. Wearable/IoT sensors

## Development/testing sources

9. Synthetic data
10. Historical datasets
11. Replay data

All sources must enter through the same data-ingestion architecture.

---

# 18. CCTV SOURCE

CCTV processing should support:

* RTSP/live streams where available
* Recorded video replay
* Camera registration
* Camera-to-zone mapping
* Person detection
* Person tracking
* Density estimation
* Movement speed
* Direction
* Queue estimation
* Crowd anomaly detection

Recommended initial computer vision stack:

* YOLO-family object detection model
* Tracking algorithm
* OpenCV
* Python
* GPU acceleration where available

For the hackathon, recorded video can simulate live CCTV.

The architecture must remain compatible with real-time streams.

---

# 19. CITIZEN GPS

Citizens may voluntarily provide location with explicit permission.

Use GPS primarily for:

* Zone-level participating crowd estimation
* Movement trends
* Route usage
* Congestion indication
* Location-based alerts

Avoid unnecessary collection of personally identifiable movement history.

Prefer aggregation:

Individual location
→ zone mapping
→ aggregated count
→ crowd state

Do not design the system around secretly tracking individuals.

---

# 20. TELECOM DATA

Telecom data is a future/partner integration.

Potential future sources:

* Airtel
* Jio
* Vi
* Other authorized telecom operators

CrowdShield must NOT assume that individual subscriber location is automatically available.

Design for authorized aggregated/anonymized data such as:

* Zone
* Estimated device count
* Timestamp
* Movement trend
* Confidence

Example:

ZONE-B
Estimated connected devices: 8,400
Trend: +18%
Confidence: 0.72

The architecture must use an adapter/gateway so telecom providers can be integrated later without changing the fusion engine.

---

# 21. DRONE DATA

Drone may provide aerial video.

Potential pipeline:

Drone
→ Video stream
→ Detection
→ Tracking
→ Density
→ Flow
→ Zone mapping
→ Data Hub

For hackathon development, use recorded drone footage or simulated drone observations.

Future production deployments must respect applicable drone regulations and permissions.

---

# 22. BLE DATA

Do NOT assume a PWA can automatically scan all nearby phones.

CrowdShield should support BLE only through technically and legally appropriate mechanisms, such as:

* Authorized BLE infrastructure
* BLE gateways
* Participating devices
* Venue-installed scanners

BLE should be treated as a supporting signal.

It must not be represented as a guaranteed count of every phone in the area.


# 24. SYNTHETIC DATA

Synthetic data is a first-class development source.

Create simulation generators for:

* Crowd count
* Density
* Flow
* Speed
* Gate entry
* Gate exit
* GPS participation
* Telecom estimate
* Drone estimate
* BLE estimate
* Sensor failures
* Sudden crowd surges

Synthetic data must use the same ingestion pipeline as real sources.

This is critical.

The architecture should not have a completely separate "fake data system."

Instead:

REAL SOURCE
and
SIMULATED SOURCE

must both produce the same standardized observation format.

---

# 25. CROWD DATA FUSION HUB

This is one of the most important components of CrowdShield.

The Crowd Data Fusion Hub performs:

1. Data ingestion
2. Normalization
3. Validation
4. Timestamp synchronization
5. Geospatial mapping
6. Source health assessment
7. Confidence calculation
8. Deduplication/overlap handling
9. Sensor fusion
10. Crowd-state generation

---

# 26. STANDARD OBSERVATION FORMAT

Every source should produce a standardized observation.

Example:

```json
{
  "event_id": "EVT-001",
  "source_id": "CCTV-07",
  "source_type": "CCTV",
  "zone_id": "ZONE-B",
  "timestamp": "2026-08-09T17:05:10Z",
  "metric": "people_count",
  "value": 1240,
  "confidence": 0.91,
  "latency_ms": 300,
  "health": "ONLINE"
}
```

Smart Gate:

```json
{
  "event_id": "EVT-001",
  "source_id": "SG-03",
  "source_type": "SMART_GATE",
  "gate_id": "G-03",
  "timestamp": "2026-08-09T17:05:11Z",
  "metric": "entry_rate",
  "value": 142,
  "confidence": 0.94,
  "health": "ONLINE"
}
```

---

# 27. EVENT ISOLATION

Every observation must contain an event identifier.

Never mix:

Event A
with
Event B.

The system must enforce:

EVENT
→ VENUE
→ ZONE/GATE/ROUTE
→ SOURCE
→ OBSERVATION

This is a fundamental data-integrity rule.

---

# 28. SOURCE HEALTH MONITORING

CrowdShield must know whether a source is functioning.

Example:

CCTV-01 → ONLINE
CCTV-02 → DELAYED
SmartGate-03 → ONLINE
Drone-01 → OFFLINE
Telecom → DELAYED

Source health should influence confidence.

If a source stops sending data, its influence in the fusion layer should decrease.

---

# 29. SOURCE CONFIDENCE

Every source observation must have a confidence score.

Confidence can consider:

* Accuracy
* Freshness
* Latency
* Historical reliability
* Coverage
* Sensor health
* Data completeness

Never blindly trust a single source.

---

# 30. SENSOR FUSION

Do NOT add source counts together.

Example:

CCTV = 1,200
GPS = 1,000
Telecom = 1,400
Drone = 1,300

These represent overlapping populations.

The fusion engine must estimate the underlying crowd state.

Initial implementation may use confidence-weighted estimation.

Future implementations may use:

* Bayesian fusion
* Kalman filtering
* Probabilistic models
* Learned sensor fusion
* Temporal models

---

# 31. SENSOR DISAGREEMENT DETECTION

If:

CCTV = 2,500
GPS = 1,200
Telecom = 1,300
Drone = 1,350

CrowdShield should detect:

**Possible CCTV anomaly**

and reduce confidence instead of automatically declaring the crowd count to be 2,500.

---

# 32. CROWD STATE

The Fusion Hub should produce one unified crowd state.

Example:

```json
{
  "event_id": "EVT-001",
  "zone_id": "ZONE-B",
  "estimated_people": 1280,
  "density_level": "HIGH",
  "average_speed": 0.34,
  "flow_direction": "NORTH",
  "entry_rate": 165,
  "exit_rate": 52,
  "bottleneck_score": 0.87,
  "risk_score": 86,
  "risk_level": "CRITICAL",
  "confidence": 0.89
}
```

The rest of the platform should primarily consume this Crowd State instead of directly depending on individual sensor formats.

---

# 33. CROWD ANALYTICS

The system must estimate:

* Crowd density
* Crowd size
* Average speed
* Flow direction
* Entry rate
* Exit rate
* Queue length
* Zone occupancy
* Route utilization
* Gate utilization
* Bottlenecks
* Reverse flow
* Flow conflict
* Sudden surge
* Abnormal movement

---

# 34. RISK ENGINE

Risk prediction should consider:

* Density
* Density growth rate
* Crowd speed
* Speed reduction
* Entry/exit imbalance
* Gate flow
* Zone capacity
* Route capacity
* Bottleneck score
* Direction conflicts
* Reverse movement
* Sudden surge
* Route blockage
* Historical patterns
* Weather/environmental signals where available
* Sensor confidence

The system should produce:

Current risk
and
Predicted future risk.

---

# 35. PREDICTION HORIZON

The system should aim to predict:

* Next few minutes
* Approximately 5 minutes
* Approximately 10 minutes
* Approximately 15 minutes

The exact prediction horizon must be configurable and evaluated using actual model performance.

Never claim guaranteed prediction.

Use probabilistic risk.

---

# 36. RISK LEVELS

Use:

🟢 LOW
🟡 MODERATE
🟠 HIGH
🔴 CRITICAL

Risk should be zone-specific.

Example:

ZONE-A → LOW
ZONE-B → CRITICAL
ZONE-C → HIGH
ZONE-D → LOW

---

# 37. DECISION ENGINE

The system must not stop at:

"Risk = 85."

It must translate risk into possible interventions.

Examples:

* Open alternate gate
* Restrict entry gate
* Redirect incoming crowd
* Activate one-way flow
* Close route
* Open emergency route
* Deploy police
* Move security personnel
* Change barricade configuration
* Broadcast announcement
* Send citizen alert
* Recommend medical deployment

---

# 38. HUMAN-IN-THE-LOOP

CrowdShield is a decision-support system.

AI recommends.

Authorized humans approve or execute.

Do not design the MVP to autonomously control public infrastructure without authorization.

Example:

AI:
"Recommend restricting G3."

Authority:
APPROVE

Then:

System:
"Intervention recorded."

---

# 39. RECOMMENDATION EXPLANATION

Every AI recommendation must explain why.

Example:

**Recommendation: Restrict Gate G3**

Reason:

* Zone B density increased 24% in 4 minutes
* Entry rate exceeds configured threshold
* Exit rate is declining
* Route R4 is approaching capacity
* Independent sources agree with high confidence

This makes the AI explainable.

---

# 40. POLICE DASHBOARD

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

# 41. AUTHORITY DASHBOARD

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

---

# 42. EVENT OWNER DASHBOARD

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

# 43. CITIZEN PWA

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

# 44. MAP REQUIREMENTS

The map is a core system component.

It should support:

* Event boundary
* Zones
* Gates
* Routes
* Emergency routes
* Police locations
* Medical locations
* Cameras
* Smart Gates
* Crowd heatmap
* Risk heatmap
* Live crowd indicators
* Incidents
* Temporary infrastructure
* Route status

---

# 45. DIGITAL TWIN

The event map should evolve into a lightweight Digital Twin.

The Digital Twin represents:

* Venue geometry
* Zones
* Routes
* Gates
* Infrastructure
* Sensors
* Crowd state
* Risk
* Event configuration

It should support simulation before and during events.

---

# 46. PRE-EVENT SIMULATION

Event Owner should be able to run scenarios.

Examples:

### Scenario A

Normal crowd arrival.

### Scenario B

Gate G3 receives sudden high inflow.

### Scenario C

Route R2 becomes blocked.

### Scenario D

Gate G4 becomes unavailable.

### Scenario E

Zone B experiences sudden crowd surge.

The simulation should show:

* Crowd movement
* Zone occupancy
* Bottleneck
* Risk
* Alternative routes
* Recommended interventions

---

# 47. MULTILINGUAL COMMUNICATION

The system should support multilingual alerts.

Architecture should allow:

* English
* Hindi
* Odia
* Additional Indian languages later

Messages should be short and safety-focused.

Example:

"Please avoid Gate 3. Use Gate 5."

AI may generate incident summaries and recommended announcements, but safety-critical messages should use controlled templates and human approval where appropriate.

---

# 48. GENERATIVE AI

Use Generative AI for:

* Incident summaries
* Authority reports
* Event summaries
* Natural-language dashboard queries
* Multilingual announcement drafts
* Explanation of risk
* Event post-analysis

Do not let generative AI directly override deterministic safety controls.

---

# 49. VOICE COMMAND CENTER

Future/bonus feature:

Authority can ask:

"Which zone currently has the highest risk?"

System:

"Zone B has the highest current risk."

Or:

"Which gate should receive more security?"

System provides an explainable recommendation.

---

# 50. OFFLINE / NETWORK FAILURE

The system must be resilient.

Possible failures:

* Internet outage
* CCTV disconnection
* GPS unavailable
* Telecom unavailable
* Drone unavailable
* Sensor failure
* Server connectivity problems

The system should support:

* Local buffering
* Eventual synchronization
* Cached map
* Last-known state
* Source health status
* Degraded operation

Do not pretend the entire cloud system can operate normally without connectivity.

Instead implement graceful degradation.

---

# 51. SECURITY

Implement:

* Authentication
* Authorization
* RBAC
* Strong password handling
* JWT/session security
* HTTPS
* Encryption in transit
* Encryption at rest where appropriate
* API validation
* Rate limiting
* Audit logging
* Secure file uploads
* Input validation
* Secrets management
* Security headers
* CORS configuration
* Logging
* Monitoring

Roles must be enforced on the backend, not only in the frontend.

---

# 52. PRIVACY

The system deals with potentially sensitive:

* Location
* Video
* Device information
* Telecom-derived information
* Potential wearable signals

Therefore:

* Minimize personal data
* Prefer aggregation
* Use consent where required
* Avoid unnecessary identity tracking
* Define retention policies
* Restrict access
* Audit access
* Separate operational data from personally identifiable information
* Do not store raw data indefinitely
* Provide appropriate deletion/retention mechanisms

Core principle:

> **Estimate the crowd, not unnecessarily track the person.**

---

# 53. TECHNICAL ARCHITECTURE

Recommended initial stack:

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* PWA support
* Mapbox/MapLibre/OpenStreetMap-compatible mapping architecture
* Recharts/ECharts for analytics

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* PostgreSQL
* PostGIS
* Redis

## AI/ML

* Python
* PyTorch
* OpenCV
* YOLO-family detector
* Tracking algorithm
* scikit-learn where appropriate

## Real-time

* WebSockets
* Redis Pub/Sub or Redis Streams initially

Future scalability:

* Kafka
* Dedicated stream processing

## Storage

* PostgreSQL/PostGIS
* Object storage for video/images
* Redis for live state/cache

## Deployment

Design for:

* Docker
* AWS
* Managed PostgreSQL
* Object storage
* Redis
* Container deployment
* Monitoring

Do not over-engineer the MVP with unnecessary microservices.

Start modular monolith + clearly separated services/modules.

---

# 54. BACKEND MODULES

Recommended modules:

```text
auth
users
organizations
events
venues
zones
gates
routes
sensors
data_ingestion
data_normalization
data_validation
source_health
sensor_fusion
crowd_state
analytics
risk_engine
recommendations
incidents
alerts
notifications
police
simulation
digital_twin
reports
audit
```

Keep business logic separated.

---

# 55. DATA PIPELINE

Standard architecture:

```text
SOURCE
 ↓
ADAPTER
 ↓
INGESTION
 ↓
NORMALIZATION
 ↓
VALIDATION
 ↓
GEO MAPPING
 ↓
SOURCE HEALTH
 ↓
CONFIDENCE
 ↓
FUSION
 ↓
CROWD STATE
 ↓
RISK
 ↓
RECOMMENDATION
```

---

# 56. DO NOT BUILD EVERYTHING AT ONCE

Build in phases.

## Phase 1 — Foundation

* Repository
* Architecture
* Authentication
* RBAC
* Database
* Event management
* PWA

## Phase 2 — Event Map

* Map
* Event boundary
* Zones
* Gates
* Routes
* Emergency routes
* GPS route recording
* Temporary infrastructure

## Phase 3 — Data Hub

* Source registry
* Standard observation model
* Synthetic data
* Data ingestion
* Validation
* Source health
* Fusion

## Phase 4 — Real Crowd Data

* CCTV
* Smart Gate
* GPS

## Phase 5 — AI

* Crowd analytics
* Risk model
* Prediction
* Bottleneck detection
* Anomaly detection

## Phase 6 — Decision Support

* Recommendations
* Police deployment
* Gate recommendations
* Route recommendations
* Announcements

## Phase 7 — User Experiences

* Authority
* Police
* Event Owner
* Citizen

## Phase 8 — Simulation

* Digital Twin
* Scenario simulation
* What-if analysis

## Phase 9 — Production Readiness

* Security
* Testing
* Monitoring
* Performance
* Deployment
* Documentation

---

# 57. HACKATHON MVP

Do NOT attempt to connect every real-world source.

Implement strongly:

### Real

* PWA
* Authentication
* Event creation
* Event map
* Zones
* Routes
* Smart Gate simulation
* CCTV/video processing
* Citizen GPS
* Real-time dashboard
* Crowd heatmap
* Risk prediction
* Recommendations
* Role-based interfaces

### Simulated

* Telecom
* Drone
* BLE
* Wearables

The architecture must still support them as real adapters later.

---

# 58. DEMO SCENARIO

The final demo should tell a story.

Create an event.

Configure:

* Event boundary
* 5 zones
* 6 gates
* 8 routes
* 2 emergency routes
* CCTV cameras
* Smart Gates

Start simulation/live data.

Normal:

🟢 Zone A
🟢 Zone B
🟢 Zone C

Then generate:

* Gate G3 high inflow
* Zone B density increasing
* Route R4 becoming congested
* CCTV detecting slowing movement
* GPS showing increasing participating devices

Fusion engine:

→ Crowd state changes.

Risk engine:

→ Zone B risk increases.

Prediction:

> "High risk developing in Zone B within approximately 10 minutes."

Decision engine:

> Restrict G3
> Open G5
> Redirect crowd
> Deploy police
> Broadcast warning

Authority approves.

Crowd state changes.

Risk falls.

Then show:

**Incident prevented / risk mitigated.**

This should be the central hackathon story.

---

# 59. DEVELOPMENT PRINCIPLES FOR THE AI CODING AGENT

The coding agent must:

1. Understand the complete architecture before coding.
2. Never randomly rewrite working code.
3. Inspect the existing repository before making changes.
4. Preserve existing functionality.
5. Follow modular architecture.
6. Use TypeScript strictly on frontend.
7. Use typed Pydantic schemas on backend.
8. Validate all API inputs.
9. Never put secrets in source code.
10. Never implement authorization only in frontend.
11. Write tests for important business logic.
12. Use migrations for database changes.
13. Avoid unnecessary dependencies.
14. Avoid premature microservices.
15. Keep code production-oriented.
16. Add logging and error handling.
17. Handle sensor failures gracefully.
18. Keep real and synthetic sources compatible through the same data contracts.
19. Keep every data record associated with an event.
20. Never mix event data.
21. Make AI recommendations explainable.
22. Keep humans in control of critical interventions.
23. Treat privacy as a design requirement.
24. Document major architectural decisions.
25. Never claim a feature works unless it is actually implemented and tested.

---

# 60. IMPORTANT AI AGENT BEHAVIOR

Before implementing any major feature:

1. Inspect repository.
2. Understand existing architecture.
3. Identify affected modules.
4. Plan changes.
5. Implement incrementally.
6. Run tests.
7. Run lint/type checks.
8. Verify database migrations.
9. Verify API behavior.
10. Verify frontend behavior.
11. Verify security implications.
12. Document changes.

Do not create fake integrations.

If an external system such as telecom or live drone infrastructure is unavailable, create a clearly marked adapter/interface and a simulator/mock implementation.

Never pretend the simulator is a real telecom connection.

---

# 61. FINAL SYSTEM PRINCIPLE

The entire CrowdShield platform should follow this principle:

> **Configure the event first. Sense the crowd from multiple sources. Fuse the observations. Understand the crowd state. Predict risk. Recommend preventive action. Let authorized humans act. Measure the result.**

The system should move crowd management from:

**Reactive → Predictive → Preventive.**

---

# 62. FINAL ARCHITECTURE

```text
                    CROWDShield PWA
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    AUTHORITY           POLICE         EVENT OWNER
        │                                   │
        │                                EVENT SETUP
        │                                   │
        │                            ┌──────┴──────┐
        │                            ↓             ↓
        │                         MAP BUILDER   CONFIGURATION
        │                            │             │
        │                            └──────┬──────┘
        │                                   ↓
        │                           EVENT DIGITAL TWIN
        │                                   │
        └───────────────────────────────────┤
                                            ↓
                                  DATA SOURCE REGISTRY
                                            │
          ┌──────────┬──────────┬──────────┼──────────┬──────────┐
          ↓          ↓          ↓          ↓          ↓          ↓
        CCTV     SMART GATE    GPS       DRONE       BLE     TELECOM
          │          │          │          │          │          │
          └──────────┴──────────┴──────────┴──────────┴──────────┘
                                            │
                                    DATA FUSION HUB
                                            │
                           ┌────────────────┼────────────────┐
                           ↓                ↓                ↓
                      NORMALIZE         VALIDATE        SOURCE HEALTH
                           └────────────────┼────────────────┘
                                            ↓
                                      SENSOR FUSION
                                            ↓
                                       CROWD STATE
                                            ↓
                                    AI RISK ENGINE
                                            ↓
                                  PREDICTION ENGINE
                                            ↓
                                    DECISION ENGINE
                                            ↓
                                   RECOMMENDATIONS
                                            ↓
                               AUTHORITY / POLICE ACTION
                                            ↓
                                      CROWD RESPONSE
                                            ↓
                                      FEEDBACK LOOP
```

---

# 63. BUILDING INSTRUCTION

Do not immediately generate the entire application in one step.

First:

**Analyze the repository and create a technical implementation plan based on this specification.**

Then identify:

* Existing code
* Existing architecture
* Missing modules
* Database changes
* API changes
* Frontend changes
* AI/ML requirements
* Infrastructure requirements
* Dependencies
* Risks

After the plan is approved, implement the system incrementally.

The final implementation must be:

**Modular + Secure + Testable + Scalable + Explainable + Event-centric + Multi-source + Production-oriented.**

Do not sacrifice architecture quality merely to create a visual demo.
