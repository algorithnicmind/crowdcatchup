import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def spatial_auth(client: AsyncClient):
    email = f"spatial_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123"
    await client.post("/api/v1/auth/register", json={
        "email": email, "password": password,
        "full_name": "Spatial Owner", "role": "EVENT_OWNER"
    })
    resp = await client.post("/api/v1/auth/login", json={
        "identifier": email, "password": password
    })
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    me = await client.get("/api/v1/auth/me", headers=headers)
    return {"headers": headers, "owner_id": me.json()["id"]}


@pytest.fixture
async def spatial_event(client: AsyncClient, spatial_auth):
    headers = spatial_auth["headers"]
    payload = {
        "name": "Spatial Test Event",
        "description": "Testing spatial features",
        "venue_polygon": [
            {"lat": 40.7128, "lng": -74.0060},
            {"lat": 40.7138, "lng": -74.0060},
            {"lat": 40.7138, "lng": -74.0050},
            {"lat": 40.7128, "lng": -74.0050}
        ],
        "expected_attendance": 5000,
        "max_capacity": 8000,
        "owner_id": spatial_auth["owner_id"]
    }
    resp = await client.post("/api/v1/events", json=payload, headers=headers)
    return {"event_id": resp.json()["id"], "headers": headers}


@pytest.mark.asyncio
async def test_update_venue_boundary(client: AsyncClient, spatial_event):
    event_id = spatial_event["event_id"]
    headers = spatial_event["headers"]

    new_polygon = [
        {"lat": 40.7100, "lng": -74.0080},
        {"lat": 40.7150, "lng": -74.0080},
        {"lat": 40.7150, "lng": -74.0030},
        {"lat": 40.7100, "lng": -74.0030}
    ]
    resp = await client.put(
        f"/api/v1/events/{event_id}/boundary",
        json={"venue_polygon": new_polygon}, headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == event_id
    assert len(data["venue_polygon"]) == 4

    # Verify boundary was persisted by fetching the event
    get_resp = await client.get("/api/v1/events", headers=headers)
    assert get_resp.status_code == 200
    events = get_resp.json()
    updated = next(e for e in events if e["id"] == event_id)
    assert len(updated["venue_polygon"]) == 4


@pytest.mark.asyncio
async def test_create_zone(client: AsyncClient, spatial_event):
    event_id = spatial_event["event_id"]
    headers = spatial_event["headers"]
    zone_payload = {
        "name": "VIP Zone",
        "polygon": [
            {"lat": 40.7130, "lng": -74.0058},
            {"lat": 40.7135, "lng": -74.0058},
            {"lat": 40.7135, "lng": -74.0052},
            {"lat": 40.7130, "lng": -74.0052}
        ],
        "capacity": 200,
        "warning_threshold": 150,
        "critical_threshold": 190,
        "zone_type": "VIP"
    }
    resp = await client.post(
        f"/api/v1/events/{event_id}/zones",
        json=zone_payload, headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert data["name"] == "VIP Zone"
    assert data["capacity"] == 200
    assert data["zone_type"] == "VIP"


@pytest.mark.asyncio
async def test_create_gate(client: AsyncClient, spatial_event):
    event_id = spatial_event["event_id"]
    headers = spatial_event["headers"]
    gate_payload = {
        "zone_id": "zone-test-001",
        "name": "North Entry Gate",
        "location": {"lat": 40.7138, "lng": -74.0055},
        "type": "ENTRY",
        "status": "OPEN",
        "capacity_per_minute": 60
    }
    resp = await client.post(
        f"/api/v1/events/{event_id}/gates",
        json=gate_payload, headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert data["name"] == "North Entry Gate"
    assert data["type"] == "ENTRY"
    assert data["capacity_per_minute"] == 60


@pytest.mark.asyncio
async def test_create_route(client: AsyncClient, spatial_event):
    event_id = spatial_event["event_id"]
    headers = spatial_event["headers"]
    route_payload = {
        "name": "Emergency Evacuation Route",
        "path": [
            {"lat": 40.7130, "lng": -74.0060},
            {"lat": 40.7120, "lng": -74.0070},
            {"lat": 40.7110, "lng": -74.0080}
        ],
        "type": "EMERGENCY",
        "is_active": True,
        "capacity": 300
    }
    resp = await client.post(
        f"/api/v1/events/{event_id}/routes",
        json=route_payload, headers=headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert data["name"] == "Emergency Evacuation Route"
    assert data["type"] == "EMERGENCY"
    assert data["is_active"] is True
    assert len(data["path"]) == 3
