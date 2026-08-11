"""
Events Feature — Route Entity
"""

from dataclasses import dataclass, field
from shared.domain.base_entity import BaseEntity
from features.events.domain.value_objects.geo_point import GeoPoint
from enum import Enum


class RouteType(str, Enum):
    ONE_WAY = "ONE_WAY"
    TWO_WAY = "TWO_WAY"
    EMERGENCY = "EMERGENCY"
    POLICE_ONLY = "POLICE_ONLY"
    TEMPORARY = "TEMPORARY"


@dataclass
class Route(BaseEntity):
    event_id: str = ""
    name: str = ""
    path: list[GeoPoint] = field(default_factory=list)
    type: RouteType = RouteType.TWO_WAY
    is_active: bool = True
    capacity: int = 0
