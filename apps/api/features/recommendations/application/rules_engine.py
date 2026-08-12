import logging
from typing import List
from ...fusion.api.schemas import CrowdStateDTO
from datetime import datetime

logger = logging.getLogger(__name__)

class RecommendationEngine:
    @staticmethod
    def generate_recommendations(state: CrowdStateDTO) -> List[dict]:
        """
        Evaluates risk score and generates recommendations if risk is high.
        """
        recommendations = []
        
        if state.risk_level in ["HIGH", "CRITICAL"]:
            logger.warning(f"HIGH/CRITICAL Risk detected in {state.zone_id} (Score: {state.risk_score:.1f})")
            
            # Rule 1: High Density
            if state.density >= 4.0:
                recommendations.append({
                    "type": "RESTRICT_ACCESS",
                    "target": state.zone_id,
                    "message": f"Restrict incoming flow to {state.zone_id}. Density critical ({state.density:.2f} p/m2)."
                })
                
            # Rule 2: High Net Flow
            if (state.entry_rate - state.exit_rate) > 50:
                recommendations.append({
                    "type": "OPEN_GATES",
                    "target": state.zone_id,
                    "message": f"Open emergency exits in {state.zone_id}. Net positive flow is too high."
                })
                
            # Rule 3: Low Speed
            if state.average_speed < 0.5:
                recommendations.append({
                    "type": "DEPLOY_POLICE",
                    "target": state.zone_id,
                    "message": "Deploy 5 Police officers. Crowd movement has stalled, potential bottleneck."
                })
                
        return recommendations
