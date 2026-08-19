import requests
import time
from datetime import datetime
import random

API_URL = "http://localhost:8000/v1/ingest"

def run_advanced_simulators(event_id: str, duration_sec: int, rate_per_sec: int):
    """
    Simulates Drone, BLE, and Telecom sources as SYNTHETIC.
    Provides fake telemetry for advanced data sources.
    """
    print(f"Starting advanced simulators for {event_id}. Injecting {rate_per_sec} obs/sec for {duration_sec}s...")
    
    sources = [
        {"id": "DRONE-01", "type": "SYNTHETIC", "metric": "people_count", "val_range": (100, 1000)},
        {"id": "BLE-SCAN-01", "type": "SYNTHETIC", "metric": "device_count", "val_range": (50, 400)},
        {"id": "TELECOM-TWR-01", "type": "SYNTHETIC", "metric": "active_connections", "val_range": (500, 5000)},
    ]
    
    total = duration_sec * rate_per_sec
    success = 0
    
    for i in range(total):
        source = random.choice(sources)
        payload = {
            "event_id": event_id,
            "source_id": source["id"],
            "source_type": source["type"],
            "zone_id": f"Zone-{random.choice(['A', 'B', 'C'])}",
            "timestamp": datetime.utcnow().isoformat(),
            "metric": source["metric"],
            "value": random.randint(*source["val_range"]),
            "confidence": round(random.uniform(0.6, 0.95), 2),
            "latency_ms": random.randint(100, 500), # Advanced sources might have higher latency
            "health": "ONLINE"
        }
        
        try:
            res = requests.post(API_URL, json=payload)
            if res.status_code == 200:
                success += 1
        except Exception as e:
            print(f"Error: {e}")
            
        time.sleep(1.0 / rate_per_sec)
        
    print(f"Advanced simulation complete. Ingested {success}/{total} observations.")

if __name__ == "__main__":
    run_advanced_simulators("test-demo-event", 10, 5)
