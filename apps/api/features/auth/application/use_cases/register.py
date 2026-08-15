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
        self, email: str | None, phone_number: str | None, password: str, full_name: str, role: str
    ) -> UserDTO:
        email_str = None
        if email:
            try:
                email_vo = Email(value=email)
                email_str = str(email_vo)
            except ValueError as e:
                raise WeakPasswordError(str(e))

        # Validate password strength
        try:
            password_vo = Password(value=password)
        except ValueError as e:
            raise WeakPasswordError(str(e))

        # Check for existing email
        if email_str:
            existing = await self._repo.get_by_email(email_str)
            if existing is not None:
                raise EmailAlreadyExistsError(email_str)
                
        # Check for existing phone number
        if phone_number:
            existing_phone = await self._repo.get_by_identifier(phone_number)
            if existing_phone is not None:
                raise EmailAlreadyExistsError("Phone number already exists.")

        # Create user entity
        user = User(
            email=email_str,
            phone_number=phone_number,
            hashed_password=self._hasher(password_vo.value),
            role=Role(role),
            full_name=full_name,
        )

        # Persist
        saved = await self._repo.save(user)

        return UserDTO(
            id=saved.id,
            email=saved.email,
            phone_number=saved.phone_number,
            full_name=saved.full_name,
            role=saved.role.value,
            is_active=saved.is_active,
        )
