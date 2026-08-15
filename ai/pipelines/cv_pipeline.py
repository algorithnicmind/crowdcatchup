import cv2
from ultralytics import YOLO
import logging

logger = logging.getLogger(__name__)

class CrowdCVPipeline:
    """
    Core CV Pipeline using YOLOv8 for detection and BoT-SORT for tracking.
    """
    def __init__(self, model_path: str = "yolov8n.pt", confidence_threshold: float = 0.3):
        logger.info(f"Loading YOLO model from {model_path}...")
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        
        # State for line-crossing counting
        # For simplicity, we define a horizontal line at some y-coordinate.
        self.line_y = None  
        self.crossed_ids_in = set()
        self.crossed_ids_out = set()
        
        # Store previous y-coordinate to calculate direction
        self.previous_y = {}

    def process_frame(self, frame):
        """
        Process a single frame.
        Returns: (annotated_frame, density, flow_in, flow_out)
        """
        h, w = frame.shape[:2]
        if self.line_y is None:
            # Default line in the middle of the frame
            self.line_y = int(h * 0.5)

        # Run tracking (BoT-SORT is default when persist=True in some versions, or explicitly via tracker)
        # Using persist=True ensures IDs are kept across frames
        results = self.model.track(frame, tracker="botsort.yaml", persist=True, verbose=False, conf=self.confidence_threshold)
        
        density = 0
        flow_in = 0
        flow_out = 0
        annotated_frame = frame.copy()
        
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            
            # Filter for class 0 (person)
            person_boxes = [box for box in boxes if int(box.cls[0]) == 0]
            density = len(person_boxes)
            
            # Plot the boxes onto the frame
            annotated_frame = results[0].plot()
            
            # If we have tracking IDs available
            if boxes.id is not None:
                track_ids = boxes.id.int().cpu().tolist()
                xyxys = boxes.xyxy.cpu().tolist()
                classes = boxes.cls.int().cpu().tolist()
                
                for track_id, box, cls in zip(track_ids, xyxys, classes):
                    if cls != 0: # Only count people
                        continue
                        
                    x1, y1, x2, y2 = box
                    center_y = (y1 + y2) / 2
                    
                    if track_id in self.previous_y:
                        prev_y = self.previous_y[track_id]
                        
                        # Check line crossing
                        # Assuming moving DOWN the screen is "OUT" and UP is "IN"
                        if prev_y < self.line_y and center_y >= self.line_y:
                            if track_id not in self.crossed_ids_out:
                                self.crossed_ids_out.add(track_id)
                                flow_out += 1
                        elif prev_y > self.line_y and center_y <= self.line_y:
                            if track_id not in self.crossed_ids_in:
                                self.crossed_ids_in.add(track_id)
                                flow_in += 1
                                
                    self.previous_y[track_id] = center_y

        # Draw the counting line
        cv2.line(annotated_frame, (0, self.line_y), (w, self.line_y), (0, 255, 0), 2)
        cv2.putText(annotated_frame, "IN (Up)", (10, self.line_y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        cv2.putText(annotated_frame, "OUT (Down)", (10, self.line_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        return annotated_frame, density, flow_in, flow_out
