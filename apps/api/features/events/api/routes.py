"""
Events Feature — API Routes
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from core.security import require_role
from features.events.infrastructure.repositories.event_repository_impl import (
    SQLAlchemyEventRepository,
)
from features.events.application.use_cases.create_event import CreateEventUseCase
from features.events.api.schemas import EventDTO

# Protected routes for events
router = APIRouter(prefix="/api/v1/events", tags=["events"])


@router.post(
    "",
    response_model=EventDTO,
    status_code=201,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def create_event_endpoint(data: dict, db: AsyncSession = Depends(get_db)):
    """Create a new event (Event Owner or Authority only)."""
    repo = SQLAlchemyEventRepository(db)
    use_case = CreateEventUseCase(event_repository=repo)
    return await use_case.execute(data)


@router.get(
    "",
    response_model=List[EventDTO],
    dependencies=[
        Depends(require_role("EVENT_OWNER", "AUTHORITY", "POLICE", "CITIZEN"))
    ],
)
async def list_events_endpoint(db: AsyncSession = Depends(get_db)):
    """List all events (All roles)."""
    repo = SQLAlchemyEventRepository(db)
    events = await repo.list_all()
    # Manual mapping for list (for MVP speed; proper DTO mapping should be used)
    return [
        EventDTO(
            id=e.id,
            name=e.name,
            description=e.description,
            venue_polygon=[{"lat": pt.lat, "lng": pt.lng} for pt in e.venue_polygon],
            start_date=e.date_range.start_date,
            end_date=e.date_range.end_date,
            status=e.status.value,
            owner_id=e.owner_id,
            expected_attendance=e.expected_attendance,
            max_capacity=e.max_capacity,
        )
        for e in events
    ]
