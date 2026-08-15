import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock
from datetime import datetime, timezone
import uuid

@pytest.mark.asyncio
async def test_ingest_observation_success(client: AsyncClient):
    # Using a mocked Redis to prevent actual connection attempt if local Redis is down
    with patch("features.fusion.api.routes.get_redis", new_callable=AsyncMock) as mock_get_redis:
        mock_redis = AsyncMock()
        mock_get_redis.return_value = mock_redis
        
        payload = {
            "event_id": str(uuid.uuid4()),
            "source_id": "CCTV-01",
            "source_type": "CCTV",
            "zone_id": "zone-main-stage",
            "timestamp": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            "metric": "people_count",
            "value": 150.0,
            "confidence": 0.95,
            "latency_ms": 100,
            "health": "ONLINE"
        }
        
        response = await client.post("/v1/ingest", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "Observation ingested" in data["message"]
        
        # Verify redis publish was called
        mock_redis.publish.assert_called_once()
