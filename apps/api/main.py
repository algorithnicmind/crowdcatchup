"""
CrowdShield Backend — FastAPI Entry Point
Thin entry point per doc 12 §3.4 Rule 1.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging

from core.config import get_settings
from core.database import init_db, close_db
from core.redis import close_redis
from features.fusion.application.redis_subscriber import start_redis_subscriber
import asyncio
from shared.infrastructure.websocket_manager import get_ws_manager
from shared.api.error_handlers import register_error_handlers

# Import Routers
from features.auth.api.routes import router as auth_router
from features.events.api.routes import router as events_router
from features.fusion.api.routes import router as fusion_router
from features.auth.api.officer_routes import router as officer_router

settings = get_settings()
logging.basicConfig(level=logging.INFO if not settings.DEBUG else logging.DEBUG)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Initializing database...")
    await init_db()  # Creates PostgreSQL tables if they don't exist

    # Start background Redis subscriber for fusion engine
    subscriber_task = asyncio.create_task(start_redis_subscriber())
    yield

    logger.info("Closing database...")
    await close_db()
    logger.info("Closing Redis...")
    subscriber_task.cancel()
    await close_redis()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register domain exception handlers
register_error_handlers(app)

# Include API Routers
app.include_router(auth_router)
app.include_router(events_router)
app.include_router(fusion_router)
app.include_router(officer_router)


@app.get("/")
def read_root():
    return {"status": "operational", "service": settings.APP_NAME}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Central WebSocket endpoint.
    Clients connect here for real-time updates.
    """
    ws_manager = get_ws_manager()
    # In a real scenario, we'd authenticate the WS connection here
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received WS message: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
