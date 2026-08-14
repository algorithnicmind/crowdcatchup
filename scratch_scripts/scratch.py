
route_code = """

@router.post(
    "/{event_id}/sources",
    response_model=dict,
    dependencies=[Depends(require_role("EVENT_OWNER", "AUTHORITY"))],
)
async def register_source_endpoint(event_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    \"\"\"Register a new source for an event.\"\"\"
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
    \"\"\"List sources for an event.\"\"\"
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
"""

with open("apps/api/features/events/api/routes.py", "a") as f:
    f.write(route_code)

