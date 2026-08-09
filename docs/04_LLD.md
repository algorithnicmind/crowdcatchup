# Low-Level Design Document (LLD)
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 3.0 (Multi-Source Data Fusion Architecture Release)

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).

---

## 1. Subsystem Class Diagrams & Logic Flow

### 1.1 Python AI & Backend Services

```mermaid
classDiagram
    class DataFusionHub {
        +ingestObservation(obs: StandardObservation): void
        +validateObservation(obs: StandardObservation): Boolean
        +calculateConfidence(obs: StandardObservation): Float
        +detectDisagreement(observations: List): Alert
        +fuseCrowdState(zone_id: String): CrowdState
    }

    class SourceAdapter {
        <<interface>>
        +connect(): void
        +read(): StandardObservation
        +getHealth(): SourceHealth
        +disconnect(): void
    }

    class CctvAdapter {
        -String rtsp_url
        -YoloDetector detector
        -ByteTracker tracker
        +read(): StandardObservation
    }

    class SmartGateAdapter {
        -String gate_endpoint
        +read(): StandardObservation
    }

    class GpsAdapter {
        -String event_id
        +read(): StandardObservation
    }

    class SyntheticAdapter {
        -ScenarioConfig config
        +read(): StandardObservation
    }

    class RiskPredictionModel {
        -XGBoostClassifier model
        +predictFutureRisk(features: Dict): RiskPrediction
    }

    class RecommendationEngine {
        +generateIntervention(crowd_state: CrowdState): ActionPlan
        +explainRecommendation(plan: ActionPlan): String
    }

    SourceAdapter <|-- CctvAdapter
    SourceAdapter <|-- SmartGateAdapter
    SourceAdapter <|-- GpsAdapter
    SourceAdapter <|-- SyntheticAdapter
    SourceAdapter --> DataFusionHub : produces StandardObservation
    DataFusionHub --> RiskPredictionModel : sends CrowdState
    RiskPredictionModel --> RecommendationEngine : sends RiskScore
```

### 1.2 TypeScript Next.js Frontend

```mermaid
classDiagram
    class RbacRouter {
        +validateJwt(token: String): Role
        +routeToDashboard(role: Role): void
    }

    class MapEngineComponent {
        +renderEventBoundary(boundary: Polygon): void
        +renderZones(zones: Array): void
        +renderGates(gates: Array): void
        +renderRoutes(routes: Array): void
        +updateHeatmap(telemetry: Object): void
        +renderSafeRoutes(routes: Array): void
    }

    class WebsocketManager {
        -WebSocket ws
        +connect(): void
        +onRiskUpdate(callback: Function): void
        +onCrowdStateUpdate(callback: Function): void
        +onAlert(callback: Function): void
        +onSourceHealthUpdate(callback: Function): void
    }

    class EventOwnerTools {
        +drawBoundary(): Polygon
        +createZone(): Zone
        +createGate(): Gate
        +createRoute(): Route
        +recordGpsRoute(): Trajectory
        +configureSmartGate(): SmartGateConfig
    }

    RbacRouter --> MapEngineComponent : Mounts UI
    WebsocketManager --> MapEngineComponent : Pushes Live Updates
    EventOwnerTools --> MapEngineComponent : Configures Event Layer
```

---

## 2. Smart Gate System (Low-Level)

### 2.1 Smart Gate Data Model

```python
class SmartGateConfig:
    gate_id: str
    event_id: str
    zone_id: str
    gate_type: str  # "ENTRY" | "EXIT" | "BIDIRECTIONAL"
    technology: str  # "AI_CAMERA" | "IR" | "LIDAR" | "TURNSTILE" | "RFID" | "QR"
    max_capacity_per_minute: int
    connected_routes: list[str]
    location: GeoPoint

class SmartGateObservation:
    gate_id: str
    event_id: str
    zone_id: str
    timestamp: datetime
    entry_count: int
    exit_count: int
    flow_rate: float  # people per minute
    queue_estimate: int
    status: str  # NORMAL | HIGH_FLOW | CONGESTED | CRITICAL | CLOSED | EMERGENCY_ONLY | OFFLINE
    confidence: float
    device_health: str
```

### 2.2 Gate Status Thresholds

| Status | Condition |
| :--- | :--- |
| NORMAL | flow_rate < 80% of max_capacity |
| HIGH_FLOW | flow_rate 80-95% of max_capacity |
| CONGESTED | flow_rate 95-100% of max_capacity |
| CRITICAL | flow_rate > max_capacity OR safety threshold breached |
| CLOSED | gate manually disabled |
| EMERGENCY_ONLY | gate reserved for emergency evacuation |
| OFFLINE | device not responding |

---

## 3. GPS Route Recording (Low-Level)

### 3.1 GPS Trajectory Processing

```python
class GpsRouteRecorder:
    def start_recording(self, event_owner_id: str) -> str:
        """Start collecting GPS points."""
        
    def add_point(self, lat: float, lng: float, timestamp: datetime) -> None:
        """Add a GPS point to the trajectory."""
        
    def stop_recording(self) -> RawTrajectory:
        """Stop and return raw trajectory."""
        
    def process_trajectory(self, raw: RawTrajectory) -> Route:
        """Smooth, map-match, and generate editable route."""
        # 1. Remove outliers (GPS jitter)
        # 2. Smooth trajectory (moving average)
        # 3. Map-match to venue geometry
        # 4. Generate route with waypoints
        # 5. Return editable route
```

