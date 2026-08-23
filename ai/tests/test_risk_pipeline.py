import pytest
from ai.pipelines.risk_pipeline import RiskPipeline


def test_get_risk_level_low():
    pipeline = RiskPipeline.__new__(RiskPipeline)
    assert pipeline.get_risk_level(0) == "LOW"
    assert pipeline.get_risk_level(40) == "LOW"


def test_get_risk_level_moderate():
    pipeline = RiskPipeline.__new__(RiskPipeline)
    assert pipeline.get_risk_level(41) == "MODERATE"
    assert pipeline.get_risk_level(65) == "MODERATE"


def test_get_risk_level_high():
    pipeline = RiskPipeline.__new__(RiskPipeline)
    assert pipeline.get_risk_level(66) == "HIGH"
    assert pipeline.get_risk_level(85) == "HIGH"


def test_get_risk_level_critical():
    pipeline = RiskPipeline.__new__(RiskPipeline)
    assert pipeline.get_risk_level(86) == "CRITICAL"
    assert pipeline.get_risk_level(100) == "CRITICAL"


def test_predict_risk_without_model():
    pipeline = RiskPipeline.__new__(RiskPipeline)
    pipeline.is_loaded = False
    result = pipeline.predict_risk({"density": 1.0})
    assert "error" in result
