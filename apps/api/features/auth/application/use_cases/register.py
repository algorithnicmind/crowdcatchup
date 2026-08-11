"""
Auth Feature — Register Use Case
Doc 12 §3.2: Each use case handles ONE business action.
"""

from features.auth.domain.entities.user import User
from features.auth.domain.value_objects.email import Email
from features.auth.domain.value_objects.password import Password
from features.auth.domain.enums.role import Role
from features.auth.domain.exceptions.auth_error import (
    EmailAlreadyExistsError,
    WeakPasswordError,
)
from features.auth.application.dto.user_dto import UserDTO


class RegisterUseCase:
    """
    Register a new user.
    Validates email format, password strength, checks for duplicates.
    """

    def __init__(self, user_repository, password_hasher):
        self._repo = user_repository
        self._hasher = password_hasher

    async def execute(
        self, email: str, password: str, full_name: str, role: str
    ) -> UserDTO:
        # 1. Validate email format (VO raises ValueError on invalid)
        try:
            email_vo = Email(value=email)
        except ValueError as e:
            raise WeakPasswordError(str(e))

        # 2. Validate password strength (VO raises ValueError on weak)
        try:
            password_vo = Password(value=password)
        except ValueError as e:
            raise WeakPasswordError(str(e))

        # 3. Check for existing email
        existing = await self._repo.get_by_email(email)
        if existing is not None:
            raise EmailAlreadyExistsError(email)

        # 4. Create user entity
        user = User(
            email=str(email_vo),
            hashed_password=self._hasher(password_vo.value),
            role=Role(role),
            full_name=full_name,
        )

        # 5. Persist
        saved = await self._repo.save(user)

        return UserDTO(
            id=saved.id,
            email=saved.email,
            full_name=saved.full_name,
            role=saved.role.value,
            is_active=saved.is_active,
        )
