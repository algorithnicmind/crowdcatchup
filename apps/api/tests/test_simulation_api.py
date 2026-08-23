import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def auth_headers(client: AsyncClient):
    email = f"sim_user_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "TestPassword123",
        "full_name": "Simulation Tester",
        "role": "AUTHORITY"
    })
    resp = await client.post("/api/v1/auth/login", json={"identifier": email, "password": "TestPassword123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_trigger_scenario_normal(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "normal"
    }, headers=auth_headers)
    assert resp.status_code == 200
    assert "triggered successfully" in resp.json()["message"]


@pytest.mark.asyncio
async def test_trigger_scenario_sudden_surge(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "sudden_surge"
    }, headers=auth_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_trigger_scenario_gate_blockage(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "gate_blockage"
    }, headers=auth_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_trigger_scenario_crowd_surge(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "crowd_surge"
    }, headers=auth_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_what_if_no_live_state(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/simulation/what-if", json={
        "event_id": "EVT-001",
        "zone_id": "ZONE-NONEXISTENT",
        "action": "open_gate",
        "modifications": {}
    }, headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_what_if_after_simulation(client: AsyncClient, auth_headers):
    await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "sudden_surge"
    }, headers=auth_headers)

    import asyncio
    await asyncio.sleep(3)

    resp = await client.post("/api/v1/simulation/what-if", json={
        "event_id": "EVT-001",
        "zone_id": "ZONE-A",
        "action": "open_gate",
        "modifications": {}
    }, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "projected_state" in data
    assert "ripple_effects" in data
    assert len(data["ripple_effects"]) >= 1


@pytest.mark.asyncio
async def test_what_if_close_gate(client: AsyncClient, auth_headers):
    await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "normal"
    }, headers=auth_headers)

    import asyncio
    await asyncio.sleep(3)

    resp = await client.post("/api/v1/simulation/what-if", json={
        "event_id": "EVT-001",
        "zone_id": "ZONE-A",
        "action": "close_gate",
        "modifications": {}
    }, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["projected_state"]["density"] > 0


@pytest.mark.asyncio
async def test_what_if_deploy_police(client: AsyncClient, auth_headers):
    await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "normal"
    }, headers=auth_headers)

    import asyncio
    await asyncio.sleep(3)

    resp = await client.post("/api/v1/simulation/what-if", json={
        "event_id": "EVT-001",
        "zone_id": "ZONE-A",
        "action": "deploy_police",
        "modifications": {}
    }, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["projected_state"]["average_speed"] >= 0


@pytest.mark.asyncio
async def test_what_if_custom_modifications(client: AsyncClient, auth_headers):
    await client.post("/api/v1/simulation/scenario", json={
        "event_id": "EVT-001",
        "scenario_id": "normal"
    }, headers=auth_headers)

    import asyncio
    await asyncio.sleep(3)

    resp = await client.post("/api/v1/simulation/what-if", json={
        "event_id": "EVT-001",
        "zone_id": "ZONE-A",
        "action": "custom",
        "modifications": {"density": 5.0, "exit_rate": 0}
    }, headers=auth_headers)
    assert resp.status_code == 200
