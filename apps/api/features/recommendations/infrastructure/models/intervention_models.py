from sqlalchemy import Column, String, DateTime, Enum, Integer
from .....core.database import Base
from datetime import datetime
from ...domain.entities.intervention import InterventionStatus, InterventionType
import uuid

class InterventionModel(Base):
    __tablename__ = "interventions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, index=True)
    target_zone = Column(String)
    intervention_type = Column(Enum(InterventionType))
    message = Column(String)
    status = Column(Enum(InterventionStatus), default=InterventionStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    action_taken_at = Column(DateTime, nullable=True)
