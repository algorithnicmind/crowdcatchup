import time
import requests
import random
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class DroneAdapter:
    def __init__(self, source_id: str, api_url: str, event_id: str = "EVT-001", zone_id: str = "ZONE-C"):
        self.source_id = source_id
        self.api_url = api_url
        self.event_id = event_id
        self.zone_id = zone_id
        self.is_running = False

    def run(self):
        logger.info(f"Starting Drone Adapter for {self.source_id}...")
        self.is_running = True
        
        while self.is_running:
            # Drone roams and estimates density from overhead
            density = random.uniform(1.0, 3.5)
            self.emit_observation("people_count", density * 1000)
            
            # Drones move, they might survey a different zone next, but we keep it static for demo
            time.sleep(3.0)

    def stop(self):
        self.is_running = False

    def emit_observation(self, metric: str, value: float):
        obs = {
            "event_id": self.event_id,
            "source_id": self.source_id,
            "source_type": "DRONE",
            "zone_id": self.zone_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metric": metric,
            "value": value,
            "confidence": 0.85,  # Slightly lower than fixed CCTV
            "latency_ms": 300,
            "health": "SIMULATED" # Rule 11
        }
        try:
            requests.post(f"{self.api_url}/ingest", json=obs, timeout=2)
        except Exception as e:
            logger.error(f"[{self.source_id}] Failed to push observation: {e}")
