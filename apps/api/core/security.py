"""
CrowdShield Backend — Security Module
JWT creation/verification + password hashing.
PRD §51: RBAC enforced on the backend only.
TRD §5: Frontend is untrusted. All role verifications enforced by FastAPI backend.
"""

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from core.config import get_settings

settings = get_settings()

# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- OAuth2 scheme (extracts token from Authorization header) ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token.
    Payload must include 'sub' (user id) and 'role'.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_EXPIRY_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    """
    Decode and verify a JWT token.
    Raises HTTPException 401 on failure.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception


async def get_current_user_payload(
    token: str = Depends(oauth2_scheme),
) -> dict:
    """
    FastAPI dependency: extracts and verifies the JWT payload.
    Returns dict with 'sub' (user_id) and 'role'.
    """
    return verify_token(token)


def require_role(*allowed_roles: str):
    """
    Factory dependency: restricts endpoint access to specific roles.
    Usage: Depends(require_role("AUTHORITY", "POLICE"))
    """

    async def role_checker(
        payload: dict = Depends(get_current_user_payload),
    ) -> dict:
        user_role = payload.get("role", "")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' not authorized. Required: {allowed_roles}",
            )
        return payload

    return role_checker
