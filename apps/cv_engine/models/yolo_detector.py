import numpy as np
from typing import List
from ..domain.interfaces.i_detector import IDetector
from ..domain.entities.detection import Detection


class Yolov8Detector(IDetector):
    def __init__(self, model_path: str = "yolov8n.pt"):
        from ai.models.model_registry import get_yolo_model
        self.model = get_yolo_model(model_path)
        
    def detect(self, frame: np.ndarray) -> List[Detection]:
        results = self.model(frame, classes=[0], verbose=False)
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls_id = int(box.cls[0].item())
                detections.append(Detection(
                    bbox=(x1, y1, x2, y2),
                    confidence=conf,
                    class_id=cls_id
                ))
        return detections
