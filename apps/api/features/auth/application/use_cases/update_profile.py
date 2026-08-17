"""
Auth Feature — Update Profile Use Case
Doc 12 §3.2: Each use case handles ONE business action.
Allows a user to update their full_name and phone_number.
"""

from features.auth.domain.exceptions.auth_error import UserNotFoundError
from features.auth.application.dto.user_dto import UserDTO


class UpdateProfileUseCase:
    """
    Update a user's profile (full_name, phone_number).
    Lookup is performed by email — this is the Clerk bridge identifier.
    """

    def __init__(self, user_repository):
        self._repo = user_repository

    async def execute(
        self,
        email: str,
        full_name: str | None = None,
        phone_number: str | None = None,
    ) -> UserDTO:
        # Find existing user by email
        user = await self._repo.get_by_email(email)
        if user is None:
            raise UserNotFoundError(email)

        # Apply only the fields that were provided
        if full_name is not None:
            user.full_name = full_name.strip()
        if phone_number is not None:
            user.phone_number = phone_number.strip() or None

        # Persist changes
        saved = await self._repo.save(user)

        return UserDTO(
            id=saved.id,
            email=saved.email,
            phone_number=saved.phone_number,
            full_name=saved.full_name,
            role=saved.role.value,
            is_active=saved.is_active,
        )
