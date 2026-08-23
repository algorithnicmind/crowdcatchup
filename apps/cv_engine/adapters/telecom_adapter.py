import time
import requests
import random
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class TelecomAdapter:
    def __init__(self, source_id: str, api_url: str, event_id: str = "EVT-001", zone_id: str = "ZONE-A"):
        self.source_id = source_id
        self.api_url = api_url
        self.event_id = event_id
        self.zone_id = zone_id
        self.is_running = False

    def run(self):
        logger.info(f"Starting Telecom Adapter for {self.source_id}...")
        self.is_running = True
        
        while self.is_running:
            # Telecom pings are less frequent but cover broad areas
            devices_connected = random.randint(500, 2500)
            self.emit_observation("people_count", float(devices_connected))
            
            time.sleep(5.0)

    def stop(self):
        self.is_running = False

    def emit_observation(self, metric: str, value: float):
        obs = {
            "event_id": self.event_id,
            "source_id": self.source_id,
            "source_type": "TELECOM",
            "zone_id": self.zone_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metric": metric,
            "value": value,
            "confidence": 0.70,  # Lower confidence due to extrapolation
            "latency_ms": 1000,
            "health": "SIMULATED" # Rule 11
        }
        try:
            requests.post(f"{self.api_url}/ingest", json=obs, timeout=2)
        except Exception as e:
            logger.error(f"[{self.source_id}] Failed to push observation: {e}")
