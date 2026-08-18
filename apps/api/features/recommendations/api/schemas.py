from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..domain.entities.intervention import InterventionStatus, InterventionType

class InterventionDTO(BaseModel):
    id: str
    event_id: str
    target_zone: str
    intervention_type: InterventionType
    message: str
    status: InterventionStatus
    created_at: datetime
    action_taken_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class InterventionResponse(BaseModel):
    success: bool
    intervention: InterventionDTO
