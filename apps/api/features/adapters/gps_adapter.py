import logging
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from features.fusion.api.schemas import StandardObservation

logger = logging.getLogger(__name__)

class MobileGpsAdapter:
    """
    Mobile GPS adapter that receives raw telemetry from the PWA,
    maps devices to Zones, and aggregates ZONE_DEVICE_COUNT.
    """
    def __init__(self):
        # Maps device_id -> {"lat": float, "lng": float, "last_seen": datetime}
        self.active_devices: Dict[str, Dict] = {}
        
        # Mock Zones for "TechNova 2026" (Lat/Lng polygons)
        # In a full PostGIS implementation, this is replaced with ST_Contains queries
        self.zones = {
            "ENTRANCE_A": [(0.0, 0.0), (0.0, 0.001), (0.001, 0.001), (0.001, 0.0)],
            "MAIN_HALL": [(0.001, 0.0), (0.001, 0.002), (0.003, 0.002), (0.003, 0.0)],
            "FOOD_COURT": [(0.003, 0.0), (0.003, 0.002), (0.004, 0.002), (0.004, 0.0)]
        }

    def _point_in_polygon(self, x: float, y: float, polygon: List[Tuple[float, float]]) -> bool:
        """Ray casting algorithm to determine if point is inside polygon"""
        n = len(polygon)
        inside = False
        p1x, p1y = polygon[0]
        for i in range(1, n + 1):
            p2x, p2y = polygon[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
        return inside

    def ingest_ping(self, device_id: str, lat: float, lng: float):
        """Records a raw telemetry ping from a device."""
        self.active_devices[device_id] = {
            "lat": lat,
            "lng": lng,
            "last_seen": datetime.utcnow()
        }

    def get_zone_counts(self, event_id: str = "evt-technova") -> List[StandardObservation]:
        """
        Calculates device counts per zone. Drops stale devices.
        Returns a list of StandardObservations ready for the Fusion Engine.
        """
        now = datetime.utcnow()
        zone_counts = {zone_id: 0 for zone_id in self.zones.keys()}
        
        # Cleanup and Count
        active_ids = list(self.active_devices.keys())
        for device_id in active_ids:
            data = self.active_devices[device_id]
            # Drop devices not seen in the last 30 seconds
            if now - data["last_seen"] > timedelta(seconds=30):
                del self.active_devices[device_id]
                continue
                
            # Map to zone
            for zone_id, polygon in self.zones.items():
                if self._point_in_polygon(data["lat"], data["lng"], polygon):
                    zone_counts[zone_id] += 1
                    break # A device can only be in one zone

        # Generate Observations
        observations = []
        for zone_id, count in zone_counts.items():
            obs = StandardObservation(
                event_id=event_id,
                source_id="mobile_pwa_aggregator",
                source_type="GPS",
                zone_id=zone_id,
                timestamp=now.isoformat(),
                metric="ZONE_DEVICE_COUNT",
                value=float(count),
                confidence=0.85, # Aggregated GPS confidence
                latency_ms=50,
                health="ONLINE"
            )
            observations.append(obs)
            
        return observations

# Singleton instance for the hackathon
gps_adapter_instance = MobileGpsAdapter()
