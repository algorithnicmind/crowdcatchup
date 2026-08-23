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
from features.events.api.gps_routes import router as gps_router
from features.fusion.api.routes import router as fusion_router
from features.auth.api.officer_routes import router as officer_router
from features.recommendations.api.routes import router as recommendations_router
from features.navigation.api.routes import router as navigation_router
from features.simulation.api.routes import router as simulation_router
from features.reports.api.routes import router as reports_router
from features.incidents.api.routes import router as incidents_router
from features.adapters.api.gps_telemetry_routes import router as gps_telemetry_router
from features.adapters.api.cctv_routes import router as cctv_router
from features.adapters.api.smart_gate_routes import router as smart_gate_router
from features.announcements.api.routes import router as announcements_router
from features.contact.api.routes import router as contact_router

settings = get_settings()
logging.basicConfig(level=logging.INFO if not settings.DEBUG else logging.DEBUG)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Initializing database...")
    await init_db()  # Creates PostgreSQL tables if they don't exist

    logger.info("Seeding database...")
    from core.seed import seed_users
    await seed_users()

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

from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

if settings.ENFORCE_HTTPS:
    app.add_middleware(HTTPSRedirectMiddleware)

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Register domain exception handlers
register_error_handlers(app)

from features.police.api.routes import router as police_router
from features.database_viewer.api.routes import router as database_viewer_router

# Include API Routers
app.include_router(auth_router)
app.include_router(events_router)
app.include_router(gps_router, prefix="/api/v1")
app.include_router(fusion_router)
app.include_router(officer_router)
app.include_router(recommendations_router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(navigation_router, prefix="/api/v1/navigation", tags=["Navigation"])
app.include_router(simulation_router, prefix="/api/v1/simulation", tags=["Simulation"])
app.include_router(reports_router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(incidents_router, prefix="/api/v1/incidents", tags=["Incidents"])
app.include_router(gps_telemetry_router, prefix="/api/v1")
app.include_router(cctv_router, prefix="/api/v1")
app.include_router(smart_gate_router, prefix="/api/v1")
app.include_router(announcements_router, prefix="/api/v1")
app.include_router(police_router)
app.include_router(contact_router, prefix="/api/v1", tags=["Contact"])
app.include_router(database_viewer_router)


@app.get("/")
def read_root():
    return {"status": "operational", "service": settings.APP_NAME}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Central WebSocket endpoint.
    Clients connect here for real-time updates.
    Query params: token, event_id, role, user_id
    """
    ws_manager = get_ws_manager()

    event_id = websocket.query_params.get("event_id", "")
    role = websocket.query_params.get("role", "")
    user_id = websocket.query_params.get("user_id", "")

    await ws_manager.connect(websocket, event_id=event_id, role=role, user_id=user_id)
    logger.info(f"WS client connected: event={event_id} role={role} user={user_id}")

    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received WS message: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        logger.info(f"WS client disconnected: event={event_id} role={role}")
