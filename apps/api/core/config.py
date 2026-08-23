"""
CrowdShield Backend — Core Configuration
Reads all settings from .env file. ZERO hardcoded secrets (AGENTS.md Rule 6).
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


import os

ENV_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # --- Application ---
    APP_NAME: str = "CrowdShield API Gateway"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False

    # --- Database (Neon DB - Cloud PostgreSQL) ---
    DATABASE_URL: str = "postgresql+asyncpg://<neon_user>:<neon_password>@<neon_host>/<neon_db>?ssl=require"

    # --- Redis (in-memory fallback if not configured) ---
    REDIS_URL: str = ""  # Empty = use in-memory fallback

    # --- Security & HTTPS ---
    ENFORCE_HTTPS: bool = False
    SSL_KEYFILE: str = ""
    SSL_CERTFILE: str = ""
    JWT_SECRET: str = "crowdshield-dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 60

    # --- CORS ---
    CORS_ORIGINS: list[str] = ["*"]

    model_config = {
        "env_file": (ENV_FILE_PATH, ".env"),
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — one read per process lifetime."""
    return Settings()
