"""
Events Feature — Domain Exceptions
"""

from shared.infrastructure.exceptions import DomainError


class InvalidStatusTransitionError(DomainError):
    def __init__(self, current_status: str, target_status: str):
        super().__init__(
            f"Cannot transition event status from {current_status} to {target_status}"
        )


class ZoneCapacityError(DomainError):
    def __init__(self, message: str):
        super().__init__(message)
