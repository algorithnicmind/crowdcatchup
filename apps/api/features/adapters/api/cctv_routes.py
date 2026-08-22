from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import logging
from datetime import datetime

from ...fusion.api.schemas import StandardObservation
from ...fusion.api.routes import ingest_observation

router = APIRouter(prefix="/adapters/cctv", tags=["CCTV Telemetry"])
logger = logging.getLogger(__name__)

class YOLOv8Payload(BaseModel):
    source_id: str
    zone_id: str
    event_id: Optional[str] = "evt-technova"
    density: float
    flow_in: Optional[float] = 0.0
    flow_out: Optional[float] = 0.0
    confidence: Optional[float] = 0.88

@router.post("/frame")
async def process_cctv_frame(payload: YOLOv8Payload, background_tasks: BackgroundTasks):
    """
    Endpoint for YOLOv8 AI pipeline to post real-time crowd metrics.
    """
    now = datetime.utcnow().isoformat()
    
    # 1. Ingest Density
    obs_density = StandardObservation(
        event_id=payload.event_id,
        source_id=payload.source_id,
        source_type="CCTV",
        zone_id=payload.zone_id,
        timestamp=now,
        metric="DENSITY",
        value=payload.density,
        confidence=payload.confidence,
        latency_ms=100,
        health="ONLINE"
    )
    
    # 2. Ingest Flow In (if any)
    if payload.flow_in > 0:
        obs_flow_in = StandardObservation(
            event_id=payload.event_id,
            source_id=payload.source_id,
            source_type="CCTV",
            zone_id=payload.zone_id,
            timestamp=now,
            metric="FLOW_IN",
            value=payload.flow_in,
            confidence=payload.confidence,
            latency_ms=100,
            health="ONLINE"
        )
        await ingest_observation(obs_flow_in, background_tasks)

    # 3. Ingest Flow Out (if any)
    if payload.flow_out > 0:
        obs_flow_out = StandardObservation(
            event_id=payload.event_id,
            source_id=payload.source_id,
            source_type="CCTV",
            zone_id=payload.zone_id,
            timestamp=now,
            metric="FLOW_OUT",
            value=payload.flow_out,
            confidence=payload.confidence,
            latency_ms=100,
            health="ONLINE"
        )
        await ingest_observation(obs_flow_out, background_tasks)
        
    # We await the density ingestion last so we can return its status
    return await ingest_observation(obs_density, background_tasks)
