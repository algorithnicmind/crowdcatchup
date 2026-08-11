"""
Shared Kernel — Base Domain Event
Doc 12 §3.1 Rule 8: Domain events capture business occurrences.
ZERO external dependencies — pure Python only.
"""

import uuid
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Any


@dataclass
class BaseDomainEvent:
    """
    Base class for all domain events.
    Each event captures a business occurrence with type, timestamp, and payload.
    """

    event_type: str = ""
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    payload: dict[str, Any] = field(default_factory=dict)
