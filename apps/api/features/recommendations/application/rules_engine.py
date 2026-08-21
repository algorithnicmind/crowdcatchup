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
                    "message": f"Restrict incoming flow to {state.zone_id}. Density critical ({state.density:.2f} p/m2).",
                    "explanation": {
                        "primary_reason": "Critical crowd density detected",
                        "supporting_factors": [
                            f"Density is {state.density:.2f} p/m2 (Threshold: 4.0)",
                            f"Current estimated people: {state.estimated_people}"
                        ],
                        "source_agreement": 0.95,
                        "prediction_confidence": 0.90
                    },
                    "actions": [
                        "Deploy 3 Police units to barricade entry",
                        "Broadcast 'Zone Full' message to citizens",
                        "Redirect GPS app users to alternative zones"
                    ],
                    "risk_score": state.risk_score
                })
                
            # Rule 2: High Net Flow
            if (state.entry_rate - state.exit_rate) > 50:
                recommendations.append({
                    "type": "OPEN_GATES",
                    "target": state.zone_id,
                    "message": f"Open emergency exits in {state.zone_id}. Net positive flow is too high.",
                    "explanation": {
                        "primary_reason": "High net influx of people causing bottleneck",
                        "supporting_factors": [
                            f"Entry rate ({state.entry_rate}/min) exceeds exit rate ({state.exit_rate}/min)",
                            "Risk of crush injuries if flow is not balanced"
                        ],
                        "source_agreement": 0.88,
                        "prediction_confidence": 0.85
                    },
                    "actions": [
                        "Open Emergency Exits E1 and E2",
                        "Increase exit gate throughput",
                        "Dispatch personnel to guide exiting crowds"
                    ],
                    "risk_score": state.risk_score
                })
                
            # Rule 3: Low Speed
            if state.average_speed < 0.5:
                recommendations.append({
                    "type": "DEPLOY_POLICE",
                    "target": state.zone_id,
                    "message": "Deploy 5 Police officers. Crowd movement has stalled, potential bottleneck.",
                    "explanation": {
                        "primary_reason": "Crowd movement has stalled significantly",
                        "supporting_factors": [
                            f"Average speed is {state.average_speed:.2f} m/s",
                            "High probability of localized panic or incident"
                        ],
                        "source_agreement": 0.92,
                        "prediction_confidence": 0.89
                    },
                    "actions": [
                        "Deploy 5 Police officers to investigate stall",
                        "Monitor CCTV feeds for trip hazards or fights",
                        "Prepare medical response team on standby"
                    ],
                    "risk_score": state.risk_score
                })
                
        return recommendations
