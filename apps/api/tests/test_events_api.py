import pytest
from httpx import AsyncClient
import uuid

@pytest.fixture
async def auth_token_and_headers(client: AsyncClient):
    # Register an owner
    email = f"owner_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Event Owner",
        "role": "EVENT_OWNER"
    })
    
    # Login
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    
    token = response.json()["access_token"]
    owner_id = response.json().get("id", "owner-123") # Mocked owner ID for now as we don't have user id in token response
    
    # Actually, token response only has access_token and token_type. 
    # Let's get the user ID from the /me endpoint
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = await client.get("/api/v1/auth/me", headers=headers)
    user_id = me_resp.json()["id"]
    
    return {"headers": headers, "owner_id": user_id}

@pytest.mark.asyncio
async def test_create_and_list_event(client: AsyncClient, auth_token_and_headers):
    headers = auth_token_and_headers["headers"]
    owner_id = auth_token_and_headers["owner_id"]
    
    # Create Event
    event_payload = {
        "name": "Test Event 2026",
        "description": "A huge testing event",
        "venue_polygon": [
            {"lat": 40.7128, "lng": -74.0060},
            {"lat": 40.7138, "lng": -74.0060},
            {"lat": 40.7138, "lng": -74.0050},
            {"lat": 40.7128, "lng": -74.0050}
        ],
        "expected_attendance": 10000,
        "max_capacity": 15000,
        "owner_id": owner_id,
        "start_date": "2026-10-01T10:00:00Z",
        "end_date": "2026-10-05T18:00:00Z"
    }
    
    create_resp = await client.post("/api/v1/events", json=event_payload, headers=headers)
    assert create_resp.status_code == 201
    created_event = create_resp.json()
    assert created_event["name"] == "Test Event 2026"
    event_id = created_event["id"]
    
    # List Events
    list_resp = await client.get("/api/v1/events", headers=headers)
    assert list_resp.status_code == 200
    events = list_resp.json()
    assert any(e["id"] == event_id for e in events)

@pytest.mark.asyncio
async def test_create_zone_gate_route(client: AsyncClient, auth_token_and_headers):
    headers = auth_token_and_headers["headers"]
    owner_id = auth_token_and_headers["owner_id"]
    
    # Create Event first
    event_payload = {
        "name": "Zone Test Event",
        "description": "Testing zones",
        "venue_polygon": [{"lat": 1.0, "lng": 1.0}, {"lat": 1.0, "lng": 2.0}, {"lat": 2.0, "lng": 1.0}],
        "expected_attendance": 500,
        "max_capacity": 1000,
        "owner_id": owner_id
    }
    create_resp = await client.post("/api/v1/events", json=event_payload, headers=headers)
    event_id = create_resp.json()["id"]
    
    # Create Zone
    zone_payload = {
        "name": "Main Stage Zone",
        "polygon": [{"lat": 1.1, "lng": 1.1}, {"lat": 1.1, "lng": 1.2}, {"lat": 1.2, "lng": 1.1}],
        "capacity": 500,
        "warning_threshold": 400,
        "critical_threshold": 480,
        "zone_type": "STAGE"
    }
    zone_resp = await client.post(f"/api/v1/events/{event_id}/zones", json=zone_payload, headers=headers)
    assert zone_resp.status_code == 200
    assert "id" in zone_resp.json()
    
    # Create Gate
    gate_payload = {
        "zone_id": "zone-123", # normally we'd get this from zone_resp but currently it returns success msg
        "name": "Main Entrance",
        "location": {"lat": 1.15, "lng": 1.15},
        "type": "ENTRY",
        "capacity_per_minute": 50
    }
    gate_resp = await client.post(f"/api/v1/events/{event_id}/gates", json=gate_payload, headers=headers)
    assert gate_resp.status_code == 200
    
    # Create Route
    route_payload = {
        "name": "Evacuation Route A",
        "path": [{"lat": 1.1, "lng": 1.1}, {"lat": 0.0, "lng": 0.0}],
        "type": "EMERGENCY",
        "capacity": 200
    }
    route_resp = await client.post(f"/api/v1/events/{event_id}/routes", json=route_payload, headers=headers)
    assert route_resp.status_code == 200
