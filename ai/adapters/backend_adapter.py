import requests
import json
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class BackendAdapter:
    """
    Adapter to format YOLOv8 output into StandardObservations and POST to the FastAPI backend.
    """
    def __init__(self, backend_url: str = "http://localhost:8000/api/v1/ingest"):
        self.backend_url = backend_url
        # Use a session for connection pooling and better performance in high-frequency POSTing
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def post_observation(
        self,
        metric: str,
        value: float,
        source_id: str = "camera_01",
        source_type: str = "CCTV",
        event_id: str = "event_001",
        zone_id: Optional[str] = "zone_main",
        confidence: float = 1.0,
        latency_ms: float = 0.0,
        health: str = "ONLINE"
    ) -> bool:
        """
        Sends a single observation to the ingest endpoint.
        """
        payload = {
            "event_id": event_id,
            "source_id": source_id,
            "source_type": source_type,
            "zone_id": zone_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metric": metric,
            "value": value,
            "confidence": confidence,
            "latency_ms": latency_ms,
            "health": health
        }

        try:
            # We add a small timeout to ensure the CV loop doesn't block indefinitely
            response = self.session.post(self.backend_url, json=payload, timeout=2.0)
            if response.status_code in (200, 201, 202):
                logger.debug(f"Successfully posted {metric}={value}")
                return True
            else:
                logger.warning(f"Failed to post observation. Backend returned: {response.status_code} - {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            logger.error(f"Connection error to backend ({self.backend_url}): {e}")
            return False

    def post_batch(self, observations: list[Dict[str, Any]]) -> bool:
        """
        Optional: If the backend supports batch ingestion at /api/v1/ingest/batch
        """
        # Implementation depends on backend capabilities
        pass
