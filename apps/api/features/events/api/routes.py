"""
Events Feature — API Routes
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from core.security import require_role
from features.events.infrastructure.repositories.event_repository_impl import (
    SQLAlchemyEventRepository,
)
from features.events.application.use_cases.create_event import CreateEventUseCase
from features.events.api.schemas import EventDTO, ZoneDTO, GateDTO

# Protected routes for events
router = APIRouter(prefix="/api/v1/events", tags=["events"])


@router.post(
    "",
    response_model=EventDTO,
    status_code=201,
)
async def create_event_endpoint(
    data: dict, 
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("EVENT_OWNER", "AUTHORITY"))
):
    """Create a new event (Event Owner or Authority only)."""
    # Fix: Inject owner_id from JWT payload to prevent KeyError in UseCase
    data["owner_id"] = user["sub"]
    
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
async def list_events_endpoint(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    """List events with pagination (All roles)."""
    repo = SQLAlchemyEventRepository(db)
    events = await repo.list_all(limit=limit, offset=offset)
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
    from fastapi import HTTPException
    repo = SQLAlchemyEventRepository(db)
    use_case = UpdateVenueBoundaryUseCase(event_repository=repo)
    saved = await use_case.execute(event_id, data)
    if not saved:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventDTO(
        id=saved.id,
        name=saved.name,
        description=saved.description,
        venue_polygon=[
            {"lat": pt.lat, "lng": pt.lng} for pt in saved.venue_polygon
        ],
        start_date=saved.date_range.start_date,
        end_date=saved.date_range.end_date,
        status=saved.status.value,
        owner_id=saved.owner_id,
        expected_attendance=saved.expected_attendance,
        max_capacity=saved.max_capacity,
    )


@router.post(
    "/{event_id}/zones",
    response_model=ZoneDTO,
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

@router.get(
    "/{event_id}/zones",
    response_model=List[ZoneDTO],
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY", "POLICE", "CITIZEN"))],
)
async def list_zones_endpoint(event_id: str, db: AsyncSession = Depends(get_db)):
    """List zones for an event."""
    from sqlalchemy import select
    from features.events.infrastructure.models.event_models import ZoneModel
    result = await db.execute(select(ZoneModel).where(ZoneModel.event_id == event_id))
    zones = result.scalars().all()
    return [
        ZoneDTO(
            id=z.id,
            event_id=z.event_id,
            name=z.name,
            zone_type=z.zone_type.value,
            polygon=[{"lat": pt.lat, "lng": pt.lng} for pt in z.polygon],
            capacity=z.capacity,
            risk_score=z.risk_score,
            is_active=z.is_active
        )
        for z in zones
    ]


@router.post(
    "/{event_id}/gates",
    response_model=GateDTO,
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

@router.get(
    "/{event_id}/gates",
    response_model=List[GateDTO],
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY", "POLICE", "CITIZEN"))],
)
async def list_gates_endpoint(event_id: str, db: AsyncSession = Depends(get_db)):
    """List gates for an event."""
    from sqlalchemy import select
    from features.events.infrastructure.models.event_models import GateModel
    result = await db.execute(select(GateModel).where(GateModel.event_id == event_id))
    gates = result.scalars().all()
    return [
        GateDTO(
            id=g.id,
            event_id=g.event_id,
            name=g.name,
            gate_type=g.gate_type.value,
            location={"lat": g.location.lat, "lng": g.location.lng},
            capacity_per_minute=g.capacity_per_minute,
            status=g.status.value,
            is_active=g.is_active
        )
        for g in gates
    ]


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

@router.get(
    "/{event_id}/routes",
    response_model=list,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY", "POLICE", "CITIZEN"))],
)
async def list_routes_endpoint(event_id: str, db: AsyncSession = Depends(get_db)):
    """List routes for an event."""
    from sqlalchemy import select
    from features.events.infrastructure.models.event_models import FlowRouteModel
    result = await db.execute(select(FlowRouteModel).where(FlowRouteModel.event_id == event_id))
    routes = result.scalars().all()
    return [
        {
            "id": r.id,
            "event_id": r.event_id,
            "name": r.name,
            "route_type": r.route_type.value,
            "path": [{"lat": pt.lat, "lng": pt.lng} for pt in r.path],
            "is_active": r.is_active
        }
        for r in routes
    ]


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
    await db.flush()
    
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

@router.post(
    "/{event_id}/assign-staff",
    response_model=dict,
    dependencies=[Depends(require_role("AUTHORITY"))],
)
async def assign_staff_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    """Assign a police or staff member to an event."""
    from features.events.infrastructure.models.event_models import EventAssignmentModel
    import uuid
    from sqlalchemy import select
    
    user_id = data.get("user_id")
    role = data.get("role", "POLICE")
    
    if not user_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="user_id is required")
        
    # Check if already assigned
    existing = await db.execute(select(EventAssignmentModel).where(
        EventAssignmentModel.event_id == event_id,
        EventAssignmentModel.user_id == user_id
    ))
    if existing.scalar_one_or_none():
        return {"status": "success", "message": "Already assigned"}
        
    assignment = EventAssignmentModel(
        id=str(uuid.uuid4()),
        event_id=event_id,
        user_id=user_id,
        role=role
    )
    db.add(assignment)
    await db.flush()
    
    return {"status": "success", "assignment_id": assignment.id}

@router.get(
    "/{event_id}/staff",
    response_model=list,
    dependencies=[Depends(require_role("AUTHORITY", "EVENT_OWNER"))],
)
async def list_staff_endpoint(event_id: str, db: AsyncSession = Depends(get_db)):
    """List staff assigned to an event."""
    from sqlalchemy import select
    from features.events.infrastructure.models.event_models import EventAssignmentModel
    
    result = await db.execute(select(EventAssignmentModel).where(EventAssignmentModel.event_id == event_id))
    assignments = result.scalars().all()
    
    return [
        {
            "id": a.id,
            "user_id": a.user_id,
            "role": a.role
        }
        for a in assignments
    ]
