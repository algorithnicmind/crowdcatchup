"""
Shared Kernel — WebSocket Manager
Production-grade WebSocket manager replacing the basic ConnectionManager.
Supports:
  - Connect/disconnect tracking
  - Broadcast by event_id (event isolation per doc 08 §27)
  - Broadcast by role (AUTHORITY, POLICE, CITIZEN, EVENT_OWNER)
  - Broadcast to all
"""

import json
from fastapi import WebSocket
from typing import Any


class WebSocketManager:
    """
    Manages WebSocket connections with event isolation and role-based broadcasting.
    Each connection is tagged with event_id and user_role for targeted messaging.
    """

    def __init__(self):
        # {websocket: {"event_id": str, "role": str, "user_id": str}}
        self._connections: dict[WebSocket, dict[str, str]] = {}

    async def connect(
        self,
        websocket: WebSocket,
        event_id: str = "",
        role: str = "",
        user_id: str = "",
    ) -> None:
        """Accept and register a WebSocket connection."""
        await websocket.accept()
        self._connections[websocket] = {
            "event_id": event_id,
            "role": role,
            "user_id": user_id,
        }

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove a WebSocket connection."""
        self._connections.pop(websocket, None)

    @property
    def active_count(self) -> int:
        """Number of active connections."""
        return len(self._connections)

    async def broadcast_all(self, message: dict[str, Any]) -> None:
        """Send a message to ALL connected clients."""
        payload = json.dumps(message)
        disconnected = []
        for ws in self._connections:
            try:
                await ws.send_text(payload)
            except Exception:
                disconnected.append(ws)
        for ws in disconnected:
            self.disconnect(ws)

    async def broadcast_to_event(
        self, event_id: str, message: dict[str, Any]
    ) -> None:
        """
        Send a message to all clients subscribed to a specific event.
        Enforces event isolation (doc 08 §27 — never mix event data).
        """
        payload = json.dumps(message)
        disconnected = []
        for ws, meta in self._connections.items():
            if meta.get("event_id") == event_id:
                try:
                    await ws.send_text(payload)
                except Exception:
                    disconnected.append(ws)
        for ws in disconnected:
            self.disconnect(ws)

    async def broadcast_to_role(
        self, event_id: str, role: str, message: dict[str, Any]
    ) -> None:
        """
        Send a message to all clients with a specific role within an event.
        Example: SECURITY_TASK → POLICE only (doc 08 §4.5).
        """
        payload = json.dumps(message)
        disconnected = []
        for ws, meta in self._connections.items():
            if meta.get("event_id") == event_id and meta.get("role") == role:
                try:
                    await ws.send_text(payload)
                except Exception:
                    disconnected.append(ws)
        for ws in disconnected:
            self.disconnect(ws)

    async def send_to_user(
        self, user_id: str, message: dict[str, Any]
    ) -> None:
        """Send a message to a specific user."""
        payload = json.dumps(message)
        disconnected = []
        for ws, meta in self._connections.items():
            if meta.get("user_id") == user_id:
                try:
                    await ws.send_text(payload)
                except Exception:
                    disconnected.append(ws)
        for ws in disconnected:
            self.disconnect(ws)


# --- Singleton ---
_ws_manager: WebSocketManager | None = None


def get_ws_manager() -> WebSocketManager:
    """Get the global WebSocket manager singleton."""
    global _ws_manager
    if _ws_manager is None:
        _ws_manager = WebSocketManager()
    return _ws_manager
