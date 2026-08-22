from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import logging
from datetime import datetime

from ...fusion.api.schemas import StandardObservation
from ...fusion.api.routes import ingest_observation

router = APIRouter(prefix="/adapters/smart_gate", tags=["Smart Gate Telemetry"])
logger = logging.getLogger(__name__)

class SmartGatePayload(BaseModel):
    source_id: str
    zone_id: str
    event_id: Optional[str] = "evt-technova"
    passages: int # Number of people scanned in this payload

@router.post("/scan")
async def process_gate_scan(payload: SmartGatePayload, background_tasks: BackgroundTasks):
    """
    Endpoint for physical turnstiles or RFID readers to push entrance data.
    """
    now = datetime.utcnow().isoformat()
    
    obs = StandardObservation(
        event_id=payload.event_id,
        source_id=payload.source_id,
        source_type="SMART_GATE",
        zone_id=payload.zone_id,
        timestamp=now,
        metric="FLOW_IN",
        value=float(payload.passages),
        confidence=0.99, # Highly confident for physical scans
        latency_ms=10,
        health="ONLINE"
    )
    
    return await ingest_observation(obs, background_tasks)
