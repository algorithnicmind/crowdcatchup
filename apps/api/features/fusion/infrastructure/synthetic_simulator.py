import time
import requests
import datetime
import random
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INGEST_URL = "http://localhost:8000/api/v1/ingest"

# Default configuration for "Normal" flow
SCENARIO = "NORMAL"

def generate_observation(zone_id: str, density: float, speed: float) -> dict:
    """Generates a synthetic StandardObservation payload."""
    return {
        "event_id": "EVT-HACKATHON-2026",
        "source_id": f"SYNTH-{zone_id}",
        "source_type": "SYNTHETIC",
        "zone_id": zone_id,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "metric": "density",
        "value": density,
        "confidence": 0.95,
        "latency_ms": random.randint(10, 50),
        "health": "ONLINE"
    }

def run_simulation(scenario: str):
    logger.info(f"Starting Synthetic Simulator with scenario: {scenario}")
    
    zone_id = "ZONE-GATE-3"
    
    # Base parameters
    density = 1.0  # low density
    speed = 1.4    # normal walking speed
    
    tick = 0
    try:
        while True:
            tick += 1
            
            if scenario == "SURGE":
                # Rapidly increase density to simulate a bottleneck
                density += random.uniform(0.2, 0.8)
                speed = max(0.1, speed - random.uniform(0.05, 0.2))
                
                # Cap density around 6.5 (crush conditions)
                density = min(6.5, density)
            else:
                # Normal minor fluctuations
                density = max(0.5, min(2.0, density + random.uniform(-0.1, 0.1)))
                speed = 1.4 + random.uniform(-0.1, 0.1)
                
            obs = generate_observation(zone_id, density, speed)
            
            try:
                response = requests.post(INGEST_URL, json=obs, timeout=2)
                if response.status_code == 200:
                    logger.info(f"[Tick {tick}] Sent synthetic data: Density={density:.2f}, Speed={speed:.2f}")
                else:
                    logger.warning(f"Backend returned status {response.status_code}")
            except requests.exceptions.RequestException as e:
                logger.error(f"Failed to connect to backend: {e}")
                
            # Send an update every 2 seconds
            time.sleep(2)
            
    except KeyboardInterrupt:
        logger.info("Simulator stopped by user.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].upper() == "SURGE":
        SCENARIO = "SURGE"
    
    run_simulation(SCENARIO)
