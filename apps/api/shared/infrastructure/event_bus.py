"""
Shared Kernel — Concrete In-Process Event Bus
Wraps core.events.EventBus for use in the shared infrastructure layer.
"""

from core.events import EventBus, get_event_bus

__all__ = ["EventBus", "get_event_bus"]
