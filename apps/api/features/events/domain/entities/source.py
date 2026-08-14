from typing import Literal, Optional
from datetime import datetime
from apps.api.shared.domain.base_entity import BaseEntity

class Source(BaseEntity):
    event_id: str
    source_type: Literal["CCTV", "SMART_GATE", "GPS", "DRONE", "BLE", "TELECOM", "SYNTHETIC"]
    name: str
    location_description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = datetime.utcnow()
    
    # We can add methods if needed to change state, but basic registry just needs this.
