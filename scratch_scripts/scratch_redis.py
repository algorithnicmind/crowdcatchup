
import sys

with open("apps/api/core/redis.py", "r") as f:
    content = f.read()

# Enhance InMemoryRedis with asyncio queues for pub/sub
new_in_memory_class = """
import asyncio
from typing import Dict, List, Optional
import json

class InMemoryRedis:
    \"\"\"
    Minimal in-memory Redis replacement for local development.
    Supports get/set/delete and basic pub/sub using asyncio Queues.
    \"\"\"
    def __init__(self):
        self._store: Dict[str, str] = {}
        self._subscribers: Dict[str, List[asyncio.Queue]] = {}

    async def get(self, key: str) -> Optional[str]:
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> None:
        self._store[key] = value

    async def delete(self, key: str) -> None:
        self._store.pop(key, None)

    async def publish(self, channel: str, message: str) -> None:
        if channel in self._subscribers:
            for queue in self._subscribers[channel]:
                await queue.put(message)

    class PubSub:
        def __init__(self, parent, channel: str):
            self.parent = parent
            self.channel = channel
            self.queue = asyncio.Queue()

        async def subscribe(self, channel: str):
            self.channel = channel
            if channel not in self.parent._subscribers:
                self.parent._subscribers[channel] = []
            self.parent._subscribers[channel].append(self.queue)

        async def unsubscribe(self):
            if self.channel in self.parent._subscribers:
                try:
                    self.parent._subscribers[self.channel].remove(self.queue)
                except ValueError:
                    pass

        async def get_message(self, ignore_subscribe_messages=True, timeout=1.0):
            try:
                # Wait for a message with a small timeout to allow checking shutdown flags
                msg = await asyncio.wait_for(self.queue.get(), timeout=timeout)
                return {"type": "message", "channel": self.channel, "data": msg}
            except asyncio.TimeoutError:
                return None

    def pubsub(self):
        return self.PubSub(self, "")

    async def close(self) -> None:
        self._store.clear()
        self._subscribers.clear()
"""

# Replace the old InMemoryRedis class
import re
content = re.sub(r"class InMemoryRedis:.*?(?=# --- Singleton ---)", new_in_memory_class + "\n\n", content, flags=re.DOTALL)

with open("apps/api/core/redis.py", "w") as f:
    f.write(content)

