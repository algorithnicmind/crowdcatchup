from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import logging
from datetime import datetime

router = APIRouter(prefix="/v1/announcements", tags=["Announcements"])
logger = logging.getLogger(__name__)

class AnnouncementPayload(BaseModel):
    event_id: str
    message_en: str
    message_hi: Optional[str] = ""
    message_od: Optional[str] = ""
    target_zone: Optional[str] = "ALL"
    severity: Optional[str] = "INFO" # INFO, WARNING, CRITICAL

def broadcast_announcement_background(payload_dict: dict):
    from shared.infrastructure.websocket_manager import get_ws_manager
    import asyncio
    
    ws_manager = get_ws_manager()
    
    ws_payload = {
        "type": "CITIZEN_ALERT",
        "data": payload_dict
    }
    
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(ws_manager.broadcast_to_event(payload_dict["event_id"], ws_payload))
    except RuntimeError:
        asyncio.run(ws_manager.broadcast_to_event(payload_dict["event_id"], ws_payload))
        
    logger.info(f"Broadcasted CITIZEN_ALERT for event {payload_dict['event_id']}")

@router.post("/broadcast")
async def broadcast_announcement(payload: AnnouncementPayload, background_tasks: BackgroundTasks):
    """
    Endpoint for the Authority dashboard to broadcast anti-panic 
    multilingual announcements to all Citizen PWAs.
    """
    payload_dict = payload.model_dump()
    payload_dict["timestamp"] = datetime.utcnow().isoformat()
    
    # Broadcast to all citizens (CITIZEN_ALERT is listened to by the PWA)
    background_tasks.add_task(broadcast_announcement_background, payload_dict)
    
    return {"status": "success", "message": "Announcement broadcasted successfully"}
