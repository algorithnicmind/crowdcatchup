"""
CrowdShield Backend — Database Engine
SQLAlchemy async engine with session factory.
Strictly uses PostgreSQL via DATABASE_URL.
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from core.config import get_settings

settings = get_settings()

# --- Engine ---
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
)

# --- Session Factory ---
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# --- Declarative Base (all ORM models inherit from this) ---
class Base(DeclarativeBase):
    pass


# --- Dependency ---
async def get_db() -> AsyncSession:
    """FastAPI dependency: yields a database session per request."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# --- Lifecycle ---
async def init_db():
    """Create all tables on startup (dev only; use Alembic in production)."""
    async with engine.begin() as conn:
        from sqlalchemy import text
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        except Exception as e:
            # Might fail if user doesn't have superuser rights or extension missing on OS
            pass
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Dispose the engine on shutdown."""
    await engine.dispose()
