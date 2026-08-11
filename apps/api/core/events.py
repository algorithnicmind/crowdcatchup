"""
CrowdShield Backend — In-Process Event Bus
Simple async pub/sub for domain events.
Per doc 12 Principle 4: features communicate through domain events, NOT direct imports.
No Kafka yet — TRD §1.2 says Kafka is for future scalability.
"""

import asyncio
from collections import defaultdict
from typing import Any, Callable, Coroutine

# Type alias for event handlers
EventHandler = Callable[[Any], Coroutine[Any, Any, None]]


class EventBus:
    """
    In-process async event bus.
    Features publish domain events; other features subscribe and react.
    This keeps features decoupled and testable (doc 12 Principle 3 & 4).
    """

    def __init__(self):
        self._handlers: dict[str, list[EventHandler]] = defaultdict(list)

    def subscribe(self, event_type: str, handler: EventHandler) -> None:
        """Register a handler for a specific event type."""
        self._handlers[event_type].append(handler)

    async def publish(self, event_type: str, payload: Any) -> None:
        """
        Publish a domain event to all subscribed handlers.
        Handlers run concurrently via asyncio.gather.
        """
        handlers = self._handlers.get(event_type, [])
        if handlers:
            await asyncio.gather(
                *(handler(payload) for handler in handlers),
                return_exceptions=True,
            )

    def unsubscribe(self, event_type: str, handler: EventHandler) -> None:
        """Remove a specific handler."""
        if event_type in self._handlers:
            self._handlers[event_type] = [
                h for h in self._handlers[event_type] if h is not handler
            ]

    def clear(self) -> None:
        """Remove all subscriptions (for testing)."""
        self._handlers.clear()


# --- Singleton ---
_event_bus: EventBus | None = None


def get_event_bus() -> EventBus:
    """Get the global event bus singleton."""
    global _event_bus
    if _event_bus is None:
        _event_bus = EventBus()
    return _event_bus
