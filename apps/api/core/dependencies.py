"""
CrowdShield Backend — Core Dependencies
Re-exports all injectable dependencies for FastAPI routes.
"""

from core.database import get_db
from core.redis import get_redis
from core.security import get_current_user_payload, require_role
from core.events import get_event_bus

__all__ = [
    "get_db",
    "get_redis",
    "get_current_user_payload",
    "require_role",
    "get_event_bus",
]
