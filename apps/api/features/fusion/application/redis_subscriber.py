
import asyncio
import logging
import json
import uuid
from .fusion_service import FusionService
from ..api.schemas import StandardObservation
from core.redis import get_redis
from shared.infrastructure.websocket_manager import get_ws_manager

logger = logging.getLogger(__name__)

# Counter to save snapshots every N observations instead of every one
_observation_counter = 0
SNAPSHOT_INTERVAL = 5


async def process_observation_pipeline(obs: StandardObservation):
    """
    Processes the observation through fusion, risk, rules, WS broadcast,
    and persists crowd state snapshots + auto-creates incidents/tasks.
    """
    logger.info(f"Redis Sub: Processing observation from {obs.source_id} for zone {obs.zone_id}")

    global _observation_counter
    _observation_counter += 1

    # 1. Fusion
    crowd_state = FusionService.process_observation(obs)

    # 2. Risk
    try:
        from ...risk.application.risk_service import risk_service
        risk_score = risk_service.predict_risk(crowd_state)
    except Exception:
        risk_score = 10

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
            rec["recommendation_id"] = str(uuid.uuid4())

            await ws_manager.broadcast_to_event(
                event_id=crowd_state.event_id,
                message={"type": "RECOMMENDATION_ALERT", "data": rec}
            )

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
                            risk_level=crowd_state.risk_level,
                            required_officers=needed
                        )
                except Exception as e:
                    logger.error(f"Failed to create police task from recommendation: {e}")

    # 4. Broadcast Crowd State
    await ws_manager.broadcast_to_event(
        event_id=crowd_state.event_id,
        message={"type": "CROWD_STATE_UPDATE", "data": crowd_state.model_dump(mode='json')}
    )

    # 5. Persist crowd state snapshot to DB (every N observations)
    if _observation_counter % SNAPSHOT_INTERVAL == 0:
        try:
            from core.database import async_session_factory
            from ..infrastructure.models.crowd_state_model import CrowdStateSnapshotModel

            snapshot = CrowdStateSnapshotModel(
                id=str(uuid.uuid4()),
                event_id=crowd_state.event_id,
                zone_id=crowd_state.zone_id,
                estimated_people=crowd_state.estimated_people,
                density=crowd_state.density,
                density_level=crowd_state.density_level,
                average_speed=crowd_state.average_speed,
                flow_direction=crowd_state.flow_direction,
                entry_rate=crowd_state.entry_rate,
                exit_rate=crowd_state.exit_rate,
                bottleneck_score=crowd_state.bottleneck_score,
                flow_conflict=crowd_state.flow_conflict,
                risk_score=crowd_state.risk_score,
                risk_level=crowd_state.risk_level,
                confidence=crowd_state.confidence,
                timestamp=crowd_state.timestamp,
            )

            async with async_session_factory() as db:
                db.add(snapshot)
                await db.commit()
        except Exception as e:
            logger.error(f"Failed to save crowd state snapshot: {e}")

    # 6. Auto-create incident when risk is HIGH or CRITICAL
    if crowd_state.risk_level in ("HIGH", "CRITICAL"):
        try:
            from core.database import async_session_factory
            from features.incidents.infrastructure.models.incident_model import IncidentModel

            incident_id = f"inc-{str(uuid.uuid4())[:8]}"
            incident = IncidentModel(
                id=incident_id,
                event_id=crowd_state.event_id,
                type="CROWD_RISK",
                status="NEW",
                description=f"Auto-detected {crowd_state.risk_level} risk in {crowd_state.zone_id}. "
                            f"Density: {crowd_state.density:.1f}, People: {crowd_state.estimated_people}, "
                            f"Risk Score: {crowd_state.risk_score:.1f}",
                lat=25.4308,
                lng=81.8503,
                timestamp=crowd_state.timestamp,
            )

            async with async_session_factory() as db:
                db.add(incident)
                await db.commit()

            logger.info(f"Auto-created incident {incident_id} for {crowd_state.risk_level} risk in {crowd_state.zone_id}")

            await ws_manager.broadcast_to_event(
                event_id=crowd_state.event_id,
                message={
                    "type": "INCIDENT_REPORTED",
                    "data": {
                        "incident_id": incident_id,
                        "event_id": crowd_state.event_id,
                        "type": "CROWD_RISK",
                        "status": "NEW",
                        "description": incident.description,
                        "lat": incident.lat,
                        "lng": incident.lng,
                        "timestamp": incident.timestamp.isoformat(),
                    }
                }
            )
        except Exception as e:
            logger.error(f"Failed to auto-create incident: {e}")


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
                    await process_observation_pipeline(obs)
                except Exception as e:
                    logger.error(f"Error parsing Redis message: {e}")
            await asyncio.sleep(0.01)
    except asyncio.CancelledError:
        logger.info("Redis Subscriber cancelled.")
        await pubsub.unsubscribe()
