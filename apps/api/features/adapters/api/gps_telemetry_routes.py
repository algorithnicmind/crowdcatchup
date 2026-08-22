from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import logging

from features.adapters.gps_adapter import gps_adapter_instance
from features.fusion.api.routes import ingest_observation

router = APIRouter(prefix="/adapters/gps", tags=["GPS Telemetry"])
logger = logging.getLogger(__name__)

class TelemetryPing(BaseModel):
    device_id: str
    lat: float
    lng: float
    event_id: Optional[str] = "evt-technova"

def aggregate_and_ingest(background_tasks: BackgroundTasks):
    """
    Retrieves the aggregated zone counts from the adapter
    and pushes them to the Fusion Engine.
    """
    observations = gps_adapter_instance.get_zone_counts()
    for obs in observations:
        # In a real async environment, we'd call the async ingest endpoint directly
        # or push to the Redis queue. For the hackathon, we push via the same logic.
        from ...fusion.api.routes import ingest_observation
        import asyncio
        
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(ingest_observation(obs, background_tasks))
        except RuntimeError:
            # If no running loop, just run it
            asyncio.run(ingest_observation(obs, background_tasks))

@router.post("/telemetry")
async def receive_telemetry(ping: TelemetryPing, background_tasks: BackgroundTasks):
    """
    Endpoint for mobile apps (PWAs) to send their GPS location.
    Ping payload: { "device_id": "user123", "lat": 0.001, "lng": 0.001 }
    """
    gps_adapter_instance.ingest_ping(ping.device_id, ping.lat, ping.lng)
    
    # Trigger aggregation in the background. 
    # In production, this would be a Cron job running every 5 seconds.
    background_tasks.add_task(aggregate_and_ingest, background_tasks)
    
    return {"status": "success", "message": "Telemetry received"}
