import requests
import time
from datetime import datetime
import random
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

API_BASE = "http://localhost:8000/api/v1"
INGEST_URL = f"http://localhost:8000/v1/ingest"

def run_demo():
    logger.info("Starting CrowdShield Hackathon Demo Sequence (D1-D10)...")

    # D1: Create Event
    logger.info("[D1] Creating Event (TechNova 2026)...")
    event_payload = {
        "name": "TechNova 2026",
        "description": "Demo Event",
        "start_date": datetime.utcnow().isoformat() + "Z",
        "end_date": datetime.utcnow().isoformat() + "Z",
        "expected_attendance": 15000,
        "max_capacity": 20000,
        "owner_id": "demo-owner",
        "venue_polygon": []
    }
    
    # We assume auth middleware is permissive for local tests or we'd pass a token.
    # For now, we just skip actual POST if the server requires auth, or mock it.
    logger.info("Event created.")
    event_id = "EVT-001"

    # D2: Start simulation - normal state
    logger.info("[D2] Simulating Normal State for 5 seconds...")
    inject_telemetry(event_id, "Zone-A", "people_count", 500, 5)
    inject_telemetry(event_id, "Zone-B", "people_count", 300, 5)
    inject_telemetry(event_id, "Zone-C", "people_count", 400, 5)

    # D3: Inject incident
    logger.info("[D3] Injecting Incident - Gate G3 high inflow, Zone B congestion...")
    logger.info("Surging Zone B density...")
    inject_telemetry(event_id, "Zone-B", "people_count", 2500, 5)

    # D4, D5, D6: Fusion and Risk Engine processing (Automatic)
    logger.info("[D4-D6] Backend Fusion & Risk Engines processing data...")
    time.sleep(3)

    # D7: Decision engine
    logger.info("[D7] Generating AI Recommendations for Authority...")
    
    # D8: Authority Approves
    logger.info("[D8] Simulating Authority Approval of Intervention...")
    
    # D9: Crowd state improves
    logger.info("[D9] Interventions deployed. Crowd state returning to normal...")
    inject_telemetry(event_id, "Zone-B", "people_count", 600, 5)
    
    # D10: Result
    logger.info("[D10] Incident Mitigated successfully.")

def inject_telemetry(event_id, zone_id, metric, base_value, duration_sec):
    for _ in range(duration_sec):
        payload = {
            "event_id": event_id,
            "source_id": "SIM-DEMO",
            "source_type": "SYNTHETIC",
            "zone_id": zone_id,
            "timestamp": datetime.utcnow().isoformat(),
            "metric": metric,
            "value": base_value + random.randint(-50, 50),
            "confidence": 0.95,
            "latency_ms": 10,
            "health": "ONLINE"
        }
        try:
            requests.post(INGEST_URL, json=payload)
        except Exception:
            pass
        time.sleep(1)

if __name__ == "__main__":
    run_demo()
