import requests
import time
from datetime import datetime
import random

API_URL = "http://localhost:8000/v1/ingest"

def run_scenario(event_id: str, duration_sec: int, rate_per_sec: int):
    """
    Simulates high-load synthetic crowd data injection to test Phase 3 Pipeline.
    """
    print(f"Starting scenario for {event_id}. Injecting {rate_per_sec} obs/sec for {duration_sec}s...")
    
    total = duration_sec * rate_per_sec
    success = 0
    
    for i in range(total):
        payload = {
            "event_id": event_id,
            "source_id": f"SIM-CAM-{random.randint(1, 5)}",
            "source_type": "SYNTHETIC",
            "zone_id": f"Zone-{random.choice(['A', 'B', 'C'])}",
            "timestamp": datetime.utcnow().isoformat(),
            "metric": "people_count",
            "value": random.randint(50, 500),
            "confidence": round(random.uniform(0.7, 1.0), 2),
            "latency_ms": random.randint(5, 50),
            "health": "ONLINE"
        }
        
        try:
            res = requests.post(API_URL, json=payload)
            if res.status_code == 200:
                success += 1
        except Exception as e:
            print(f"Error: {e}")
            
        time.sleep(1.0 / rate_per_sec)
        
    print(f"Scenario complete. Successfully ingested {success}/{total} observations.")

if __name__ == "__main__":
    # Test high load scenario: 10 obs/sec for 10 seconds
    run_scenario("test-demo-event", 10, 10)
