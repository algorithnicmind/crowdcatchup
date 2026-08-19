from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

class IncidentReport(BaseModel):
    event_id: str = Field(..., description="The ID of the event")
    type: Literal["SOS", "OVERCROWDING", "MEDICAL", "SUSPICIOUS_ACTIVITY"] = Field(..., description="Type of incident")
    description: Optional[str] = Field(None, description="Optional description from the citizen")
    lat: float = Field(..., description="Latitude")
    lng: float = Field(..., description="Longitude")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
