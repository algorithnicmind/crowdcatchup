"""
Shared Kernel — API Dependencies
Shared dependencies for pagination, role checking, etc.
"""

from fastapi import Query


class PaginationParams:
    """Common pagination parameters."""

    def __init__(
        self,
        skip: int = Query(0, ge=0, description="Number of items to skip"),
        limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    ):
        self.skip = skip
        self.limit = limit
