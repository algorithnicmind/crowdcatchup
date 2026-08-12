from fastapi import APIRouter, HTTPException, BackgroundTasks
from .schemas import StandardObservation
from ..application.fusion_service import FusionService
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
    
    # Run the Risk Engine
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
            
    # In a full implementation, crowd_state and recommendations are broadcast via WebSockets to the frontend.

@router.post("/ingest")
async def ingest_observation(obs: StandardObservation, background_tasks: BackgroundTasks):
    """
    Unified ingestion endpoint for all data sources (CCTV, Gates, GPS, Synthetic).
    Accepts StandardObservation format.
    """
    try:
        # 1. Basic Validation (handled by Pydantic)
        # 2. Enqueue for processing
        observation_queue.append(obs)
        background_tasks.add_task(process_observation_background, obs)
        
        return {"status": "success", "message": "Observation ingested", "queue_length": len(observation_queue)}
    except Exception as e:
        logger.error(f"Error ingesting observation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
