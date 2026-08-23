import time
import pytest
from ai.pipelines.analytics_pipeline import AnalyticsPipeline
from ai.domain.entities.detection import TrackedObject


def test_analytics_pipeline():
    pipeline = AnalyticsPipeline(max_capacity=100)

    obj1 = TrackedObject(track_id=1, bbox=(0, 0, 10, 10))
    obj2 = TrackedObject(track_id=2, bbox=(20, 20, 30, 30))

    res1 = pipeline.process([obj1, obj2])
    assert res1["active_tracks"] == 2
    assert res1["occupancy_percentage"] == 2.0

    time.sleep(0.1)

    res2 = pipeline.process([obj2])
    assert res2["active_tracks"] == 1
    assert res2["occupancy_percentage"] == 1.0

    assert pipeline.last_seen[1] < pipeline.last_seen[2]


def test_analytics_empty_frame():
    pipeline = AnalyticsPipeline(max_capacity=100)
    res = pipeline.process([])
    assert res["active_tracks"] == 0
    assert res["occupancy_percentage"] == 0.0
    assert res["dwell_time_seconds"] == 0.0


def test_analytics_occupancy_capped_at_100():
    pipeline = AnalyticsPipeline(max_capacity=5)
    objs = [TrackedObject(track_id=i, bbox=(i, i, i + 1, i + 1)) for i in range(10)]
    res = pipeline.process(objs)
    assert res["occupancy_percentage"] == 100.0
    assert res["active_tracks"] == 10


def test_analytics_dwell_time_computed_after_timeout():
    pipeline = AnalyticsPipeline(max_capacity=100)
    pipeline.timeout_s = 0.05

    obj = TrackedObject(track_id=1, bbox=(0, 0, 10, 10))
    pipeline.process([obj])
    time.sleep(0.1)
    pipeline.process([])

    assert len(pipeline.completed_dwell_times) == 1
    assert pipeline.completed_dwell_times[0] >= 0.05


def test_analytics_max_capacity_zero():
    pipeline = AnalyticsPipeline(max_capacity=0)
    res = pipeline.process([TrackedObject(track_id=1, bbox=(0, 0, 10, 10))])
    assert res["occupancy_percentage"] == 0.0
