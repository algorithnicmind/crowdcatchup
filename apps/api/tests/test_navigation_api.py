import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_plan_route(client: AsyncClient):
    payload = {
        "event_id": "EVT-001",
        "start_zone_id": "ENTRANCE_A",
        "end_zone_id": "EXIT_B",
        "group_size": 1
    }
    resp = await client.post("/api/v1/navigation/plan", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SAFE"
    assert len(data["path"]) >= 2
    assert data["estimated_time_mins"] > 0


@pytest.mark.asyncio
async def test_plan_route_large_group(client: AsyncClient):
    payload = {
        "event_id": "EVT-001",
        "start_zone_id": "ENTRANCE_A",
        "end_zone_id": "EXIT_B",
        "group_size": 10
    }
    resp = await client.post("/api/v1/navigation/plan", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "route_id" in data


@pytest.mark.asyncio
async def test_plan_route_has_path(client: AsyncClient):
    resp = await client.post("/api/v1/navigation/plan", json={
        "event_id": "EVT-001",
        "start_zone_id": "ENTRANCE_A",
        "end_zone_id": "EXIT_B",
        "group_size": 1
    })
    data = resp.json()
    for point in data["path"]:
        assert "lat" in point
        assert "lng" in point
