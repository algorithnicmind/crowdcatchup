"""
Shared Kernel — Base Repository (Abstract)
Doc 12 §3.1 Rule 9: Interfaces define contracts for infrastructure.
ZERO external dependencies — pure Python only.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """
    Abstract repository interface.
    Infrastructure layer implements this with SQLAlchemy/Redis.
    Domain and Application layers depend on this abstraction (DIP).
    """

    @abstractmethod
    async def get_by_id(self, entity_id: str) -> T | None:
        """Retrieve an entity by its ID."""
        ...

    @abstractmethod
    async def save(self, entity: T) -> T:
        """Persist an entity (insert or update)."""
        ...

    @abstractmethod
    async def delete(self, entity_id: str) -> bool:
        """Delete an entity by ID. Returns True if deleted."""
        ...

    @abstractmethod
    async def list_all(self) -> list[T]:
        """List all entities."""
        ...
