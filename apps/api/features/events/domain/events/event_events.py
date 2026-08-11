"""
Events Feature — Domain Events
"""

from dataclasses import dataclass
from shared.domain.base_domain_event import BaseDomainEvent


@dataclass
class EventCreated(BaseDomainEvent):
    event_type: str = "EventCreated"


@dataclass
class EventStatusChanged(BaseDomainEvent):
    event_type: str = "EventStatusChanged"
