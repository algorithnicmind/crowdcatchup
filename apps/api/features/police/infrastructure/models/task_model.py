from sqlalchemy import Column, String, Integer, DateTime, Text, Float
from datetime import datetime
from core.database import Base

class SecurityTaskModel(Base):
    __tablename__ = "security_tasks"
    
    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, index=True, nullable=False)
    zone_id = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    instructions = Column(Text, nullable=False)
    required_officers = Column(Integer, default=1)
    assigned_officers = Column(Integer, default=0)
    status = Column(String, default="PENDING", nullable=False) # PENDING, IN_PROGRESS, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
