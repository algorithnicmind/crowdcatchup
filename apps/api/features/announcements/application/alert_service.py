import uuid
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..infrastructure.models.announcement_model import AnnouncementModel
from shared.infrastructure.websocket_manager import get_ws_manager
import asyncio

logger = logging.getLogger(__name__)

class AlertService:
    @staticmethod
    async def broadcast_announcement(
        db: AsyncSession, 
        event_id: str, 
        message_en: str,
        message_hi: str = "",
        message_od: str = "",
        target_zone: str = "ALL",
        severity: str = "INFO"
    ) -> str:
        announcement_id = f"ann-{str(uuid.uuid4())[:8]}"
        
        new_announcement = AnnouncementModel(
            id=announcement_id,
            event_id=event_id,
            message_en=message_en,
            message_hi=message_hi,
            message_od=message_od,
            target_zone=target_zone,
            severity=severity,
            timestamp=datetime.utcnow()
        )
        db.add(new_announcement)
        await db.commit()
        
        # Broadcast via WebSockets
        ws_payload = {
            "type": "CITIZEN_ALERT",
            "data": {
                "id": announcement_id,
                "event_id": event_id,
                "message_en": message_en,
                "message_hi": message_hi,
                "message_od": message_od,
                "target_zone": target_zone,
                "severity": severity,
                "timestamp": new_announcement.timestamp.isoformat()
            }
        }
        
        ws_manager = get_ws_manager()
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(ws_manager.broadcast_to_event(event_id, ws_payload))
        except RuntimeError:
            pass
            
        logger.info(f"Broadcasted CITIZEN_ALERT for event {event_id}")
        return announcement_id

    @staticmethod
    async def get_announcements(db: AsyncSession, event_id: str):
        result = await db.execute(
            select(AnnouncementModel)
            .where(AnnouncementModel.event_id == event_id)
            .order_by(AnnouncementModel.timestamp.desc())
        )
        return result.scalars().all()
