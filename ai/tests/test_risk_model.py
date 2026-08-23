import pytest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../apps/api')))

from features.fusion.api.schemas import CrowdStateDTO
from features.risk.application.risk_service import risk_service
from datetime import datetime


def test_risk_model_high_density():
    state = CrowdStateDTO(
        event_id="evt-001", zone_id="Zone-A",
        estimated_people=5000, density=5.5, density_level="CRITICAL",
        average_speed=0.2, flow_direction="NORTH",
        entry_rate=150.0, exit_rate=20.0,
        bottleneck_score=0.9, flow_conflict=True,
        risk_score=0.0, risk_level="LOW", confidence=0.9,
        timestamp=datetime.utcnow()
    )
    score = risk_service.predict_risk(state)
    assert score > 70.0, f"Expected high risk score, got {score}"


def test_risk_model_fallback_logic():
    state = CrowdStateDTO(
        event_id="evt-001", zone_id="Zone-A",
        estimated_people=100, density=1.0, density_level="LOW",
        average_speed=1.5, flow_direction="NORTH",
        entry_rate=10.0, exit_rate=10.0,
        bottleneck_score=0.1, flow_conflict=False,
        risk_score=0.0, risk_level="LOW", confidence=0.0,
        timestamp=datetime.utcnow()
    )
    score = risk_service.predict_risk(state)
    assert 0 <= score <= 100, f"Expected valid fallback risk score, got {score}"


def test_risk_model_low_density_low_risk():
    state = CrowdStateDTO(
        event_id="evt-002", zone_id="Zone-B",
        estimated_people=50, density=0.5, density_level="LOW",
        average_speed=1.2, flow_direction="SOUTH",
        entry_rate=5.0, exit_rate=5.0,
        bottleneck_score=0.0, flow_conflict=False,
        risk_score=0.0, risk_level="LOW", confidence=0.95,
        timestamp=datetime.utcnow()
    )
    score = risk_service.predict_risk(state)
    assert score < 40.0, f"Expected low risk score, got {score}"


def test_risk_model_bottleneck_increases_risk():
    base_state = CrowdStateDTO(
        event_id="evt-003", zone_id="Zone-C",
        estimated_people=300, density=3.0, density_level="MODERATE",
        average_speed=0.8, flow_direction="EAST",
        entry_rate=40.0, exit_rate=30.0,
        bottleneck_score=0.2, flow_conflict=False,
        risk_score=0.0, risk_level="LOW", confidence=0.85,
        timestamp=datetime.utcnow()
    )
    score_low_bottleneck = risk_service.predict_risk(base_state)

    high_bottleneck_state = CrowdStateDTO(
        event_id="evt-003", zone_id="Zone-C",
        estimated_people=300, density=3.0, density_level="MODERATE",
        average_speed=0.8, flow_direction="EAST",
        entry_rate=40.0, exit_rate=30.0,
        bottleneck_score=0.9, flow_conflict=False,
        risk_score=0.0, risk_level="LOW", confidence=0.85,
        timestamp=datetime.utcnow()
    )
    score_high_bottleneck = risk_service.predict_risk(high_bottleneck_state)
    assert score_high_bottleneck >= score_low_bottleneck
