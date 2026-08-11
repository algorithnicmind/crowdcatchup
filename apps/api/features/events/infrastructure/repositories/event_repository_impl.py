"""
Events Feature — Event Repository Implementation
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from features.events.domain.entities.event import Event
from features.events.domain.enums.event_status import EventStatus
from features.events.domain.value_objects.geo_point import GeoPoint
from features.events.domain.value_objects.date_range import DateRange
from features.events.infrastructure.models.event_models import EventModel
from shared.domain.base_repository import BaseRepository
import json


class SQLAlchemyEventRepository(BaseRepository[Event]):
    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_entity(self, model: EventModel) -> Event:
        polygon = [GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in model.venue_polygon]
        return Event(
            id=model.id,
            name=model.name,
            description=model.description,
            venue_polygon=polygon,
            date_range=DateRange(start_date=model.start_date, end_date=model.end_date),
            status=EventStatus(model.status),
            owner_id=model.owner_id,
            expected_attendance=model.expected_attendance,
            max_capacity=model.max_capacity,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Event) -> EventModel:
        polygon = [{"lat": pt.lat, "lng": pt.lng} for pt in entity.venue_polygon]
        return EventModel(
            id=entity.id,
            name=entity.name,
            description=entity.description,
            venue_polygon=polygon,
            start_date=entity.date_range.start_date,
            end_date=entity.date_range.end_date,
            status=entity.status.value,
            owner_id=entity.owner_id,
            expected_attendance=entity.expected_attendance,
            max_capacity=entity.max_capacity,
        )

    async def get_by_id(self, entity_id: str) -> Event | None:
        result = await self._session.execute(
            select(EventModel).where(EventModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def list_all(self) -> list[Event]:
        result = await self._session.execute(select(EventModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def save(self, entity: Event) -> Event:
        model = self._to_model(entity)
        merged = await self._session.merge(model)
        await self._session.flush()
        return self._to_entity(merged)

    async def delete(self, entity_id: str) -> bool:
        result = await self._session.execute(
            select(EventModel).where(EventModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()
            return True
        return False
