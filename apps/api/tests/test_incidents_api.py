import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def auth_headers(client: AsyncClient):
    email = f"incident_user_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "TestPassword123",
        "full_name": "Incident Tester",
        "role": "AUTHORITY"
    })
    resp = await client.post("/api/v1/auth/login", json={"identifier": email, "password": "TestPassword123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_report_incident(client: AsyncClient, auth_headers):
    payload = {
        "event_id": "EVT-001",
        "type": "SOS",
        "lat": 25.4308,
        "lng": 81.8503,
        "description": "Person collapsed near Gate A"
    }
    resp = await client.post("/api/v1/incidents/report", json=payload, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "incident_id" in data


@pytest.mark.asyncio
async def test_report_incident_types(client: AsyncClient, auth_headers):
    for inc_type in ["SOS", "OVERCROWDING", "MEDICAL", "SUSPICIOUS_ACTIVITY"]:
        payload = {
            "event_id": "EVT-001",
            "type": inc_type,
            "lat": 25.43,
            "lng": 81.85
        }
        resp = await client.post("/api/v1/incidents/report", json=payload, headers=auth_headers)
        assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_incidents_for_event(client: AsyncClient, auth_headers):
    for _ in range(3):
        await client.post("/api/v1/incidents/report", json={
            "event_id": "EVT-TEST-LIST",
            "type": "MEDICAL",
            "lat": 25.43,
            "lng": 81.85
        }, headers=auth_headers)

    resp = await client.get("/api/v1/incidents/EVT-TEST-LIST", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert len(data["data"]) >= 3


@pytest.mark.asyncio
async def test_resolve_incident(client: AsyncClient, auth_headers):
    report_resp = await client.post("/api/v1/incidents/report", json={
        "event_id": "EVT-RESOLVE",
        "type": "SOS",
        "lat": 25.43,
        "lng": 81.85,
        "description": "Test resolve"
    }, headers=auth_headers)
    incident_id = report_resp.json()["incident_id"]

    resp = await client.post(f"/api/v1/incidents/{incident_id}/resolve", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"


@pytest.mark.asyncio
async def test_resolve_nonexistent_incident(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/incidents/inc-nonexistent/resolve", headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_incidents_empty_event(client: AsyncClient, auth_headers):
    resp = await client.get("/api/v1/incidents/EVT-EMPTY-NO-INCIDENTS", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["data"] == []
