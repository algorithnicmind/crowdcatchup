"""
Events Feature — EventStatus Enum
The 8 lifecycle statuses of an Event.
"""

from enum import Enum


class EventStatus(str, Enum):
    DRAFT = "DRAFT"
    CONFIGURATION = "CONFIGURATION"
    READY = "READY"
    LIVE = "LIVE"
    PAUSED = "PAUSED"
    EMERGENCY = "EMERGENCY"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
