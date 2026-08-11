"""
Auth Feature — Pydantic API Schemas
Request/response validation for auth endpoints.
Doc 12 §3.4 Rule 2: Schemas handle request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    role: str = Field(default="CITIZEN", pattern="^(AUTHORITY|POLICE|CITIZEN|EVENT_OWNER)$")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool


class MessageResponse(BaseModel):
    message: str
