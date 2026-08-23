import pytest
from ai.pipelines.anomaly_detection import AnomalyDetectionPipeline


def test_no_anomaly_low_density():
    pipeline = AnomalyDetectionPipeline()
    result = pipeline.detect({
        "density": 0.5,
        "speed": 1.2,
        "entry_rate": 10,
        "exit_rate": 10
    })
    assert result["bottleneck_score"] == 0.0
    assert result["flow_conflict"] is False
    assert result["stagnant_movement"] is False


def test_bottleneck_high_density_low_speed():
    pipeline = AnomalyDetectionPipeline()
    result = pipeline.detect({
        "density": 2.0,
        "speed": 0.3,
        "entry_rate": 20,
        "exit_rate": 5
    })
    assert result["bottleneck_score"] > 0.0
    assert result["bottleneck_score"] <= 1.0


def test_bottleneck_zero_exit_rate():
    pipeline = AnomalyDetectionPipeline()
    result = pipeline.detect({
        "density": 3.0,
        "speed": 0.2,
        "entry_rate": 30,
        "exit_rate": 0
    })
    assert result["bottleneck_score"] == 1.0


def test_flow_conflict():
    pipeline = AnomalyDetectionPipeline()
    result = pipeline.detect({
        "density": 3.0,
        "speed": 0.1,
        "entry_rate": 60,
        "exit_rate": 60
    })
    assert result["flow_conflict"] is True


def test_stagnant_movement():
    pipeline = AnomalyDetectionPipeline()
    result = pipeline.detect({
        "density": 1.5,
        "speed": 0.05,
        "entry_rate": 10,
        "exit_rate": 10
    })
    assert result["stagnant_movement"] is True


def test_no_stagnant_when_moving():
    pipeline = AnomalyDetectionPipeline()
    result = pipeline.detect({
        "density": 1.5,
        "speed": 0.5,
        "entry_rate": 10,
        "exit_rate": 10
    })
    assert result["stagnant_movement"] is False
