from sqlalchemy import Column, String, Float, DateTime, Text
from datetime import datetime
from core.database import Base

class IncidentModel(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, default="NEW", nullable=False)
    description = Column(Text, nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
