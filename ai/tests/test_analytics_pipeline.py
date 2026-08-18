import time
import pytest
from ai.pipelines.analytics_pipeline import AnalyticsPipeline
from ai.domain.entities.detection import TrackedObject

def test_analytics_pipeline():
    pipeline = AnalyticsPipeline(max_capacity=100)
    
    obj1 = TrackedObject(track_id=1, bbox=(0,0,10,10))
    obj2 = TrackedObject(track_id=2, bbox=(20,20,30,30))
    
    # Process initial frame with 2 objects
    res1 = pipeline.process([obj1, obj2])
    assert res1["active_tracks"] == 2
    assert res1["occupancy_percentage"] == 2.0
    
    # Mock time passing
    time.sleep(0.1)
    
    # Frame 2: obj1 leaves, only obj2 remains
    res2 = pipeline.process([obj2])
    assert res2["active_tracks"] == 1
    assert res2["occupancy_percentage"] == 1.0
    
    # obj1 won't be counted in dwell time until it times out (default 5s)
    # We won't sleep for 5 seconds in a unit test, so we just verify the state.
    assert pipeline.last_seen[1] < pipeline.last_seen[2]
