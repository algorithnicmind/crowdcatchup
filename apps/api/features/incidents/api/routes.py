from fastapi import APIRouter, HTTPException, Depends
import logging
from .schemas import IncidentReport
from ..application.incident_service import IncidentService
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db

router = APIRouter(prefix="/v1/incidents", tags=["Incidents"])
logger = logging.getLogger(__name__)

@router.post("/report")
async def report_incident(report: IncidentReport, db: AsyncSession = Depends(get_db)):
    try:
        incident_id = await IncidentService.report_incident(
            db=db,
            event_id=report.event_id,
            type=report.type,
            lat=report.lat,
            lng=report.lng,
            description=report.description
        )
        return {"status": "success", "message": "Incident reported", "incident_id": incident_id}
    except Exception as e:
        logger.error(f"Error reporting incident: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{event_id}")
async def get_incidents(event_id: str, db: AsyncSession = Depends(get_db)):
    incidents = await IncidentService.get_incidents_for_event(db, event_id)
    return {"status": "success", "data": incidents}

@router.post("/{incident_id}/resolve")
async def resolve_incident(incident_id: str, db: AsyncSession = Depends(get_db)):
    success = await IncidentService.resolve_incident(db, incident_id)
    if not success:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"status": "success", "message": "Incident resolved"}
