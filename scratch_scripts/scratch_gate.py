
gate_code = """
import logging
import random
from datetime import datetime
from ...features.fusion.api.schemas import StandardObservation

logger = logging.getLogger(__name__)

class MockSmartGateAdapter:
    \"\"\"
    Mock Smart Gate adapter for Hackathon Phase 4.
    Pretends to read RFID/Turnstile data and outputs flow metrics.
    \"\"\"
    def __init__(self, source_id: str, event_id: str, zone_id: str):
        self.source_id = source_id
        self.event_id = event_id
        self.zone_id = zone_id

    def read_turnstile_data(self) -> StandardObservation:
        \"\"\"
        Simulates people walking through a gate.
        Outputs a StandardObservation with FLOW_RATE metric.
        \"\"\"
        simulated_flow = random.randint(0, 120) # People per minute

        return StandardObservation(
            event_id=self.event_id,
            source_id=self.source_id,
            source_type="SMART_GATE",
            zone_id=self.zone_id,
            timestamp=datetime.utcnow().isoformat(),
            metric="FLOW_RATE",
            value=float(simulated_flow),
            confidence=0.99, # Gates are highly accurate
            latency_ms=5,
            health="ONLINE",
            metadata={"notes": "SIMULATED_TURNSTILE"}
        )
"""
with open("apps/api/features/adapters/smart_gate_adapter.py", "w") as f:
    f.write(gate_code)

