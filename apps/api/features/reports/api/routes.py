from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from ..application.report_service import ReportService

router = APIRouter()

@router.get("/events/{event_id}", summary="Generate a post-event report")
async def generate_event_report(
    event_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Generates a post-event summary report for Phase 8 Digital Twin.
    Aggregates historical interventions and calculates simulated crowd statistics.
    """
    try:
        report = await ReportService.generate_event_report(db, event_id)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
