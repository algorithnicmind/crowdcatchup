"""
Auth Feature — API Routes
Doc 12 §3.4 Rule 1: Routes are thin — delegate to use cases immediately.
Doc 12 §3.4 Rule 3: No business logic in routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user_payload,
)
from features.auth.infrastructure.repositories.user_repository_impl import (
    SQLAlchemyUserRepository,
)
from features.auth.application.use_cases.register import RegisterUseCase
from features.auth.application.use_cases.login import LoginUseCase
from features.auth.application.use_cases.get_current_user import GetCurrentUserUseCase
from features.auth.api.schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    repo = SQLAlchemyUserRepository(db)
    use_case = RegisterUseCase(
        user_repository=repo,
        password_hasher=hash_password,
    )
    user_dto = await use_case.execute(
        email=request.email,
        password=request.password,
        full_name=request.full_name,
        role=request.role,
    )
    return UserResponse(
        id=user_dto.id,
        email=user_dto.email,
        full_name=user_dto.full_name,
        role=user_dto.role,
        is_active=user_dto.is_active,
    )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate and return JWT."""
    repo = SQLAlchemyUserRepository(db)
    use_case = LoginUseCase(
        user_repository=repo,
        password_verifier=verify_password,
        token_creator=create_access_token,
    )
    result = await use_case.execute(email=request.email, password=request.password)
    return TokenResponse(**result)


@router.get("/me", response_model=UserResponse)
async def get_me(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """Get the currently authenticated user's profile."""
    repo = SQLAlchemyUserRepository(db)
    use_case = GetCurrentUserUseCase(user_repository=repo)
    user_dto = await use_case.execute(user_id=payload["sub"])
    return UserResponse(
        id=user_dto.id,
        email=user_dto.email,
        full_name=user_dto.full_name,
        role=user_dto.role,
        is_active=user_dto.is_active,
    )
