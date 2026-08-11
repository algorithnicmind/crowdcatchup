"""
Auth Feature — Login Use Case
Doc 12 §3.2: Each use case handles ONE business action.
"""

from features.auth.domain.exceptions.auth_error import InvalidCredentialsError


class LoginUseCase:
    """
    Authenticate user by email + password → return JWT token.
    """

    def __init__(self, user_repository, password_verifier, token_creator):
        self._repo = user_repository
        self._verify = password_verifier
        self._create_token = token_creator

    async def execute(self, email: str, password: str) -> dict:
        # 1. Find user
        user = await self._repo.get_by_email(email)
        if user is None:
            raise InvalidCredentialsError()

        # 2. Verify password
        if not self._verify(password, user.hashed_password):
            raise InvalidCredentialsError()

        # 3. Check active
        if not user.is_active:
            raise InvalidCredentialsError()

        # 4. Create JWT
        token = self._create_token(
            data={"sub": user.id, "role": user.role.value, "email": user.email}
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": user.id,
            "role": user.role.value,
        }
