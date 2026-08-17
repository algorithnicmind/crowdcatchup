import cv2
import time
import requests
from datetime import datetime, timezone
import logging
from ..pipelines.cv_pipeline import CrowdCVPipeline
from ..domain.interfaces.i_data_source import IDataSource

logger = logging.getLogger(__name__)

class CctvAdapter(IDataSource):
    def __init__(self, source_id: str, video_path: str, api_url: str, event_id: str = "EVT-001", zone_id: str = "ZONE-A", is_mock: bool = False):
        self.source_id = source_id
        self.video_path = video_path
        self.api_url = api_url
        self.event_id = event_id
        self.zone_id = zone_id
        self.cap = cv2.VideoCapture(self.video_path)
        self.pipeline = CrowdCVPipeline()
        self.is_mock = is_mock
        self.source_type = "SYNTHETIC" if is_mock else "CCTV"
        self.health = "SIMULATED" if is_mock else "ONLINE"
        
    def read_frames(self):
        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break
            yield frame
            
    def release(self):
        self.cap.release()

    def run(self):
        logger.info(f"Starting CCTV Adapter for source {self.source_id}...")
        frame_count = 0
        last_emit_time = time.time()
        
        for frame in self.read_frames():
            annotated_frame, density, flow_in, flow_out = self.pipeline.process_frame(frame)
            frame_count += 1
            
            # Emit observations every 2 seconds
            if time.time() - last_emit_time >= 2.0:
                self.emit_observation("people_count", float(density))
                
                # Mocking speed based on density for the hackathon
                avg_speed = 1.2 if density < 10 else max(0.2, 1.2 - (density * 0.05))
                self.emit_observation("avg_speed", avg_speed)
                
                last_emit_time = time.time()
                
            if frame_count % 30 == 0:
                logger.info(f"[{self.source_id}] Processed {frame_count} frames. Current count: {density}")
                
        self.release()

    def emit_observation(self, metric: str, value: float):
        obs = {
            "event_id": self.event_id,
            "source_id": self.source_id,
            "source_type": self.source_type,
            "zone_id": self.zone_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metric": metric,
            "value": value,
            "confidence": 0.90,
            "latency_ms": 200,
            "health": self.health
        }
        try:
            requests.post(f"{self.api_url}/ingest", json=obs, timeout=2) # URL must include /api/v1 from the caller
        except Exception as e:
            logger.error(f"Failed to push observation: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    adapter = CctvAdapter(
        source_id="SIM-CCTV-01", 
        video_path="crowd.mp4", 
        api_url="http://localhost:8000/api/v1",
        is_mock=True # As per Rule 11, recorded video is simulated
    )
    adapter.run()
