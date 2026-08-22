"""
Shared Kernel — Domain Exceptions
Doc 12 §3.1 Rule 10: Exceptions represent business rule violations.
"""


class DomainError(Exception):
    """Base exception for all domain errors."""

    def __init__(self, message: str = "A domain error occurred"):
        self.message = message
        super().__init__(self.message)


class NotFoundError(DomainError):
    """Entity not found."""

    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(f"{entity_name} with id '{entity_id}' not found")
        self.entity_name = entity_name
        self.entity_id = entity_id


class AuthorizationError(DomainError):
    """User does not have required permissions (403)."""

    def __init__(self, message: str = "Not authorized"):
        super().__init__(message)


class AuthenticationError(DomainError):
    """User could not be authenticated (401)."""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message)


class ValidationError(DomainError):
    """Business rule validation failed."""

    def __init__(self, field: str, message: str):
        super().__init__(f"Validation error on '{field}': {message}")
        self.field = field


class ConflictError(DomainError):
    """Entity already exists or state conflict."""

    def __init__(self, message: str = "Conflict"):
        super().__init__(message)
