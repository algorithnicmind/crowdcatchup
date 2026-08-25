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

Each temporary object is backed by the `TemporaryInfrastructureModel` and supports:

* `id`: Unique identifier
* `event_id`: Link to the parent event
* `name`: Descriptive name (e.g. "Main Medical Tent")
* `type`: "MEDICAL", "POLICE", "BARRICADE", "WATER", "RESTRICTED"
* `location`: GeoPoint (lat/lng)
* `status`: "PLANNED", "ACTIVE", "REMOVED"
* `capacity`: Optional numerical capacity (e.g. beds in medical tent)
* `start_time`: When it becomes active
* `end_time`: When it is removed
* `notes`: Additional context or instructions

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

## 17. USER & OFFICER PROFILES

### User Profile
Every user in the system (Citizen, Authority, Police, Event Owner) has a basic profile consisting of:
* User ID
* Full Name
* Email / Phone Number
* Role

### Officer Settings Profile
A Police Officer has an extended profile for tactical settings:
* `callsign`: e.g. "Alpha-1"
* `assigned_zone`: e.g. "ZONE-B"
* `priority_alert_override`: boolean
* `tactical_haptics`: boolean
* `radio_chatter_transcription`: boolean
* `alert_volume`: int
* `map_mode`: "Dark Tactical" | "Light" | "Satellite"
* `building_geometry_3d`: boolean
* `unit_radar_overlay`: boolean

---

## 17.5 EVENT ASSIGNMENT

The `EventAssignment` model links a User to a specific Event with a specific role, enabling the dynamic Multi-Event Architecture.

* `id`: Unique identifier
* `user_id`: Reference to User
* `event_id`: Reference to Event
* `role`: Assigned role (e.g., "POLICE", "EVENT_OWNER", "AUTHORITY")
* `assigned_zone_id`: (Optional) Specific zone assignment for localized duties
* `created_at`: Timestamp

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

## 18. POLICE TASK DOMAIN MODEL

### Task Entity

```python
class Task:
    id: str
    event_id: str
    zone_id: str
    instructions: str
    risk_level: str  # "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
    required_officers: int
    assigned_officers: int
    status: str  # "PENDING" | "IN_PROGRESS" | "RESOLVED"
    created_at: datetime
    updated_at: datetime
```

---

## 19. INCIDENT DOMAIN MODEL (SOS)

### Incident Entity

```python
class Incident:
    id: str
    event_id: str
    zone_id: str
    type: str  # "medical" | "overcrowding" | "blockage" | "panic"
    description: str
    location_lat: float
    location_lng: float
    status: str  # "REPORTED" | "INVESTIGATING" | "RESOLVED"
    created_at: datetime
    resolved_at: datetime | None
```

---

## 20. RECOMMENDATION DOMAIN MODEL

### Recommendation Entity

```python
class Recommendation:
    id: str
    event_id: str
    zone_id: str
    risk_level: str
    primary_reason: str
    supporting_factors: list[str]
    confidence_score: float
    status: str  # "PROPOSED" | "APPROVED" | "REJECTED" | "EXECUTED"
    created_at: datetime
```

---

## 21. CITIZEN NAVIGATION DOMAIN MODEL

### Group Entity

```python
class Group:
    id: str
    size: int
    has_children: bool
    has_elderly: bool
    has_mobility_issues: bool
    preferred_time: datetime | None
    members: list[User] | None
    
    @property
    def profile(self) -> str:
        if self.size == 1: return "SOLO"
        if self.size == 2: return "COUPLE"
        if self.size <= 5: return "FAMILY"
        if self.size <= 15: return "GROUP"
        return "LARGE_GROUP"
    
    @property
    def min_road_width(self) -> float:
        return self.size * 0.5  # 0.5m per person
```

### Journey Entity

```python
class Journey:
    id: str
    user_id: str
    group_id: str | None
    source: GeoPoint
    destination: GeoPoint
    transport_mode: str  # "DRIVE" | "WALK" | "TRANSIT"
    status: str  # "PLANNING" | "NAVIGATING" | "COMPLETED"
    created_at: datetime
    estimated_arrival: datetime | None
    current_route: SafeRoute | None
    navigation_state: NavigationState | None
```

### SafeRoute Value Object

```python
@dataclass(frozen=True)
class SafeRoute:
    waypoints: tuple[GeoPoint, ...]
    distance: float
    estimated_time: int
    crowd_level: str
    safety_score: float
    width_suitable: bool
    recommended_gate: str
    crowd_ahead: tuple[CrowdSegment, ...]

@dataclass(frozen=True)
class CrowdSegment:
    zone_id: str
    density: float
    status: str  # "CLEAR" | "MODERATE" | "CONGESTED" | "DANGEROUS"
```

### NavigationState Value Object

```python
@dataclass
class NavigationState:
    current_position: GeoPoint
    next_instruction: str
    remaining_distance: float
    remaining_time: int
    crowd_ahead: str
    reroute_suggested: bool
    reroute_reason: str | None
    group_members_positions: list[GroupMemberPosition] | None

@dataclass
class GroupMemberPosition:
    user_id: str
    name: str
    position: GeoPoint
    distance_from_user: float
    status: str  # "KEEPING_UP" | "FALLING_BEHIND" | "SEPARATED"
```

### Meeting Point Value Object

```python
@dataclass(frozen=True)
class MeetingPoint:
    name: str
    location: GeoPoint
    crowd_level: str
    distance_from_event: float
    description: str
```

### Relationships

```
User ──has──→ Journey (1:1 active)
User ──belongs_to──→ Group (optional)
Group ──has──→ MeetingPoints (0..n)
Journey ──produces──→ SafeRoute (1..3 alternatives)
SafeRoute ──contains──→ CrowdSegment (0..n)
Journey ──maintains──→ NavigationState (1:1 during navigation)
NavigationState ──tracks──→ GroupMemberPosition (0..n)
```

---

