"""
CrowdShield Backend — Redis Client
Uses Upstash Redis when REDIS_URL is configured.
Falls back to an in-memory dict for local development (no Redis needed).
"""

from core.config import get_settings

settings = get_settings()


class InMemoryRedis:
    """
    Minimal in-memory Redis replacement for local development.
    Supports get/set/delete/publish — enough for Phase 1.
    """

    def __init__(self):
        self._store: dict[str, str] = {}
        self._subscribers: dict[str, list] = {}

    async def get(self, key: str) -> str | None:
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: int | None = None) -> None:
        self._store[key] = value

    async def delete(self, key: str) -> None:
        self._store.pop(key, None)

    async def publish(self, channel: str, message: str) -> None:
        """No-op in memory; real Redis Pub/Sub used in production."""
        pass

    async def close(self) -> None:
        self._store.clear()


# --- Singleton ---
_redis_client: InMemoryRedis | None = None


async def get_redis() -> InMemoryRedis:
    """FastAPI dependency: returns the Redis client."""
    global _redis_client
    if _redis_client is None:
        if settings.REDIS_URL:
            # Production: use real Redis (upstash-redis or redis.asyncio)
            # For now, fall back to in-memory until Redis is configured
            try:
                import redis.asyncio as aioredis
                _redis_client = aioredis.from_url(settings.REDIS_URL)
            except ImportError:
                _redis_client = InMemoryRedis()
        else:
            _redis_client = InMemoryRedis()
    return _redis_client


async def close_redis() -> None:
    """Shutdown hook to close Redis connection."""
    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None
