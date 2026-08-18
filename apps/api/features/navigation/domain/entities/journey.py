from pydantic import BaseModel
from typing import List

class GeoPoint(BaseModel):
    lat: float
    lng: float

class RouteRequest(BaseModel):
    event_id: str
    start_zone_id: str
    end_zone_id: str
    group_size: int = 1

class SafeRoute(BaseModel):
    route_id: str
    path: List[GeoPoint]
    estimated_time_mins: float
    status: str
    warnings: List[str] = []
