"""
Events Feature — SQLAlchemy Models
Maps Event, Zone, Gate, Route entities to database tables.
"""

from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base


class EventModel(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    venue_polygon = Column(JSON, default=list)  # List of {lat, lng}
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, nullable=False, default="DRAFT")
    owner_id = Column(String, nullable=False)
    expected_attendance = Column(Integer, default=0)
    max_capacity = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ZoneModel(Base):
    __tablename__ = "zones"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("events.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    polygon = Column(JSON, default=list)
    capacity = Column(Integer, default=0)
    warning_threshold = Column(Integer, default=0)
    critical_threshold = Column(Integer, default=0)
    zone_type = Column(String, nullable=False, default="GENERAL")


class GateModel(Base):
    __tablename__ = "gates"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("events.id"), nullable=False, index=True)
    zone_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    location = Column(JSON, nullable=True)  # {lat, lng}
    type = Column(String, nullable=False, default="ENTRY")
    status = Column(String, nullable=False, default="CLOSED")
    capacity_per_minute = Column(Integer, default=0)


class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("events.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    path = Column(JSON, default=list)
    type = Column(String, nullable=False, default="TWO_WAY")
    is_active = Column(Boolean, default=True)
    capacity = Column(Integer, default=0)


class TemporaryInfrastructureModel(Base):
    __tablename__ = "temporary_infrastructure"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("events.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # e.g., "MEDICAL", "POLICE", "BARRICADE"
    location = Column(JSON, nullable=True)  # {lat, lng}
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, nullable=False, default="ACTIVE")
    capacity = Column(Integer, default=0)
    notes = Column(String, default="")


class SourceModel(Base):
    __tablename__ = 'sources'

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey('events.id'), nullable=False, index=True)
    source_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    location_description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
