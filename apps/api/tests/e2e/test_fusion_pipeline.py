import pytest
from fastapi.testclient import TestClient
from main import app
from datetime import datetime

client = TestClient(app)

def test_ingest_observation_e2e():
    """
    End-to-End Test for the Data Ingestion and Fusion Pipeline.
    Validates Phase 3 (Data Hub) functionality.
    """
    payload = {
        "event_id": "test-event-123",
        "source_id": "CCTV-01",
        "source_type": "SYNTHETIC",
        "zone_id": "Zone-A",
        "timestamp": datetime.utcnow().isoformat(),
        "metric": "people_count",
        "value": 150,
        "confidence": 0.95,
        "latency_ms": 10,
        "health": "ONLINE"
    }
    
    # Send to ingestion endpoint
    response = client.post("/v1/ingest", json=payload)
    
    # Assert successful ingestion
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["message"] == "Observation ingested"

