from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from .schemas import InterventionDTO, InterventionResponse
from ..application.intervention_service import InterventionService

router = APIRouter(prefix="/interventions", tags=["Interventions"])

@router.get("/{event_id}", response_model=List[InterventionDTO])
def get_pending_interventions(event_id: str, db: Session = Depends(get_db)):
    service = InterventionService(db)
    return service.get_pending_interventions(event_id)

@router.post("/{intervention_id}/approve", response_model=InterventionResponse)
def approve_intervention(intervention_id: str, db: Session = Depends(get_db)):
    service = InterventionService(db)
    try:
        intervention = service.approve_intervention(intervention_id)
        return InterventionResponse(success=True, intervention=intervention)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{intervention_id}/reject", response_model=InterventionResponse)
def reject_intervention(intervention_id: str, db: Session = Depends(get_db)):
    service = InterventionService(db)
    try:
        intervention = service.reject_intervention(intervention_id)
        return InterventionResponse(success=True, intervention=intervention)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
