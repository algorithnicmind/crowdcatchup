# Domain Model (Events, Zones, Gates, Routes)
**Project Name:** CrowdShield

---



---

## 7. EVENT CREATION

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

## 8. EVENT MAP / VENUE BUILDER

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

## 9. EVENT BOUNDARY

Event Owner must be able to:

* Select a location
* Search a location
* Draw polygon
* Edit polygon
* Add/remove boundary points
* Save event boundary

The boundary defines the operational event area.

---

## 10. ZONE BUILDER

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

## 11. CUSTOM ROUTE SYSTEM

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

## 12. GPS ROUTE RECORDING

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

## 13. TEMPORARY EVENT INFRASTRUCTURE

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

## 14. SMART GATE SYSTEM

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

## 15. SMART GATE STATUS

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

## 16. GATE-ZONE-ROUTE RELATIONSHIP

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

## 44. MAP REQUIREMENTS

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

## 45. DIGITAL TWIN

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

## 46. PRE-EVENT SIMULATION

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

