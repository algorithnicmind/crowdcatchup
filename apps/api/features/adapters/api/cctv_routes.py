from fastapi import APIRouter, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import logging
from datetime import datetime
import cv2
import numpy as np

from ...fusion.api.schemas import StandardObservation
from ...fusion.application.data_normalization import DataNormalizer
from ...fusion.application.source_health_monitor import SourceHealthMonitor
from core.redis import get_redis
import sys
import os

# Add root to path so ai package is resolvable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../")))
try:
    from ai.models.yolo_detector import Yolov8Detector
    yolo_model = Yolov8Detector()
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f"Failed to load YOLO model: {e}")
    yolo_model = None

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
    
    async def _push(obs: StandardObservation):
        obs_norm = DataNormalizer.normalize(obs.model_dump())
        SourceHealthMonitor.update_health(obs_norm)
        redis = await get_redis()
        await redis.publish("crowd_observations", obs_norm.model_dump_json())

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
        await _push(obs_flow_in)

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
        await _push(obs_flow_out)
        
    # We await the density ingestion last so we can return its status
    await _push(obs_density)
    return {"status": "success", "message": "CCTV Frame Processed"}


@router.post("/upload")
async def upload_cctv_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    source_id: str = Form(...),
    zone_id: str = Form(...),
    event_id: str = Form("evt-technova")
):
    """
    Endpoint that accepts an image, runs YOLOv8 to count people, 
    and ingests the density observation automatically.
    """
    if not yolo_model:
        return {"status": "error", "message": "YOLO model not initialized"}
        
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Run inference
    detections = yolo_model.detect(img)
    people_count = len(detections)
    
    # Calculate dummy density for demo (assume 1000sqm)
    density = people_count / 1000.0
    
    # Post to regular endpoint logic
    payload = YOLOv8Payload(
        source_id=source_id,
        zone_id=zone_id,
        event_id=event_id,
        density=density,
        confidence=0.9
    )
    
    await process_cctv_frame(payload, background_tasks)
    
    return {
        "status": "success", 
        "people_count": people_count,
        "density": density,
        "message": "Image processed by YOLOv8 and ingested."
    }
