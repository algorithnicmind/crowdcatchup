from fastapi import APIRouter, HTTPException, BackgroundTasks
import logging
import uuid
from .schemas import IncidentReport

router = APIRouter(prefix="/v1/incidents", tags=["Incidents"])
logger = logging.getLogger(__name__)

def broadcast_incident_background(incident_data: dict):
    from shared.infrastructure.websocket_manager import get_ws_manager
    import asyncio
    
    ws_manager = get_ws_manager()
    
    payload = {
        "type": "INCIDENT_REPORTED",
        "data": incident_data
    }
    
    try:
        loop = asyncio.get_running_loop()
        # Broadcast to POLICE and AUTHORITY
        loop.create_task(ws_manager.broadcast_to_role(incident_data["event_id"], "POLICE", payload))
        loop.create_task(ws_manager.broadcast_to_role(incident_data["event_id"], "AUTHORITY", payload))
    except RuntimeError:
        asyncio.run(ws_manager.broadcast_to_role(incident_data["event_id"], "POLICE", payload))
        asyncio.run(ws_manager.broadcast_to_role(incident_data["event_id"], "AUTHORITY", payload))
        
    logger.info(f"Broadcasted INCIDENT_REPORTED for event {incident_data['event_id']}")

@router.post("/report")
async def report_incident(report: IncidentReport, background_tasks: BackgroundTasks):
    try:
        incident_data = report.model_dump()
        # Ensure timestamp is string for JSON serialization
        incident_data["timestamp"] = incident_data["timestamp"].isoformat()
        incident_data["incident_id"] = f"inc-{str(uuid.uuid4())[:8]}"
        
        # Broadcast immediately to Police and Authority dashboards
        background_tasks.add_task(broadcast_incident_background, incident_data)
        
        return {"status": "success", "message": "Incident reported", "incident_id": incident_data["incident_id"]}
    except Exception as e:
        logger.error(f"Error reporting incident: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
