"""
Auth Feature — User Repository Implementation
Implements BaseRepository for User entity using SQLAlchemy.
Doc 12 §3.3: Infrastructure implements interfaces from domain.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from features.auth.domain.entities.user import User
from features.auth.domain.enums.role import Role
from features.auth.infrastructure.models.user_model import UserModel
from shared.domain.base_repository import BaseRepository


class SQLAlchemyUserRepository(BaseRepository[User]):
    """Concrete repository implementation for User entity."""

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_entity(self, model: UserModel) -> User:
        """Convert ORM model to domain entity."""
        return User(
            id=model.id,
            email=model.email,
            phone_number=model.phone_number,
            hashed_password=model.hashed_password,
            role=Role(model.role),
            full_name=model.full_name,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: User) -> UserModel:
        """Convert domain entity to ORM model."""
        return UserModel(
            id=entity.id,
            email=entity.email,
            phone_number=entity.phone_number,
            hashed_password=entity.hashed_password,
            role=entity.role.value,
            full_name=entity.full_name,
            is_active=entity.is_active,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

    async def get_by_id(self, entity_id: str) -> User | None:
        result = await self._session.execute(
            select(UserModel).where(UserModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_by_email(self, email: str) -> User | None:
        """Find a user by email address."""
        result = await self._session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_by_identifier(self, identifier: str) -> User | None:
        """Find a user by email or phone number."""
        result = await self._session.execute(
            select(UserModel).where(
                or_(
                    UserModel.email == identifier,
                    UserModel.phone_number == identifier
                )
            )
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def save(self, entity: User) -> User:
        model = self._to_model(entity)
        merged = await self._session.merge(model)
        await self._session.flush()
        await self._session.refresh(merged)
        return self._to_entity(merged)

    async def delete(self, entity_id: str) -> bool:
        result = await self._session.execute(
            select(UserModel).where(UserModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()
            return True
        return False

    async def list_all(self) -> list[User]:
        result = await self._session.execute(select(UserModel))
        return [self._to_entity(m) for m in result.scalars().all()]
