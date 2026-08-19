"""
Events Feature — GPS Routes API
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from features.events.domain.gps_processor import gps_recorder, GpsPoint
from typing import List

router = APIRouter(prefix="/gps-recording", tags=["gps-recording"])

class StartRecordingRequest(BaseModel):
    event_owner_id: str

class StartRecordingResponse(BaseModel):
    session_id: str
    
class AddPointRequest(BaseModel):
    lat: float
    lng: float
    timestamp: datetime = None
    
class ProcessRouteResponse(BaseModel):
    route_name: str
    path: List[dict]

@router.post("/start", response_model=StartRecordingResponse)
async def start_recording(request: StartRecordingRequest):
    session_id = gps_recorder.start_recording(request.event_owner_id)
    return StartRecordingResponse(session_id=session_id)

@router.post("/{session_id}/point")
async def add_point(session_id: str, request: AddPointRequest):
    timestamp = request.timestamp or datetime.utcnow()
    try:
        gps_recorder.add_point(session_id, request.lat, request.lng, timestamp)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{session_id}/stop")
async def stop_recording(session_id: str):
    try:
        raw = gps_recorder.stop_recording(session_id)
        route = gps_recorder.process_trajectory(raw)
        
        path_dicts = [{"lat": p.lat, "lng": p.lng} for p in route.path]
        return ProcessRouteResponse(route_name=route.name, path=path_dicts)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
