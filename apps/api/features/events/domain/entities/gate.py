"""
Events Feature — Gate Entity
"""

from dataclasses import dataclass
from shared.domain.base_entity import BaseEntity
from features.events.domain.value_objects.geo_point import GeoPoint
from enum import Enum


class GateType(str, Enum):
    ENTRY = "ENTRY"
    EXIT = "EXIT"
    BIDIRECTIONAL = "BIDIRECTIONAL"
    SMART = "SMART"
    EMERGENCY = "EMERGENCY"


class GateStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    RESTRICTED = "RESTRICTED"
    EMERGENCY_ONLY = "EMERGENCY_ONLY"


@dataclass
class Gate(BaseEntity):
    event_id: str = ""
    zone_id: str = ""
    name: str = ""
    location: GeoPoint | None = None
    type: GateType = GateType.ENTRY
    status: GateStatus = GateStatus.CLOSED
    capacity_per_minute: int = 0
