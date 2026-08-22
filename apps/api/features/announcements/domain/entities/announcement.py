from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Announcement:
    id: str
    event_id: str
    message_en: str
    message_hi: Optional[str]
    message_od: Optional[str]
    target_zone: str
    severity: str
    timestamp: datetime
