import logging
import random
from datetime import datetime
from ...features.fusion.api.schemas import StandardObservation

logger = logging.getLogger(__name__)

class MockGpsAdapter:
    """
    Mock GPS adapter for Hackathon Phase 4.
    Pretends to aggregate citizen location telemetry into a zone device count.
    """
    def __init__(self, source_id: str, event_id: str, zone_id: str):
        self.source_id = source_id
        self.event_id = event_id
        self.zone_id = zone_id

    def read_gps_data(self) -> StandardObservation:
        """
        Simulates aggregating GPS points inside a zone polygon.
        Outputs a StandardObservation with ZONE_DEVICE_COUNT metric.
        """
        simulated_devices = random.randint(50, 400) # Fake device count

        return StandardObservation(
            event_id=self.event_id,
            source_id=self.source_id,
            source_type="GPS",
            zone_id=self.zone_id,
            timestamp=datetime.utcnow().isoformat(),
            metric="ZONE_DEVICE_COUNT",
            value=float(simulated_devices),
            confidence=0.75, # GPS has lower confidence than gates
            latency_ms=100,
            health="ONLINE"
        )
