"""
Auth Feature — User DTO
Simple data container for transferring user data between layers.
Doc 12 §3.2: DTOs are simple data containers.
"""

from dataclasses import dataclass


@dataclass
class UserDTO:
    """Data Transfer Object for user information."""

    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
