import pytest
import numpy as np
from ai.pipelines.cv_pipeline import CrowdCVPipeline

def test_cv_pipeline_blank_frame():
    pipeline = CrowdCVPipeline()
    # Create a blank 480x640 image
    blank_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    
    annotated_frame, density, flow_in, flow_out = pipeline.process_frame(blank_frame)
    
    assert density == 0
    assert flow_in == 0
    assert flow_out == 0
    assert annotated_frame is not None
 