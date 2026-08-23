import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def auth_headers(client: AsyncClient):
    email = f"report_user_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "TestPassword123",
        "full_name": "Report Tester",
        "role": "AUTHORITY"
    })
    resp = await client.post("/api/v1/auth/login", json={"identifier": email, "password": "TestPassword123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_generate_report(client: AsyncClient, auth_headers):
    resp = await client.get("/api/v1/reports/events/EVT-001", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "event_id" in data
    assert "summary" in data
    assert "digital_twin_metrics" in data
    assert "incidents_summary" in data


@pytest.mark.asyncio
async def test_report_structure(client: AsyncClient, auth_headers):
    resp = await client.get("/api/v1/reports/events/EVT-001", headers=auth_headers)
    data = resp.json()
    assert data["event_id"] == "EVT-001"
    metrics = data["digital_twin_metrics"]
    assert "peak_density_m2" in metrics
    assert "total_attendees_estimated" in metrics
    assert "average_risk_score_maintained" in metrics
    assert "zones_monitored" in metrics


@pytest.mark.asyncio
async def test_report_nonexistent_event(client: AsyncClient, auth_headers):
    resp = await client.get("/api/v1/reports/events/EVT-NONEXISTENT", headers=auth_headers)
    assert resp.status_code == 200
