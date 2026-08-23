from sqlalchemy.orm import Session
from features.fusion.api.schemas import CrowdStateDTO
from features.risk.application.risk_service import risk_service
from ..api.schemas import WhatIfRequest, WhatIfResponse
import logging

logger = logging.getLogger(__name__)

class SimulationService:
    def __init__(self, db: Session):
        self.db = db
        
    def run_what_if(self, current_state: CrowdStateDTO, request: WhatIfRequest) -> WhatIfResponse:
        """
        Takes the current live state, applies the requested hypothetical modifications,
        and runs it through the XGBoost model to predict the outcome.
        """
        # Create a deep copy using model_dump
        projected = CrowdStateDTO(**current_state.model_dump())
        effects = []
        
        # Apply standard actions
        if request.action == "close_gate":
            projected.exit_rate = max(0, projected.exit_rate - 25.0)
            projected.density += 0.8
            effects.append("Gate closed: Exit rate drops significantly, density increases.")
        elif request.action == "open_gate":
            projected.exit_rate += 30.0
            projected.density = max(0, projected.density - 0.5)
            effects.append("Emergency gates open: Crowd disperses faster, density decreases.")
        elif request.action == "deploy_police":
            projected.average_speed = min(1.5, projected.average_speed + 0.3)
            effects.append("Police deployed: Crowd flow is regulated, average speed increases.")
            
        # Apply any custom modifications provided
        for key, value in request.modifications.items():
            if hasattr(projected, key):
                setattr(projected, key, value)
                effects.append(f"Custom adjustment: {key} changed to {value}.")
                
        # 1. Recalculate density level
        if projected.density < 2.0:
            projected.density_level = "LOW"
        elif projected.density < 3.0:
            projected.density_level = "MODERATE"
        elif projected.density < 4.0:
            projected.density_level = "HIGH"
        else:
            projected.density_level = "CRITICAL"
            
        # 2. Recalculate Risk Score using the RiskService (XGBoost)
        new_risk_score = risk_service.predict_risk(projected)
        projected.risk_score = new_risk_score
        
        # 3. Assign Risk Level based on the new score
        if projected.risk_score < 30:
            projected.risk_level = "LOW"
        elif projected.risk_score < 60:
            projected.risk_level = "MODERATE"
        elif projected.risk_score < 80:
            projected.risk_level = "HIGH"
        else:
            projected.risk_level = "CRITICAL"
            
        # 4. Check for severe ripple effects
        if projected.risk_level in ["HIGH", "CRITICAL"]:
            effects.append(f"CRITICAL WARNING: This action is projected to escalate the zone risk to {projected.risk_level} (Score: {projected.risk_score:.1f}).")
        else:
            effects.append(f"Outcome stable: Zone risk is projected to be {projected.risk_level} (Score: {projected.risk_score:.1f}).")
            
        return WhatIfResponse(projected_state=projected, ripple_effects=effects)
        
    async def trigger_scenario(self, event_id: str, scenario_id: str):
        """
        Triggers a predefined scenario for the Digital Twin simulation.
        In a production setting, this would orchestrate data injection into Redis.
        """
        logger.info(f"Triggering Scenario: {scenario_id} for Event: {event_id}")
        
        import asyncio
        from core.redis import get_redis
        from features.fusion.api.schemas import StandardObservation
        import random
        from datetime import datetime, timezone
        
        # Fire and forget background loop
        asyncio.create_task(self._run_scenario_loop(event_id, scenario_id))
        
    async def _run_scenario_loop(self, event_id: str, scenario_id: str):
        import asyncio
        from core.redis import get_redis
        from features.fusion.api.schemas import StandardObservation
        import random
        from datetime import datetime, timezone
        
        logger.info(f"Started synthetic simulation loop for {scenario_id}")
        
        # Determine base metrics based on scenario
        metrics = {
            "Zone A (Gate 1)": {"people_count": 500, "avg_speed": 1.2, "entry_rate": 20, "exit_rate": 20},
            "Zone B (Gate 2)": {"people_count": 800, "avg_speed": 1.1, "entry_rate": 30, "exit_rate": 30}
        }
        
        if scenario_id == "sudden_surge":
            metrics["Zone A (Gate 1)"]["entry_rate"] = 150
            metrics["Zone A (Gate 1)"]["people_count"] = 1200
            metrics["Zone A (Gate 1)"]["avg_speed"] = 0.8
        elif scenario_id == "gate_blockage":
            metrics["Zone B (Gate 2)"]["exit_rate"] = 2
            metrics["Zone B (Gate 2)"]["people_count"] = 1500
            metrics["Zone B (Gate 2)"]["avg_speed"] = 0.5
        elif scenario_id == "crowd_surge":
            metrics["Zone B (Gate 2)"]["people_count"] = 2500
            metrics["Zone B (Gate 2)"]["entry_rate"] = 200
            metrics["Zone B (Gate 2)"]["exit_rate"] = 50
            metrics["Zone B (Gate 2)"]["avg_speed"] = 0.1
            
        redis = await get_redis()
        
        # Run for 30 seconds, injecting every 2 seconds
        for _ in range(15):
            try:
                timestamp = datetime.now(timezone.utc).isoformat()
                observations = []
                
                # Add random noise and generate observations
                for zone in metrics:
                    for metric, val in metrics[zone].items():
                        noise = random.uniform(-0.1, 0.1) * val
                        current_val = max(0, val + noise)
                        
                        observations.append(StandardObservation(
                            event_id=event_id,
                            source_id=f"SIM-CCTV-{zone}",
                            source_type="SYNTHETIC",
                            zone_id=zone,
                            timestamp=timestamp,
                            metric=metric,
                            value=current_val,
                            confidence=0.95,
                            latency_ms=100,
                            health="ONLINE"
                        ))
                
                # Publish to Redis so Fusion Engine picks it up
                for obs in observations:
                    await redis.publish("crowd_observations", obs.model_dump_json())
                    
            except Exception as e:
                logger.error(f"Error in simulation loop: {e}")
                
            await asyncio.sleep(2)
            
        logger.info(f"Finished synthetic simulation loop for {scenario_id}")
