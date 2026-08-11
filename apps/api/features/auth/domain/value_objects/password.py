"""
Auth Feature — Password Value Object
Enforces minimum password strength rules.
ZERO external dependencies — pure Python.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Password:
    """
    Validated password with strength rules.
    Minimum 8 characters, at least one uppercase, one lowercase, one digit.
    """

    value: str

    def __post_init__(self):
        if len(self.value) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in self.value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in self.value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in self.value):
            raise ValueError("Password must contain at least one digit")
