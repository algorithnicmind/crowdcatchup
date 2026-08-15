import cv2
import time
import argparse
import logging
from adapters.backend_adapter import BackendAdapter
from pipelines.cv_pipeline import CrowdCVPipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="CrowdShield CV Pipeline")
    parser.add_argument("--source", type=str, default="0", help="Video source (0 for webcam, or path to mp4)")
    parser.add_argument("--backend", type=str, default="http://localhost:8000/api/v1/ingest", help="Backend ingest URL")
    parser.add_argument("--source-id", type=str, default="camera_main", help="ID of this camera source")
    parser.add_argument("--zone-id", type=str, default="zone_entry", help="ID of the zone this camera monitors")
    parser.add_argument("--interval", type=int, default=5, help="Seconds between sending metrics to the backend")
    args = parser.parse_args()

    # Initialize Backend Bridge
    adapter = BackendAdapter(backend_url=args.backend)
    
    # Initialize YOLOv8 Pipeline
    pipeline = CrowdCVPipeline(model_path="yolov8n.pt", confidence_threshold=0.3)

    source = 0 if args.source == "0" else args.source
    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        logger.error(f"Failed to open video source: {source}")
        return

    logger.info(f"Started video capture from {source}")

    last_post_time = time.time()
    total_flow_in_interval = 0
    total_flow_out_interval = 0
    current_density = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                logger.info("Video stream ended.")
                break

            # 1. Process Frame
            annotated_frame, density, flow_in, flow_out = pipeline.process_frame(frame)
            
            # Accumulate metrics for the current interval
            current_density = density
            total_flow_in_interval += flow_in
            total_flow_out_interval += flow_out

            # 2. Display
            cv2.imshow("CrowdShield CV Pipeline", annotated_frame)

            # 3. Post to backend every N seconds
            now = time.time()
            if now - last_post_time >= args.interval:
                logger.info(f"Posting metrics - Density: {current_density}, Flow In: {total_flow_in_interval}, Flow Out: {total_flow_out_interval}")
                
                # Send Density
                adapter.post_observation(
                    metric="density", 
                    value=float(current_density),
                    source_id=args.source_id,
                    zone_id=args.zone_id
                )
                
                # Send Flow In
                if total_flow_in_interval > 0:
                    adapter.post_observation(
                        metric="flow_in", 
                        value=float(total_flow_in_interval),
                        source_id=args.source_id,
                        zone_id=args.zone_id
                    )
                
                # Send Flow Out
                if total_flow_out_interval > 0:
                    adapter.post_observation(
                        metric="flow_out", 
                        value=float(total_flow_out_interval),
                        source_id=args.source_id,
                        zone_id=args.zone_id
                    )

                # Reset interval counters
                total_flow_in_interval = 0
                total_flow_out_interval = 0
                last_post_time = now

            # Quit on 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                logger.info("Quit signal received.")
                break

    except KeyboardInterrupt:
        logger.info("Interrupted by user.")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        logger.info("Cleaned up resources.")

if __name__ == "__main__":
    main()
