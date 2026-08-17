import uuid

class DecisionEngine:
    def __init__(self):
        pass
        
    def generate_recommendations(self, zone_id: str, crowd_features: dict, risk_data: dict) -> dict:
        """
        Implements business logic to convert risk & state into actionable recommendations.
        Reference: LLD Section 37 & 39
        """
        current_risk = risk_data.get("current_risk_score", 0)
        risk_level = risk_data.get("current_risk_level", "LOW")
        density = crowd_features.get("density", 0)
        growth_rate = crowd_features.get("density_growth_rate", 0)
        bottleneck = crowd_features.get("bottleneck_score", 0)
        
        actions = []
        supporting_factors = []
        
        # If risk is low or moderate, we might not need critical actions, just monitoring
        if risk_level in ["LOW", "MODERATE"]:
            if growth_rate > 0.5:
                actions.append({"type": "MONITOR", "target": zone_id})
                supporting_factors.append(f"Density is growing at {growth_rate:.2f} p/m2 per min.")
            return {
                "recommendation_id": str(uuid.uuid4()),
                "zone_id": zone_id,
                "risk_level": risk_level,
                "actions": actions,
                "explanation": {
                    "primary_reason": "Conditions are stable.",
                    "supporting_factors": supporting_factors
                }
            }

        # HIGH / CRITICAL Logic
        primary_reason = f"Risk level reached {risk_level} ({current_risk:.1f}/100)"
        
        if density > 4.0:
            actions.append({"type": "RESTRICT_ENTRY_GATE", "target": "ALL_INBOUND"})
            actions.append({"type": "OPEN_EMERGENCY_ROUTE", "target": "NEAREST"})
            actions.append({"type": "DEPLOY_POLICE", "target": zone_id, "amount": 10})
            supporting_factors.append(f"Critical density detected: {density:.2f} p/m2.")
        elif density > 2.5:
            actions.append({"type": "RESTRICT_ENTRY_GATE", "target": "PRIMARY_INBOUND"})
            actions.append({"type": "DEPLOY_POLICE", "target": zone_id, "amount": 5})
            supporting_factors.append(f"High density detected: {density:.2f} p/m2.")
            
        if bottleneck > 0.7:
            actions.append({"type": "REDIRECT_CROWD", "target": "ALTERNATE_ROUTE"})
            supporting_factors.append("Severe bottleneck detected impeding flow.")
            
        if growth_rate > 1.0:
            actions.append({"type": "BROADCAST_WARNING", "target": zone_id, "message_key": "SURGE_WARNING"})
            supporting_factors.append(f"Sudden crowd surge: density growing by {growth_rate:.2f} p/m2 per min.")
            
        # Deduplicate actions
        unique_actions = []
        seen = set()
        for a in actions:
            key = f"{a['type']}-{a['target']}"
            if key not in seen:
                seen.add(key)
                unique_actions.append(a)

        return {
            "recommendation_id": str(uuid.uuid4()),
            "zone_id": zone_id,
            "risk_score": current_risk,
            "risk_level": risk_level,
            "actions": unique_actions,
            "explanation": {
                "primary_reason": primary_reason,
                "supporting_factors": supporting_factors,
                "source_agreement": 0.92, # mock value
                "prediction_confidence": 0.88 # mock value
            }
        }
