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


@router.put(
    "/{event_id}/boundary",
    response_model=EventDTO,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def update_venue_boundary_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    """Update event boundary polygon."""
    from features.events.application.use_cases.spatial_use_cases import UpdateVenueBoundaryUseCase
    repo = SQLAlchemyEventRepository(db)
    use_case = UpdateVenueBoundaryUseCase(event_repository=repo)
    return await use_case.execute(event_id, data)


@router.post(
    "/{event_id}/zones",
    response_model=dict,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def create_zone_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    """Create a new zone."""
    from features.events.infrastructure.repositories.spatial_repository_impl import SQLAlchemyZoneRepository
    from features.events.application.use_cases.spatial_use_cases import CreateZoneUseCase
    zone_repo = SQLAlchemyZoneRepository(db)
    event_repo = SQLAlchemyEventRepository(db)
    use_case = CreateZoneUseCase(zone_repository=zone_repo, event_repository=event_repo)
    return await use_case.execute(event_id, data)


@router.post(
    "/{event_id}/gates",
    response_model=dict,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def create_gate_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    """Create a new gate."""
    from features.events.infrastructure.repositories.spatial_repository_impl import SQLAlchemyGateRepository
    from features.events.application.use_cases.spatial_use_cases import CreateGateUseCase
    gate_repo = SQLAlchemyGateRepository(db)
    event_repo = SQLAlchemyEventRepository(db)
    use_case = CreateGateUseCase(gate_repository=gate_repo, event_repository=event_repo)
    return await use_case.execute(event_id, data)


@router.post(
    "/{event_id}/routes",
    response_model=dict,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def create_route_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    """Create a new route."""
    from features.events.infrastructure.repositories.spatial_repository_impl import SQLAlchemyRouteRepository
    from features.events.application.use_cases.spatial_use_cases import CreateRouteUseCase
    route_repo = SQLAlchemyRouteRepository(db)
    event_repo = SQLAlchemyEventRepository(db)
    use_case = CreateRouteUseCase(route_repository=route_repo, event_repository=event_repo)
    return await use_case.execute(event_id, data)


@router.post(
    "/{event_id}/sources",
    response_model=dict,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def register_source_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    """Register a new source for an event."""
    from features.events.infrastructure.models.event_models import SourceModel
    import uuid
    
    source = SourceModel(
        id=str(uuid.uuid4()),
        event_id=event_id,
        source_type=data.get("source_type"),
        name=data.get("name"),
        location_description=data.get("location_description"),
        is_active=data.get("is_active", True)
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)
    
    return {"status": "success", "source_id": source.id}

@router.get(
    "/{event_id}/sources",
    response_model=list,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY", "POLICE", "CITIZEN"))],
)
async def list_sources_endpoint(event_id: str, db: AsyncSession = Depends(get_db)):
    """List sources for an event."""
    from sqlalchemy import select
    from features.events.infrastructure.models.event_models import SourceModel
    
    result = await db.execute(select(SourceModel).where(SourceModel.event_id == event_id))
    sources = result.scalars().all()
    
    return [
        {
            "id": s.id,
            "event_id": s.event_id,
            "source_type": s.source_type,
            "name": s.name,
            "location_description": s.location_description,
            "is_active": s.is_active
        }
        for s in sources
    ]
