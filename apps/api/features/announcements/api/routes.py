from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from ..application.alert_service import AlertService

router = APIRouter(prefix="/announcements", tags=["Announcements"])
logger = logging.getLogger(__name__)

class AnnouncementPayload(BaseModel):
    event_id: str
    message_en: str
    message_hi: Optional[str] = ""
    message_od: Optional[str] = ""
    target_zone: Optional[str] = "ALL"
    severity: Optional[str] = "INFO" # INFO, WARNING, CRITICAL

@router.post("/broadcast")
async def broadcast_announcement(payload: AnnouncementPayload, db: AsyncSession = Depends(get_db)):
    """
    Endpoint for the Authority dashboard to broadcast anti-panic 
    multilingual announcements to all Citizen PWAs.
    """
    announcement_id = await AlertService.broadcast_announcement(
        db=db,
        event_id=payload.event_id,
        message_en=payload.message_en,
        message_hi=payload.message_hi,
        message_od=payload.message_od,
        target_zone=payload.target_zone,
        severity=payload.severity
    )
    
    return {"status": "success", "message": "Announcement broadcasted successfully", "id": announcement_id}

@router.get("/{event_id}")
async def get_announcements(event_id: str, db: AsyncSession = Depends(get_db)):
    announcements = await AlertService.get_announcements(db, event_id)
    return {"status": "success", "data": announcements}
