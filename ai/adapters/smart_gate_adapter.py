import time
import random
import requests
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class SmartGateAdapter:
    """
    Adapter for a Smart Gate API or simulated hardware.
    Emits entry_rate, exit_rate, and queue_estimate metrics to the Data Fusion Hub.
    """
    def __init__(self, source_id: str, api_url: str, event_id: str = "EVT-001", zone_id: str = "ZONE-A", is_mock: bool = False):
        self.source_id = source_id
        self.api_url = api_url
        self.event_id = event_id
        self.zone_id = zone_id
        self.is_mock = is_mock
        self.source_type = "SYNTHETIC" if is_mock else "SMART_GATE"
        self.health = "SIMULATED" if is_mock else "ONLINE"
        self._running = False

    def run(self):
        self._running = True
        logger.info(f"Starting Smart Gate Adapter for source {self.source_id}...")
        
        while self._running:
            # Simulate fetching from hardware or generate mock data
            entry_rate = random.uniform(10, 50)
            exit_rate = random.uniform(5, 30)
            queue_estimate = max(0, int((entry_rate - exit_rate) * random.uniform(0.5, 1.5)))
            
            self.emit_observation("entry_rate", entry_rate)
            self.emit_observation("exit_rate", exit_rate)
            self.emit_observation("queue_estimate", float(queue_estimate))
            
            logger.info(f"[{self.source_id}] Sent metrics - In: {entry_rate:.1f}, Out: {exit_rate:.1f}, Queue: {queue_estimate}")
            
            time.sleep(5.0) # Smart gates typically poll every few seconds
            
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
            "confidence": 0.98,
            "latency_ms": 50,
            "health": self.health
        }
        try:
            requests.post(f"{self.api_url}/ingest", json=obs, timeout=2)
        except Exception as e:
            logger.error(f"Failed to push observation: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    adapter = SmartGateAdapter(
        source_id="SIM-GATE-01", 
        api_url="http://localhost:8000/api/v1",
        is_mock=True
    )
    adapter.run()
