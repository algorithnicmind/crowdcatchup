"""
Auth Feature — User Entity
The core user identity entity.
ZERO external dependencies — pure Python only (doc 12 §3.1 Rule 1).
"""

from dataclasses import dataclass, field
from shared.domain.base_entity import BaseEntity
from features.auth.domain.enums.role import Role


@dataclass
class User(BaseEntity):
    """
    Domain entity representing a CrowdShield user.
    Identity is the UUID inherited from BaseEntity.
    """

    email: str = ""
    hashed_password: str = ""
    role: Role = Role.CITIZEN
    full_name: str = ""
    is_active: bool = True
