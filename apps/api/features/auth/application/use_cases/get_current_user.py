"""
Auth Feature — Get Current User Use Case
Returns user info from a verified JWT payload.
"""

from features.auth.application.dto.user_dto import UserDTO
from shared.infrastructure.exceptions import NotFoundError


class GetCurrentUserUseCase:
    """Retrieve user details by user ID (from JWT)."""

    def __init__(self, user_repository):
        self._repo = user_repository

    async def execute(self, user_id: str) -> UserDTO:
        user = await self._repo.get_by_id(user_id)
        if user is None:
            raise NotFoundError("User", user_id)
        return UserDTO(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role.value,
            is_active=user.is_active,
        )
