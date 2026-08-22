
import asyncio
import logging
import json
from .fusion_service import FusionService
from ..api.schemas import StandardObservation
from core.redis import get_redis
from shared.infrastructure.websocket_manager import get_ws_manager

logger = logging.getLogger(__name__)

async def process_observation_pipeline(obs: StandardObservation):
    """
    Processes the observation through fusion, risk, rules, and WS broadcast.
    This was previously in routes.py.
    """
    logger.info(f"Redis Sub: Processing observation from {obs.source_id} for zone {obs.zone_id}")
    
    # 1. Fusion
    crowd_state = FusionService.process_observation(obs)
    
    # 2. Risk (Mock if not fully implemented)
    try:
        from ...risk.application.risk_service import risk_service
        risk_score = risk_service.predict_risk(crowd_state)
    except Exception:
        risk_score = 10 # Default safe
        
    crowd_state.risk_score = risk_score
    if risk_score < 25: crowd_state.risk_level = "LOW"
    elif risk_score < 50: crowd_state.risk_level = "MODERATE"
    elif risk_score < 75: crowd_state.risk_level = "HIGH"
    else: crowd_state.risk_level = "CRITICAL"
    
    # 3. Rules/Recommendations
    recommendations = []
    try:
        from ...recommendations.application.rules_engine import RecommendationEngine
        recommendations = RecommendationEngine.generate_recommendations(crowd_state)
    except Exception as e:
        logger.error(f"Failed to generate recommendations: {e}")
        
    ws_manager = get_ws_manager()
    if recommendations:
        for rec in recommendations:
            # Give it a unique ID based on timestamp and target
            import uuid
            rec["recommendation_id"] = str(uuid.uuid4())
            
            # Broadcast the recommendation to Authority
            await ws_manager.broadcast_to_event(
                event_id=crowd_state.event_id,
                message={"type": "RECOMMENDATION_ALERT", "data": rec}
            )
            
            # Automatically create a police task if the AI suggests it
            if rec["type"] in ["DEPLOY_POLICE", "RESTRICT_ACCESS"]:
                try:
                    from ...police.application.task_manager import TaskManager
                    from core.database import async_session_factory
                    
                    needed = 5 if rec["type"] == "DEPLOY_POLICE" else 3
                    
                    async with async_session_factory() as db:
                        await TaskManager.create_task(
                            db=db,
                            event_id=crowd_state.event_id,
                            zone_id=rec["target"],
                            instructions=rec["message"],
                            risk_level="CRITICAL",
                            required_officers=needed
                        )
                except Exception as e:
                    logger.error(f"Failed to create police task from recommendation: {e}")
        
    # 4. Broadcast Crowd State
    await ws_manager.broadcast_to_event(
        event_id=crowd_state.event_id,
        message={"type": "CROWD_STATE_UPDATE", "data": crowd_state.model_dump()}
    )

async def start_redis_subscriber():
    """Background task to subscribe to crowd_observations."""
    logger.info("Starting Redis Subscriber for crowd_observations...")
    redis = await get_redis()
    pubsub = redis.pubsub()
    await pubsub.subscribe("crowd_observations")
    
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message and message.get("type") == "message":
                data_str = message["data"]
                try:
                    data_dict = json.loads(data_str)
                    obs = StandardObservation(**data_dict)
                    # Process it
                    await process_observation_pipeline(obs)
                except Exception as e:
                    logger.error(f"Error parsing Redis message: {e}")
            await asyncio.sleep(0.01) # Small sleep to yield loop
    except asyncio.CancelledError:
        logger.info("Redis Subscriber cancelled.")
        await pubsub.unsubscribe()
