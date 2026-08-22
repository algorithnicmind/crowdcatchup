from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Incident:
    id: str
    event_id: str
    type: str  # "SOS", "OVERCROWDING", "MEDICAL", "SUSPICIOUS_ACTIVITY"
    status: str  # "NEW", "IN_PROGRESS", "RESOLVED"
    description: Optional[str]
    lat: float
    lng: float
    timestamp: datetime
    resolved_at: Optional[datetime] = None
