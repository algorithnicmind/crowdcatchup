from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from .schemas import InterventionDTO, InterventionResponse
from ..application.intervention_service import InterventionService

router = APIRouter(prefix="/interventions", tags=["Interventions"])

@router.get("/{event_id}", response_model=List[InterventionDTO])
async def get_pending_interventions(event_id: str, db: AsyncSession = Depends(get_db)):
    service = InterventionService(db)
    return await service.get_pending_interventions(event_id)

@router.post("/{intervention_id}/approve", response_model=InterventionResponse)
async def approve_intervention(intervention_id: str, db: AsyncSession = Depends(get_db)):
    service = InterventionService(db)
    try:
        intervention = await service.approve_intervention(intervention_id)
        return InterventionResponse(success=True, intervention=intervention)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{intervention_id}/reject", response_model=InterventionResponse)
async def reject_intervention(intervention_id: str, db: AsyncSession = Depends(get_db)):
    service = InterventionService(db)
    try:
        intervention = await service.reject_intervention(intervention_id)
        return InterventionResponse(success=True, intervention=intervention)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
