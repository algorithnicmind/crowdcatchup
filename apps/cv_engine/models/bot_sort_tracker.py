from ultralytics import YOLO
import numpy as np
from typing import List
from ..domain.interfaces.i_tracker import ITracker
from ..domain.entities.detection import Detection, TrackedObject

class BotSortTracker(ITracker):
    def __init__(self, model_path: str = "yolov8n.pt"):
        self.model = YOLO(model_path)
        
    def track(self, frame: np.ndarray, detections: List[Detection] = None) -> List[TrackedObject]:
        # We use YOLO's built-in BoT-SORT tracker for optimal performance
        results = self.model.track(frame, persist=True, tracker="botsort.yaml", classes=[0], verbose=False)
        
        tracked_objects = []
        for result in results:
            boxes = result.boxes
            if boxes.id is None:
                continue # No tracking IDs assigned yet
            
            for box, track_id in zip(boxes, boxes.id):
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                tid = int(track_id.item())
                
                tracked_objects.append(TrackedObject(
                    track_id=tid,
                    bbox=(x1, y1, x2, y2),
                    velocity=None,
                    speed=None
                ))
        return tracked_objects
