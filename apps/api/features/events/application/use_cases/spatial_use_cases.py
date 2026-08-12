"""
Events Feature — Spatial Use Cases
"""
from shared.domain.base_repository import BaseRepository
from features.events.domain.entities.zone import Zone, ZoneType
from features.events.domain.entities.gate import Gate, GateType, GateStatus
from features.events.domain.entities.route import Route, RouteType
from features.events.domain.entities.event import Event
from features.events.domain.value_objects.geo_point import GeoPoint
from features.events.api.schemas import ZoneDTO, GateDTO


class UpdateVenueBoundaryUseCase:
    def __init__(self, event_repository: BaseRepository[Event]):
        self.event_repository = event_repository

    async def execute(self, event_id: str, data: dict) -> Event | None:
        event = await self.event_repository.get_by_id(event_id)
        if not event:
            return None
        
        polygon_data = data.get("venue_polygon", [])
        polygon = [GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in polygon_data]
        
        event.venue_polygon = polygon
        # Assume valid for now, might need validation
        return await self.event_repository.save(event)


class CreateZoneUseCase:
    def __init__(self, zone_repository: BaseRepository[Zone], event_repository: BaseRepository[Event]):
        self.zone_repository = zone_repository
        self.event_repository = event_repository

    async def execute(self, event_id: str, data: dict) -> ZoneDTO | None:
        event = await self.event_repository.get_by_id(event_id)
        if not event:
            raise ValueError(f"Event {event_id} not found")
            
        import uuid
        
        polygon_data = data.get("polygon", [])
        polygon = [GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in polygon_data]
        
        zone = Zone(
            id=str(uuid.uuid4()),
            event_id=event_id,
            name=data.get("name", "New Zone"),
            polygon=polygon,
            capacity=data.get("capacity", 1000),
            warning_threshold=data.get("warning_threshold", 800),
            critical_threshold=data.get("critical_threshold", 950),
            zone_type=ZoneType(data.get("zone_type", "GENERAL"))
        )
        
        zone.validate_thresholds()
        
        saved_zone = await self.zone_repository.save(zone)
        
        return ZoneDTO(
            id=saved_zone.id,
            event_id=saved_zone.event_id,
            name=saved_zone.name,
            polygon=[{"lat": p.lat, "lng": p.lng} for p in saved_zone.polygon],
            capacity=saved_zone.capacity,
            warning_threshold=saved_zone.warning_threshold,
            critical_threshold=saved_zone.critical_threshold,
            zone_type=saved_zone.zone_type.value
        )


class CreateGateUseCase:
    def __init__(self, gate_repository: BaseRepository[Gate], event_repository: BaseRepository[Event]):
        self.gate_repository = gate_repository
        self.event_repository = event_repository

    async def execute(self, event_id: str, data: dict) -> GateDTO | None:
        event = await self.event_repository.get_by_id(event_id)
        if not event:
            raise ValueError(f"Event {event_id} not found")
            
        import uuid
        
        loc_data = data.get("location")
        location = GeoPoint(lat=loc_data["lat"], lng=loc_data["lng"]) if loc_data else None
        
        gate = Gate(
            id=str(uuid.uuid4()),
            event_id=event_id,
            zone_id=data.get("zone_id", ""),
            name=data.get("name", "New Gate"),
            location=location,
            type=GateType(data.get("type", "ENTRY")),
            status=GateStatus(data.get("status", "CLOSED")),
            capacity_per_minute=data.get("capacity_per_minute", 100)
        )
        
        saved_gate = await self.gate_repository.save(gate)
        
        return GateDTO(
            id=saved_gate.id,
            event_id=saved_gate.event_id,
            zone_id=saved_gate.zone_id,
            name=saved_gate.name,
            location={"lat": saved_gate.location.lat, "lng": saved_gate.location.lng} if saved_gate.location else None,
            type=saved_gate.type.value,
            status=saved_gate.status.value,
            capacity_per_minute=saved_gate.capacity_per_minute
        )


class CreateRouteUseCase:
    def __init__(self, route_repository: BaseRepository[Route], event_repository: BaseRepository[Event]):
        self.route_repository = route_repository
        self.event_repository = event_repository

    async def execute(self, event_id: str, data: dict) -> dict:
        event = await self.event_repository.get_by_id(event_id)
        if not event:
            raise ValueError(f"Event {event_id} not found")
            
        import uuid
        
        path_data = data.get("path", [])
        path = [GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in path_data]
        
        route = Route(
            id=str(uuid.uuid4()),
            event_id=event_id,
            name=data.get("name", "New Route"),
            path=path,
            type=RouteType(data.get("type", "TWO_WAY")),
            is_active=data.get("is_active", True),
            capacity=data.get("capacity", 500)
        )
        
        saved_route = await self.route_repository.save(route)
        
        return {
            "id": saved_route.id,
            "event_id": saved_route.event_id,
            "name": saved_route.name,
            "path": [{"lat": p.lat, "lng": p.lng} for p in saved_route.path],
            "type": saved_route.type.value,
            "is_active": saved_route.is_active,
            "capacity": saved_route.capacity
        }
