import pytest
import pytest_asyncio
import asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import StaticPool

from main import app
from core.database import Base, get_db

# Use file-based SQLite for tests to ensure persistence across sessions
test_engine = create_async_engine(
    "sqlite+aiosqlite:///./test_db.sqlite", 
    echo=False,
    connect_args={"check_same_thread": False}
)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(autouse=True, scope="session")
async def prepare_database():
    """Ensure tables exist before running tests."""
    async with test_engine.begin() as conn:
        from sqlalchemy import text
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        except Exception:
            pass
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield

@pytest_asyncio.fixture
async def client():
    """Fixture that provides an AsyncClient pointing to the FastAPI app, with DB overridden."""
    async def override_get_db():
        async with AsyncSession(test_engine, expire_on_commit=False) as session:
            try:
                yield session
                if session.in_transaction():
                    await session.commit()
            except Exception:
                if session.in_transaction():
                    await session.rollback()
                raise
    
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="https://test") as test_client:
        yield test_client
    app.dependency_overrides.clear()
