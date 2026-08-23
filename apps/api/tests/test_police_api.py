import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def auth_headers(client: AsyncClient):
    email = f"police_user_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "TestPassword123",
        "full_name": "Police Tester",
        "role": "POLICE"
    })
    resp = await client.post("/api/v1/auth/login", json={"identifier": email, "password": "TestPassword123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, auth_headers):
    payload = {
        "event_id": "EVT-001",
        "zone_id": "ZONE-A",
        "instructions": "Deploy to main entrance, crowd building up",
        "risk_level": "HIGH",
        "required_officers": 3
    }
    resp = await client.post("/v1/police/tasks", json=payload, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "task_id" in data


@pytest.mark.asyncio
async def test_get_tasks_for_event(client: AsyncClient, auth_headers):
    for i in range(3):
        await client.post("/v1/police/tasks", json={
            "event_id": "EVT-TASKS-LIST",
            "zone_id": f"ZONE-{chr(65 + i)}",
            "instructions": f"Task {i}",
            "risk_level": "CRITICAL"
        }, headers=auth_headers)

    resp = await client.get("/v1/police/events/EVT-TASKS-LIST/tasks", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert len(data["data"]) >= 3


@pytest.mark.asyncio
async def test_accept_task(client: AsyncClient, auth_headers):
    create_resp = await client.post("/v1/police/tasks", json={
        "event_id": "EVT-ACCEPT",
        "zone_id": "ZONE-A",
        "instructions": "Accept this task",
        "required_officers": 2
    }, headers=auth_headers)
    task_id = create_resp.json()["task_id"]

    resp = await client.post(f"/v1/police/tasks/{task_id}/accept", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"


@pytest.mark.asyncio
async def test_accept_task_becomes_in_progress(client: AsyncClient, auth_headers):
    create_resp = await client.post("/v1/police/tasks", json={
        "event_id": "EVT-INPROG",
        "zone_id": "ZONE-A",
        "instructions": "Single officer task",
        "required_officers": 1
    }, headers=auth_headers)
    task_id = create_resp.json()["task_id"]

    await client.post(f"/v1/police/tasks/{task_id}/accept", headers=auth_headers)

    tasks_resp = await client.get("/v1/police/events/EVT-INPROG/tasks", headers=auth_headers)
    tasks = tasks_resp.json()["data"]
    task = next(t for t in tasks if t["id"] == task_id)
    assert task["status"] == "IN_PROGRESS"
    assert task["assigned_officers"] == 1


@pytest.mark.asyncio
async def test_resolve_task(client: AsyncClient, auth_headers):
    create_resp = await client.post("/v1/police/tasks", json={
        "event_id": "EVT-RESOLVE-TASK",
        "zone_id": "ZONE-A",
        "instructions": "Resolve this task"
    }, headers=auth_headers)
    task_id = create_resp.json()["task_id"]

    resp = await client.post(f"/v1/police/tasks/{task_id}/resolve", headers=auth_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_resolve_nonexistent_task(client: AsyncClient, auth_headers):
    resp = await client.post("/v1/police/tasks/tsk-nonexistent/resolve", headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_accept_nonexistent_task(client: AsyncClient, auth_headers):
    resp = await client.post("/v1/police/tasks/tsk-nonexistent/accept", headers=auth_headers)
    assert resp.status_code == 404
