import time
import random
import requests
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class GpsAdapter:
    """
    Adapter for aggregated GPS telemetry from the Citizen App.
    Emits zone_device_count to the Data Fusion Hub.
    """
    def __init__(self, source_id: str, api_url: str, event_id: str = "EVT-001", zone_id: str = "ZONE-B", is_mock: bool = False):
        self.source_id = source_id
        self.api_url = api_url
        self.event_id = event_id
        self.zone_id = zone_id
        self.is_mock = is_mock
        self.source_type = "SYNTHETIC" if is_mock else "GPS"
        self.health = "SIMULATED" if is_mock else "ONLINE"
        self._running = False

    def run(self):
        self._running = True
        logger.info(f"Starting GPS Adapter for source {self.source_id}...")
        
        while self._running:
            # Simulate aggregating raw geolocations into a count for this zone
            base_count = 250
            noise = int(random.uniform(-10, 10))
            device_count = max(0, base_count + noise)
            
            self.emit_observation("zone_device_count", float(device_count))
            
            logger.info(f"[{self.source_id}] Sent metrics - Devices in zone: {device_count}")
            
            time.sleep(10.0) # GPS aggregation usually happens over a slightly longer window
            
    def stop(self):
        self._running = False

    def emit_observation(self, metric: str, value: float):
        obs = {
            "event_id": self.event_id,
            "source_id": self.source_id,
            "source_type": self.source_type,
            "zone_id": self.zone_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metric": metric,
            "value": value,
            "confidence": 0.85, # GPS has lower confidence due to app adoption rates
            "latency_ms": 1200,
            "health": self.health
        }
        try:
            requests.post(f"{self.api_url}/ingest", json=obs, timeout=2)
        except Exception as e:
            logger.error(f"Failed to push observation: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    adapter = GpsAdapter(
        source_id="SIM-GPS-AGG", 
        api_url="http://localhost:8000/api/v1",
        is_mock=True
    )
    adapter.run()
