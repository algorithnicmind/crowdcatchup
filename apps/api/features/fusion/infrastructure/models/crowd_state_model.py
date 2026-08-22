from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text
from datetime import datetime, timezone
from core.database import Base


class CrowdStateSnapshotModel(Base):
    __tablename__ = "crowd_state_snapshots"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, index=True, nullable=False)
    zone_id = Column(String, index=True, nullable=False)
    estimated_people = Column(Integer, default=0)
    density = Column(Float, default=0.0)
    density_level = Column(String, default="LOW")
    average_speed = Column(Float, default=0.0)
    flow_direction = Column(String, default="UNKNOWN")
    entry_rate = Column(Float, default=0.0)
    exit_rate = Column(Float, default=0.0)
    bottleneck_score = Column(Float, default=0.0)
    flow_conflict = Column(Boolean, default=False)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String, default="LOW")
    confidence = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
