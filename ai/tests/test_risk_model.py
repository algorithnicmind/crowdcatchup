import pytest
import os
import sys

# Add apps api to path to import risk_service
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../apps/api')))

from features.fusion.api.schemas import CrowdStateDTO
from features.risk.application.risk_service import risk_service
from datetime import datetime

def test_risk_model_high_density():
    """Test that high density and fast entry rates yield a high risk score"""
    state = CrowdStateDTO(
        event_id="evt-001",
        zone_id="Zone-A",
        estimated_people=5000,
        density=5.5, # 5.5 people per sqm is very high
        density_level="CRITICAL",
        average_speed=0.2, # Very slow movement
        flow_direction="NORTH",
        entry_rate=150.0, # High influx
        exit_rate=20.0, # Low outflow (bottleneck)
        bottleneck_score=0.9,
        flow_conflict=True,
        risk_score=0.0,
        risk_level="LOW",
        confidence=0.9,
        timestamp=datetime.utcnow()
    )
    
    score = risk_service.predict_risk(state)
    assert score > 70.0, f"Expected high risk score, got {score}"

def test_risk_model_fallback_logic():
    """Test that the model handles missing data gracefully"""
    state = CrowdStateDTO(
        event_id="evt-001",
        zone_id="Zone-A",
        estimated_people=100,
        density=1.0, 
        density_level="LOW",
        average_speed=1.5,
        flow_direction="NORTH",
        entry_rate=10.0,
        exit_rate=10.0,
        bottleneck_score=0.1,
        flow_conflict=False,
        risk_score=0.0,
        risk_level="LOW",
        confidence=0.0, # Missing confidence (camera drop)
        timestamp=datetime.utcnow()
    )
    
    score = risk_service.predict_risk(state)
    assert 0 <= score <= 100, f"Expected valid fallback risk score, got {score}"
