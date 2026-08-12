from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

class StandardObservation(BaseModel):
    event_id: str = Field(..., description="Every observation belongs to an event")
    source_id: str = Field(..., description="ID of the source, e.g. CCTV-07, SG-03")
    source_type: Literal["CCTV", "SMART_GATE", "GPS", "DRONE", "BLE", "TELECOM", "SYNTHETIC"]
    zone_id: str = Field(..., description="ID of the zone this observation applies to")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="ISO 8601 timestamp")
    metric: str = Field(..., description="E.g., people_count, entry_rate, avg_speed")
    value: float = Field(..., description="Numeric value for the metric")
    confidence: float = Field(..., ge=0.0, le=1.0, description="0.0 - 1.0 confidence")
    latency_ms: int = Field(0, description="How old is this data in ms")
    health: Literal["ONLINE", "DELAYED", "OFFLINE"] = Field("ONLINE")

class CrowdStateDTO(BaseModel):
    event_id: str
    zone_id: str
    estimated_people: int
    density: float
    density_level: Literal["LOW", "MODERATE", "HIGH", "CRITICAL"]
    average_speed: float
    flow_direction: str
    entry_rate: float
    exit_rate: float
    bottleneck_score: float
    flow_conflict: bool
    risk_score: float
    risk_level: Literal["LOW", "MODERATE", "HIGH", "CRITICAL"]
    confidence: float
    timestamp: datetime
