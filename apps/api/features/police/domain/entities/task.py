from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class SecurityTask:
    id: str
    event_id: str
    zone_id: str
    risk_level: str
    instructions: str
    required_officers: int
    assigned_officers: int
    status: str
    created_at: datetime
    resolved_at: Optional[datetime]
