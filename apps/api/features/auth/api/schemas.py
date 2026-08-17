"""
Auth Feature — Pydantic API Schemas
Request/response validation for auth endpoints.
Doc 12 §3.4 Rule 2: Schemas handle request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field, model_validator


class RegisterRequest(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    role: str = Field(default="CITIZEN", pattern="^(AUTHORITY|POLICE|CITIZEN|EVENT_OWNER)$")

    @model_validator(mode="after")
    def check_identifier(self):
        if self.role == "CITIZEN" and not self.phone_number:
            raise ValueError("Citizens must register with a mobile phone number.")
        if self.role != "CITIZEN" and not self.email:
            raise ValueError("Administrators and Authorities must register with an email address.")
        return self


class LoginRequest(BaseModel):
    identifier: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str


class UserResponse(BaseModel):
    id: str
    email: str | None = None
    phone_number: str | None = None
    full_name: str
    role: str
    is_active: bool


class MessageResponse(BaseModel):
    message: str


class UpdateProfileRequest(BaseModel):
    """Request body for PATCH /api/v1/auth/me/profile."""
    full_name: str | None = Field(default=None, min_length=1, max_length=200)
    phone_number: str | None = Field(default=None, max_length=20)

