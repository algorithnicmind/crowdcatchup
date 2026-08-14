"""
Events Feature — Create Event Use Case
"""

from features.events.domain.entities.event import Event
from features.events.domain.value_objects.geo_point import GeoPoint
from features.events.domain.value_objects.date_range import DateRange
from features.events.domain.events.event_events import EventCreated
from shared.infrastructure.event_bus import get_event_bus
from features.events.api.schemas import EventDTO


class CreateEventUseCase:
    def __init__(self, event_repository):
        self._repo = event_repository
        self._bus = get_event_bus()

    async def execute(self, data: dict) -> EventDTO:
        # Create Entity
        polygon = [
            GeoPoint(lat=pt["lat"], lng=pt["lng"]) for pt in data.get("venue_polygon", [])
        ]
        from datetime import datetime

        start_date_raw = data.get("start_date")
        end_date_raw = data.get("end_date")
        
        start_date = datetime.fromisoformat(start_date_raw.replace("Z", "+00:00")) if isinstance(start_date_raw, str) else start_date_raw
        end_date = datetime.fromisoformat(end_date_raw.replace("Z", "+00:00")) if isinstance(end_date_raw, str) else end_date_raw

        date_range = DateRange(
            start_date=start_date, end_date=end_date
        )

        event = Event(
            name=data["name"],
            description=data.get("description", ""),
            venue_polygon=polygon,
            date_range=date_range,
            owner_id=data["owner_id"],
            expected_attendance=data.get("expected_attendance", 0),
            max_capacity=data.get("max_capacity", 0),
        )

        # Save
        saved = await self._repo.save(event)

        # Publish Domain Event
        await self._bus.publish(
            "EventCreated",
            EventCreated(payload={"event_id": saved.id, "owner_id": saved.owner_id}),
        )

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
