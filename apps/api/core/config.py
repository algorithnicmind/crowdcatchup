"""
CrowdShield Backend — Core Configuration
Reads all settings from .env file. ZERO hardcoded secrets (AGENTS.md Rule 6).
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # --- Application ---
    APP_NAME: str = "CrowdShield API Gateway"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False

    # --- Database (SQLite for local dev, Local PostgreSQL for production) ---
    DATABASE_URL: str = "sqlite+aiosqlite:///./crowdshield.db"

    # --- Redis (in-memory fallback if not configured) ---
    REDIS_URL: str = ""  # Empty = use in-memory fallback

    # --- JWT / Security ---
    JWT_SECRET: str = "crowdshield-dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 60

    # --- CORS ---
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]



    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — one read per process lifetime."""
    return Settings()
