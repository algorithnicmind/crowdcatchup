import pytest
from httpx import AsyncClient
import uuid


@pytest.mark.asyncio
async def test_ingest_observation(client: AsyncClient):
    payload = {
        "event_id": "EVT-001",
        "source_id": "CCTV-TEST-01",
        "source_type": "CCTV",
        "zone_id": "ZONE-A",
        "metric": "people_count",
        "value": 150.0,
        "confidence": 0.92,
        "latency_ms": 50,
        "health": "ONLINE"
    }
    resp = await client.post("/v1/ingest", json=payload)
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"


@pytest.mark.asyncio
async def test_ingest_multiple_source_types(client: AsyncClient):
    for source_type in ["CCTV", "SMART_GATE", "GPS", "SYNTHETIC"]:
        payload = {
            "event_id": "EVT-001",
            "source_id": f"SRC-{source_type}-01",
            "source_type": source_type,
            "zone_id": "ZONE-A",
            "metric": "people_count",
            "value": 100.0,
            "confidence": 0.85,
            "health": "ONLINE"
        }
        resp = await client.post("/v1/ingest", json=payload)
        assert resp.status_code == 200


@pytest.mark.asyncio
async def test_ingest_different_metrics(client: AsyncClient):
    for metric in ["people_count", "entry_rate", "exit_rate", "avg_speed"]:
        payload = {
            "event_id": "EVT-001",
            "source_id": "CCTV-METRIC-01",
            "source_type": "CCTV",
            "zone_id": "ZONE-A",
            "metric": metric,
            "value": 50.0,
            "confidence": 0.9,
            "health": "ONLINE"
        }
        resp = await client.post("/v1/ingest", json=payload)
        assert resp.status_code == 200


@pytest.mark.asyncio
async def test_ingest_low_confidence(client: AsyncClient):
    payload = {
        "event_id": "EVT-001",
        "source_id": "CCTV-LOW-CONF",
        "source_type": "CCTV",
        "zone_id": "ZONE-A",
        "metric": "people_count",
        "value": 200.0,
        "confidence": 0.1,
        "health": "DELAYED"
    }
    resp = await client.post("/v1/ingest", json=payload)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_ingest_different_zones(client: AsyncClient):
    for zone in ["ZONE-A", "ZONE-B"]:
        payload = {
            "event_id": "EVT-001",
            "source_id": f"CCTV-{zone}",
            "source_type": "CCTV",
            "zone_id": zone,
            "metric": "people_count",
            "value": 300.0,
            "confidence": 0.88,
            "health": "ONLINE"
        }
        resp = await client.post("/v1/ingest", json=payload)
        assert resp.status_code == 200
