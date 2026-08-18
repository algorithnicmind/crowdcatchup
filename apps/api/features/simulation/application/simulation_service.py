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
        # In a real environment, we'd inject this via RedisPubSub
        # For the hackathon, we assume synthetic_simulator.py is listening or we push directly.
        pass
