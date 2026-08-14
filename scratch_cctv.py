
cctv_code = """
import logging
import random
from typing import Dict, Any
from datetime import datetime
from ...features.fusion.api.schemas import StandardObservation

logger = logging.getLogger(__name__)

class MockCCTVAdapter:
    \"\"\"
    Mock CCTV adapter for Hackathon Phase 4.
    Pretends to analyze a video feed and output crowd metrics.
    \"\"\"
    def __init__(self, source_id: str, event_id: str, zone_id: str):
        self.source_id = source_id
        self.event_id = event_id
        self.zone_id = zone_id

    def capture_frame_and_analyze(self) -> StandardObservation:
        \"\"\"
        Simulates running YOLOv8 detection on a video frame.
        Outputs a StandardObservation with DENSITY metric.
        \"\"\"
        simulated_density = random.randint(10, 500) # Fake people count
        latency = random.randint(10, 80) # Simulate AI processing time

        return StandardObservation(
            event_id=self.event_id,
            source_id=self.source_id,
            source_type="CCTV",
            zone_id=self.zone_id,
            timestamp=datetime.utcnow().isoformat(),
            metric="DENSITY",
            value=float(simulated_density),
            confidence=0.88,
            latency_ms=latency,
            health="ONLINE",
            metadata={"notes": "SIMULATED_CCTV_FEED"}
        )
"""
with open("apps/api/features/adapters/cctv_adapter.py", "w") as f:
    f.write(cctv_code)

