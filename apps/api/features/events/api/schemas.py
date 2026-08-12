"""
Events Feature — DTOs
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GeoPointDTO(BaseModel):
    lat: float
    lng: float


class EventDTO(BaseModel):
    id: str
    name: str
    description: str
    venue_polygon: list[GeoPointDTO]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    status: str
    owner_id: str
    expected_attendance: int
    max_capacity: int


class ZoneDTO(BaseModel):
    id: str
    event_id: str
    name: str
    polygon: list[GeoPointDTO]
    capacity: int
    warning_threshold: int
    critical_threshold: int
    zone_type: str


class GateDTO(BaseModel):
    id: str
    event_id: str
    zone_id: str
    name: str
    location: Optional[GeoPointDTO]
    type: str
    status: str
    capacity_per_minute: int


class RouteDTO(BaseModel):
    id: str
    event_id: str
    name: str
    path: list[GeoPointDTO]
    type: str
    is_active: bool
    capacity: int
