from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from core.limiter import limiter
from .schemas import StandardObservation
from ..application.data_normalization import DataNormalizer
from ..application.source_health_monitor import SourceHealthMonitor
from ..application.fusion_service import FusionService
from core.redis import get_redis
import logging

router = APIRouter(prefix="/v1", tags=["Data Ingestion & Fusion"])
logger = logging.getLogger(__name__)

# Temporary in-memory queue for hackathon purposes.
# In a real setup, this would be pushed to Redis Pub/Sub.
observation_queue = []

def process_observation_background(obs: StandardObservation):
    """
    Background task to process the observation.
    Normally this would call the Fusion Service.
    """
    logger.info(f"Processing observation from {obs.source_id} for zone {obs.zone_id}: {obs.metric}={obs.value}")
    
    # Run the fusion logic
    crowd_state = FusionService.process_observation(obs)
    logger.info(f"Updated CrowdState for {obs.zone_id}: Density {crowd_state.density} ({crowd_state.density_level})")
    
    # Fallback Logic: Graceful Degradation (Phase 5.7)
    # If confidence drops below 30%, rely on historical moving average (simulated here)
    if obs.confidence < 0.3:
        logger.warning(f"Low confidence ({obs.confidence}) from {obs.source_id}. Falling back to historical average risk.")
        risk_score = 30.0 # Example fallback historical average
    else:
        from ...risk.application.risk_service import risk_service
        risk_score = risk_service.predict_risk(crowd_state)
        
    crowd_state.risk_score = risk_score
    
    # Update risk level
    if risk_score < 25:
        crowd_state.risk_level = "LOW"
    elif risk_score < 50:
        crowd_state.risk_level = "MODERATE"
    elif risk_score < 75:
        crowd_state.risk_level = "HIGH"
    else:
        crowd_state.risk_level = "CRITICAL"
        
    logger.info(f"Predicted Risk Score for {obs.zone_id}: {risk_score:.1f} ({crowd_state.risk_level})")
    
    # Run Rules Engine
    from ...recommendations.application.rules_engine import RecommendationEngine
    recommendations = RecommendationEngine.generate_recommendations(crowd_state)
    
    if recommendations:
        logger.info(f"Generated {len(recommendations)} recommendations for {obs.zone_id}")
        for rec in recommendations:
            logger.info(f"-> Action: {rec['message']}")
            
    # Broadcast crowd_state via WebSockets
    from shared.infrastructure.websocket_manager import get_ws_manager
    import asyncio
    
    ws_manager = get_ws_manager()
    
    # We create a new asyncio event loop task to run the async broadcast_to_event
    # because this function is running in a background thread (BackgroundTasks)
    payload = crowd_state.model_dump()
    payload["type"] = "CROWD_STATE_UPDATE"
    
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(ws_manager.broadcast_to_event(obs.event_id, payload))
    except RuntimeError:
        # If no running event loop, we can just run it
        asyncio.run(ws_manager.broadcast_to_event(obs.event_id, payload))
        
    logger.info(f"Broadcasted CROWD_STATE_UPDATE for event {obs.event_id}")

@router.post("/ingest")
@limiter.limit("100/second")
async def ingest_observation(request: Request, obs: StandardObservation, background_tasks: BackgroundTasks):
    """
    Unified ingestion endpoint for all data sources (CCTV, Gates, GPS, Synthetic).
    Accepts StandardObservation format.
    """
    try:
        # 1. Basic Validation (handled by Pydantic)
        # 2. Enqueue for processing
        obs = DataNormalizer.normalize(obs.model_dump())
        SourceHealthMonitor.update_health(obs)
        
        # Push the observation to the Redis Pub/Sub channel
        redis = await get_redis()
        # Ensure we publish as a JSON string
        await redis.publish("crowd_observations", obs.model_dump_json())

        
        
        return {"status": "success", "message": "Observation ingested", "queue_length": "Redis PubSub"}
    except Exception as e:
        logger.error(f"Error ingesting observation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
