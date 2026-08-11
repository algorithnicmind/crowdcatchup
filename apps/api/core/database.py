"""
CrowdShield Backend — Database Engine
SQLAlchemy async engine with session factory.
Supports SQLite (local dev) and PostgreSQL (production) via DATABASE_URL.
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from core.config import get_settings

settings = get_settings()

# --- Engine ---
# SQLite needs connect_args for async; PostgreSQL does not.
_connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    _connect_args = {"check_same_thread": False}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args=_connect_args,
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
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Dispose the engine on shutdown."""
    await engine.dispose()
