"""
Auth Feature — Auth Domain Exceptions
"""

from shared.infrastructure.exceptions import DomainError


class InvalidCredentialsError(DomainError):
    def __init__(self):
        super().__init__("Invalid email or password")


class EmailAlreadyExistsError(DomainError):
    def __init__(self, email: str):
        super().__init__(f"Email '{email}' is already registered")
        self.email = email


class WeakPasswordError(DomainError):
    def __init__(self, reason: str):
        super().__init__(f"Weak password: {reason}")
