"""
Events Feature — Spatial Repositories
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from shared.domain.base_repository import BaseRepository
from features.events.domain.entities.zone import Zone, ZoneType
from features.events.domain.entities.gate import Gate, GateType, GateStatus
from features.events.domain.entities.route import Route, RouteType
from features.events.domain.value_objects.geo_point import GeoPoint
from features.events.infrastructure.models.event_models import (
    ZoneModel,
    GateModel,
    RouteModel,
)


class SQLAlchemyZoneRepository(BaseRepository[Zone]):
    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_entity(self, model: ZoneModel) -> Zone:
        polygon = [GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in model.polygon]
        return Zone(
            id=model.id,
            event_id=model.event_id,
            name=model.name,
            polygon=polygon,
            capacity=model.capacity,
            warning_threshold=model.warning_threshold,
            critical_threshold=model.critical_threshold,
            zone_type=ZoneType(model.zone_type),
        )

    def _to_model(self, entity: Zone) -> ZoneModel:
        polygon = [{"lat": pt.lat, "lng": pt.lng} for pt in entity.polygon]
        return ZoneModel(
            id=entity.id,
            event_id=entity.event_id,
            name=entity.name,
            polygon=polygon,
            capacity=entity.capacity,
            warning_threshold=entity.warning_threshold,
            critical_threshold=entity.critical_threshold,
            zone_type=entity.zone_type.value,
        )

    async def get_by_id(self, entity_id: str) -> Zone | None:
        result = await self._session.execute(
            select(ZoneModel).where(ZoneModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def list_all(self) -> list[Zone]:
        result = await self._session.execute(select(ZoneModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def list_by_event(self, event_id: str) -> list[Zone]:
        result = await self._session.execute(
            select(ZoneModel).where(ZoneModel.event_id == event_id)
        )
        return [self._to_entity(m) for m in result.scalars().all()]

    async def save(self, entity: Zone) -> Zone:
        model = self._to_model(entity)
        merged = await self._session.merge(model)
        await self._session.flush()
        await self._session.commit()
        return self._to_entity(merged)

    async def delete(self, entity_id: str) -> bool:
        result = await self._session.execute(
            select(ZoneModel).where(ZoneModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()
            await self._session.commit()
            return True
        return False


class SQLAlchemyGateRepository(BaseRepository[Gate]):
    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_entity(self, model: GateModel) -> Gate:
        location = (
            GeoPoint(lat=model.location["lat"], lng=model.location["lng"])
            if model.location
            else None
        )
        return Gate(
            id=model.id,
            event_id=model.event_id,
            zone_id=model.zone_id,
            name=model.name,
            location=location,
            type=GateType(model.type),
            status=GateStatus(model.status),
            capacity_per_minute=model.capacity_per_minute,
        )

    def _to_model(self, entity: Gate) -> GateModel:
        location = {"lat": entity.location.lat, "lng": entity.location.lng} if entity.location else None
        return GateModel(
            id=entity.id,
            event_id=entity.event_id,
            zone_id=entity.zone_id,
            name=entity.name,
            location=location,
            type=entity.type.value,
            status=entity.status.value,
            capacity_per_minute=entity.capacity_per_minute,
        )

    async def get_by_id(self, entity_id: str) -> Gate | None:
        result = await self._session.execute(
            select(GateModel).where(GateModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def list_all(self) -> list[Gate]:
        result = await self._session.execute(select(GateModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def list_by_event(self, event_id: str) -> list[Gate]:
        result = await self._session.execute(
            select(GateModel).where(GateModel.event_id == event_id)
        )
        return [self._to_entity(m) for m in result.scalars().all()]

    async def save(self, entity: Gate) -> Gate:
        model = self._to_model(entity)
        merged = await self._session.merge(model)
        await self._session.flush()
        await self._session.commit()
        return self._to_entity(merged)

    async def delete(self, entity_id: str) -> bool:
        result = await self._session.execute(
            select(GateModel).where(GateModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()
            await self._session.commit()
            return True
        return False


class SQLAlchemyRouteRepository(BaseRepository[Route]):
    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_entity(self, model: RouteModel) -> Route:
        path = [GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in model.path]
        return Route(
            id=model.id,
            event_id=model.event_id,
            name=model.name,
            path=path,
            type=RouteType(model.type),
            is_active=model.is_active,
            capacity=model.capacity,
        )

    def _to_model(self, entity: Route) -> RouteModel:
        path = [{"lat": pt.lat, "lng": pt.lng} for pt in entity.path]
        return RouteModel(
            id=entity.id,
            event_id=entity.event_id,
            name=entity.name,
            path=path,
            type=entity.type.value,
            is_active=entity.is_active,
            capacity=entity.capacity,
        )

    async def get_by_id(self, entity_id: str) -> Route | None:
        result = await self._session.execute(
            select(RouteModel).where(RouteModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def list_all(self) -> list[Route]:
        result = await self._session.execute(select(RouteModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def list_by_event(self, event_id: str) -> list[Route]:
        result = await self._session.execute(
            select(RouteModel).where(RouteModel.event_id == event_id)
        )
        return [self._to_entity(m) for m in result.scalars().all()]

    async def save(self, entity: Route) -> Route:
        model = self._to_model(entity)
        merged = await self._session.merge(model)
        await self._session.flush()
        await self._session.commit()
        return self._to_entity(merged)

    async def delete(self, entity_id: str) -> bool:
        result = await self._session.execute(
            select(RouteModel).where(RouteModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()
            await self._session.commit()
            return True
        return False
