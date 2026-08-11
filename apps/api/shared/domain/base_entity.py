"""
Shared Kernel — Base Entity
All domain entities inherit from this.
Doc 12 §3.1 Rule 5: Entities have identity (id field).
ZERO external dependencies — pure Python only.
"""

import uuid
from datetime import datetime, timezone
from dataclasses import dataclass, field


@dataclass
class BaseEntity:
    """
    Base class for all domain entities.
    Provides identity (UUID), creation and update timestamps.
    """

    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def __eq__(self, other):
        if not isinstance(other, BaseEntity):
            return False
        return self.id == other.id

    def __hash__(self):
        return hash(self.id)
