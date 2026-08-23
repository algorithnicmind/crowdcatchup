import pytest
from ai.pipelines.decision_engine import DecisionEngine


def test_low_risk_no_actions():
    engine = DecisionEngine()
    result = engine.generate_recommendations(
        zone_id="zone-1",
        crowd_features={"density": 0.5, "density_growth_rate": 0.1, "bottleneck_score": 0.0},
        risk_data={"current_risk_score": 20, "current_risk_level": "LOW"}
    )
    assert result["risk_level"] == "LOW"
    assert len(result["actions"]) == 0


def test_low_risk_with_growth_rate():
    engine = DecisionEngine()
    result = engine.generate_recommendations(
        zone_id="zone-1",
        crowd_features={"density": 1.0, "density_growth_rate": 0.8, "bottleneck_score": 0.0},
        risk_data={"current_risk_score": 35, "current_risk_level": "MODERATE"}
    )
    assert result["risk_level"] == "MODERATE"
    assert any(a["type"] == "MONITOR" for a in result["actions"])


def test_high_risk_high_density():
    engine = DecisionEngine()
    result = engine.generate_recommendations(
        zone_id="zone-2",
        crowd_features={"density": 4.5, "density_growth_rate": 0.2, "bottleneck_score": 0.3},
        risk_data={"current_risk_score": 78, "current_risk_level": "HIGH"}
    )
    assert result["risk_level"] == "HIGH"
    action_types = [a["type"] for a in result["actions"]]
    assert "RESTRICT_ENTRY_GATE" in action_types
    assert "DEPLOY_POLICE" in action_types


def test_critical_risk_bottleneck():
    engine = DecisionEngine()
    result = engine.generate_recommendations(
        zone_id="zone-3",
        crowd_features={"density": 5.0, "density_growth_rate": 1.5, "bottleneck_score": 0.9},
        risk_data={"current_risk_score": 92, "current_risk_level": "CRITICAL"}
    )
    assert result["risk_level"] == "CRITICAL"
    action_types = [a["type"] for a in result["actions"]]
    assert "REDIRECT_CROWD" in action_types
    assert "BROADCAST_WARNING" in action_types
    assert "OPEN_EMERGENCY_ROUTE" in action_types


def test_actions_are_deduplicated():
    engine = DecisionEngine()
    result = engine.generate_recommendations(
        zone_id="zone-4",
        crowd_features={"density": 5.0, "density_growth_rate": 0.0, "bottleneck_score": 0.0},
        risk_data={"current_risk_score": 85, "current_risk_level": "HIGH"}
    )
    keys = [f"{a['type']}-{a['target']}" for a in result["actions"]]
    assert len(keys) == len(set(keys))


def test_result_has_recommendation_id():
    engine = DecisionEngine()
    result = engine.generate_recommendations(
        zone_id="zone-5",
        crowd_features={"density": 1.0, "density_growth_rate": 0.1, "bottleneck_score": 0.0},
        risk_data={"current_risk_score": 15, "current_risk_level": "LOW"}
    )
    assert "recommendation_id" in result
    assert isinstance(result["recommendation_id"], str)
    assert len(result["recommendation_id"]) > 0
