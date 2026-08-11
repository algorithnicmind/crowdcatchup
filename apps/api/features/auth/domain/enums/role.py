"""
Auth Feature — Role Enum
Four roles per PRD §4 and doc 11.
ZERO external dependencies — pure Python.
"""

from enum import Enum


class Role(str, Enum):
    """User roles in CrowdShield. PRD §51: RBAC enforced on backend only."""

    AUTHORITY = "AUTHORITY"      # City/district level — sees all events
    POLICE = "POLICE"            # Tactical — receives security tasks
    CITIZEN = "CITIZEN"          # Public — safe routes & alerts only
    EVENT_OWNER = "EVENT_OWNER"  # Event creator — manages event config
