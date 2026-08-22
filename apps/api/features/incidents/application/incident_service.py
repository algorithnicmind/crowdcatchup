import uuid
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..infrastructure.models.incident_model import IncidentModel
from shared.infrastructure.websocket_manager import get_ws_manager
import asyncio

logger = logging.getLogger(__name__)

class IncidentService:
    @staticmethod
    async def report_incident(db: AsyncSession, event_id: str, type: str, lat: float, lng: float, description: str = None) -> str:
        incident_id = f"inc-{str(uuid.uuid4())[:8]}"
        
        new_incident = IncidentModel(
            id=incident_id,
            event_id=event_id,
            type=type,
            status="NEW",
            description=description,
            lat=lat,
            lng=lng,
            timestamp=datetime.utcnow()
        )
        db.add(new_incident)
        await db.commit()
        
        # Broadcast
        payload = {
            "type": "INCIDENT_REPORTED",
            "data": {
                "incident_id": incident_id,
                "event_id": event_id,
                "type": type,
                "status": "NEW",
                "description": description,
                "lat": lat,
                "lng": lng,
                "timestamp": new_incident.timestamp.isoformat()
            }
        }
        
        ws_manager = get_ws_manager()
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(ws_manager.broadcast_to_role(event_id, "POLICE", payload))
            loop.create_task(ws_manager.broadcast_to_role(event_id, "AUTHORITY", payload))
        except RuntimeError:
            pass
            
        logger.info(f"Incident {incident_id} reported for event {event_id}")
        return incident_id

    @staticmethod
    async def get_incidents_for_event(db: AsyncSession, event_id: str):
        result = await db.execute(select(IncidentModel).where(IncidentModel.event_id == event_id))
        return result.scalars().all()
        
    @staticmethod
    async def resolve_incident(db: AsyncSession, incident_id: str):
        result = await db.execute(select(IncidentModel).where(IncidentModel.id == incident_id))
        incident = result.scalar_one_or_none()
        if incident:
            incident.status = "RESOLVED"
            incident.resolved_at = datetime.utcnow()
            await db.commit()
            return True
        return False