### 3.2 GPS Accuracy Handling

Do not assume GPS is perfectly accurate. The system must:
- Filter outliers (points far from trajectory)
- Smooth jitter (moving average)
- snap to known paths where possible
- Allow manual editing after recording

---

## 4. Temporary Event Infrastructure (Low-Level)

```python
class TemporaryInfrastructure:
    id: str
    type: str  # GATE | ROAD | ROUTE | BARRICADE | EXIT | POLICE_POST | MEDICAL_CAMP | RESTRICTED_AREA
    event_id: str
    zone_id: str | None
    start_time: datetime
    end_time: datetime | None
    status: str  # PLANNED | ACTIVE | CLOSED
    capacity: int | None
    location: GeoPoint | Polygon
    owner_id: str
    notes: str | None
```

---

## 5. Gate-Zone-Route Relationships (Low-Level)

```python
class GateZoneRoute:
    gate_id: str
    zone_ids: list[str]  # one or more zones
    route_ids: list[str]  # one or more routes
    direction: str  # "ENTRY" | "EXIT" | "BIDIRECTIONAL"
    configured_capacity: int  # people per minute
    
    def predict_downstream_impact(self, incoming_flow: float) -> ZoneImpact:
        """Predict how incoming flow affects connected zones."""
```

---

## 6. Time-Series Risk Prediction (XGBoost)

```python
def extract_time_series_features(zone_id: str) -> list:
    current = get_current_crowd_state(zone_id)
    t_minus_1 = get_historical(zone_id, minutes=1)
    t_minus_5 = get_historical(zone_id, minutes=5)
    
    density_growth_rate = (current.density - t_minus_5.density) / 5.0
    speed_decline_rate = current.speed - t_minus_1.speed
    entry_exit_imbalance = current.entry_rate - current.exit_rate
    
    return [
        current.density,
        density_growth_rate,
        current.average_speed,
        speed_decline_rate,
        entry_exit_imbalance,
        current.bottleneck_score,
        current.confidence
    ]
```

---

## 7. Sensor Fusion (Low-Level)

### 7.1 Confidence-Weighted Estimation

```python
def fuse_crowd_state(observations: list[StandardObservation]) -> CrowdState:
    """Fuse multiple source observations into unified crowd state."""
    weighted_sum = 0
    total_weight = 0
    
    for obs in observations:
        weight = obs.confidence * get_source_reliability(obs.source_id)
        weighted_sum += obs.value * weight
        total_weight += weight
    
    estimated_value = weighted_sum / total_weight if total_weight > 0 else 0
    return estimated_value
```

### 7.2 Disagreement Detection

```python
def detect_disagreement(observations: list[StandardObservation]) -> list[Alert]:
    """Detect when sources significantly disagree."""
    values = [obs.value for obs in observations]
    median = statistics.median(values)
    alerts = []
    
    for obs in observations:
        deviation = abs(obs.value - median) / median
        if deviation > 0.3:  # 30% deviation threshold
            alerts.append(Alert(
                type="SENSOR_DISAGREEMENT",
                source_id=obs.source_id,
                message=f"Possible {obs.source_id} anomaly: {obs.value} vs median {median}"
            ))
    return alerts
```

---

## 8. Recommendation Explanation (Low-Level)

Every AI recommendation must include an explanation:

```python
class ActionPlan:
    recommendation_id: str
    zone_id: str
    risk_score: float
    actions: list[Action]
    explanation: Explanation
    confidence: float

class Explanation:
    primary_reason: str
    supporting_factors: list[str]
    source_agreement: float  # how much sources agree
    prediction_confidence: float
    
    # Example:
    # primary_reason: "Zone B density increased 24% in 4 minutes"
    # supporting_factors: [
    #   "Entry rate exceeds configured threshold",
    #   "Exit rate is declining",
    #   "Route R4 is approaching capacity",
    #   "Independent sources agree with high confidence"
    # ]
```

---

## 9. System Safety State Machine

```mermaid
stateDiagram-v2
    [*] --> SAFE: System Boot / Normal Flow
    SAFE --> WARNING: Predictive Risk > 60% OR Density >= 2.5 p/m2
    WARNING --> DANGER: Predictive Risk > 85% OR Velocity < 0.5 m/s
    DANGER --> ACTION_PENDING: AI Recommends Intervention
    ACTION_PENDING --> DANGER: Authority Ignores
    ACTION_PENDING --> WARNING: Authority Approves & Police Deploy
    WARNING --> SAFE: Flow stabilized / Crowd dispersed < 2.0 p/m2
```

---

## 10. Multilingual PWA Alerts

When an intervention is approved, the PWA utilizes `i18next` to render alerts based on the Citizen device language. Supported: English, Hindi, Odia, additional Indian languages later.

Safety-critical messages use controlled templates. AI may draft announcements, but human approval is required for critical broadcasts.


---

## 32. CROWD STATE

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

## 33. CROWD ANALYTICS

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

## 34. RISK ENGINE

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

## 35. PREDICTION HORIZON

The system should aim to predict:

* Next few minutes
* Approximately 5 minutes
* Approximately 10 minutes
* Approximately 15 minutes

The exact prediction horizon must be configurable and evaluated using actual model performance.

Never claim guaranteed prediction.

Use probabilistic risk.

---

## 36. RISK LEVELS

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

## 37. DECISION ENGINE

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

## 39. RECOMMENDATION EXPLANATION

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

