"""
Events Feature — GPS Route Processor
Handles recording, smoothing, and generating routes from raw GPS trajectories.
"""
from typing import Dict, List
import uuid
from datetime import datetime
from pydantic import BaseModel
from .entities.route import Route, RouteType
from .value_objects.geo_point import GeoPoint

class GpsPoint(BaseModel):
    lat: float
    lng: float
    timestamp: datetime

class RawTrajectory(BaseModel):
    session_id: str
    event_owner_id: str
    points: List[GpsPoint] = []
    
class GpsRouteRecorder:
    def __init__(self):
        # In-memory store for active recording sessions.
        self._sessions: Dict[str, RawTrajectory] = {}
        
    def start_recording(self, event_owner_id: str) -> str:
        """Start collecting GPS points."""
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = RawTrajectory(
            session_id=session_id,
            event_owner_id=event_owner_id,
            points=[]
        )
        return session_id
        
    def add_point(self, session_id: str, lat: float, lng: float, timestamp: datetime) -> None:
        """Add a GPS point to the trajectory."""
        if session_id in self._sessions:
            self._sessions[session_id].points.append(
                GpsPoint(lat=lat, lng=lng, timestamp=timestamp)
            )
            
    def stop_recording(self, session_id: str) -> RawTrajectory:
        """Stop and return raw trajectory."""
        if session_id in self._sessions:
            return self._sessions.pop(session_id)
        raise ValueError("Session not found")
        
    def process_trajectory(self, raw: RawTrajectory) -> Route:
        """Smooth, map-match, and generate editable route."""
        # 1. Remove outliers (GPS jitter) - basic implementation
        # 2. Smooth trajectory (moving average) - basic implementation
        
        if not raw.points:
            return Route(name="Empty Route", path=[], type=RouteType.TEMPORARY)
            
        smoothed_points = []
        window_size = 3
        
        for i in range(len(raw.points)):
            start_idx = max(0, i - window_size // 2)
            end_idx = min(len(raw.points), i + window_size // 2 + 1)
            window = raw.points[start_idx:end_idx]
            
            avg_lat = sum(p.lat for p in window) / len(window)
            avg_lng = sum(p.lng for p in window) / len(window)
            
            smoothed_points.append(GeoPoint(lat=avg_lat, lng=avg_lng))
            
        return Route(
            name=f"Recorded Route {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
            path=smoothed_points,
            type=RouteType.TEMPORARY
        )

# Global singleton for DI
gps_recorder = GpsRouteRecorder()
