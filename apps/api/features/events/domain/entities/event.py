"""
Events Feature — Event Entity
The core Event root entity.
"""

from dataclasses import dataclass, field
from shared.domain.base_entity import BaseEntity
from features.events.domain.enums.event_status import EventStatus
from features.events.domain.value_objects.geo_point import GeoPoint
from features.events.domain.value_objects.date_range import DateRange


@dataclass
class Event(BaseEntity):
    name: str = ""
    description: str = ""
    venue_polygon: list[GeoPoint] = field(default_factory=list)
    date_range: DateRange = field(default_factory=lambda: DateRange(None, None))
    status: EventStatus = EventStatus.DRAFT
    owner_id: str = ""
    expected_attendance: int = 0
    max_capacity: int = 0
