import cv2
import os
from ultralytics import YOLO

def record_demo():
    input_video = 'apps/cv_engine/data/crowd.mp4'
    output_video = 'apps/cv_engine/data/demo_output.mp4'
    
    # Check if we have a real video
    if not os.path.exists(input_video):
        print(f"Warning: {input_video} not found. Ensure you place a video there before running for the demo.")
        return
        
    print(f"Starting Demo Recording from {input_video} to {output_video}...")
    
    cap = cv2.VideoCapture(input_video)
    
    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    os.makedirs('apps/cv_engine/data', exist_ok=True)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video, fourcc, fps, (width, height))
    
    # Load YOLO
    model = YOLO('yolov8n.pt')
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Run YOLO with BoT-SORT
        results = model.track(frame, persist=True, tracker="botsort.yaml", classes=[0], verbose=False)
        
        # Draw bounding boxes and tracking IDs
        if len(results) > 0:
            annotated_frame = results[0].plot()
            
            # Count people
            boxes = results[0].boxes
            people_count = 0
            if boxes is not None:
                people_count = sum([1 for cls in boxes.cls if int(cls) == 0])
                
            # Draw density/count on the frame
            cv2.putText(annotated_frame, f"LIVE COUNT: {people_count}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
            
            out.write(annotated_frame)
        else:
            out.write(frame)
            
        frame_count += 1
        if frame_count % 30 == 0:
            print(f"Processed {frame_count} frames...")
            
    cap.release()
    out.release()
    print(f"Demo recording completed! Saved to {output_video}")

if __name__ == "__main__":
    record_demo()
