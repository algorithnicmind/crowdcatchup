"""
Events Feature — Zone Entity
"""

from dataclasses import dataclass, field
from shared.domain.base_entity import BaseEntity
from features.events.domain.value_objects.geo_point import GeoPoint
from enum import Enum


class ZoneType(str, Enum):
    GENERAL = "GENERAL"
    VIP = "VIP"
    STAGE = "STAGE"
    FOOD = "FOOD"
    MEDICAL = "MEDICAL"
    ASSEMBLY = "ASSEMBLY"
    RESTRICTED = "RESTRICTED"


@dataclass
class Zone(BaseEntity):
    event_id: str = ""
    name: str = ""
    polygon: list[GeoPoint] = field(default_factory=list)
    capacity: int = 0
    warning_threshold: int = 0
    critical_threshold: int = 0
    zone_type: ZoneType = ZoneType.GENERAL

    def validate_thresholds(self):
        if self.warning_threshold > self.critical_threshold:
            raise ValueError("Warning threshold cannot exceed critical threshold")
