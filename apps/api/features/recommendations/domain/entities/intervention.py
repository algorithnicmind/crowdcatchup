from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class InterventionStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class InterventionType(str, Enum):
    RESTRICT_ACCESS = "RESTRICT_ACCESS"
    OPEN_GATES = "OPEN_GATES"
    DEPLOY_POLICE = "DEPLOY_POLICE"
    BROADCAST_MESSAGE = "BROADCAST_MESSAGE"

class Intervention(BaseModel):
    id: Optional[str] = None
    event_id: str
    target_zone: str
    intervention_type: InterventionType
    message: str
    status: InterventionStatus = InterventionStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    action_taken_at: Optional[datetime] = None
