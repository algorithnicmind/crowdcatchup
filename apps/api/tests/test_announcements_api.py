import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def auth_headers(client: AsyncClient):
    email = f"announce_user_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "TestPassword123",
        "full_name": "Announcement Tester",
        "role": "AUTHORITY"
    })
    resp = await client.post("/api/v1/auth/login", json={"identifier": email, "password": "TestPassword123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_broadcast_announcement(client: AsyncClient, auth_headers):
    payload = {
        "event_id": "EVT-001",
        "message_en": "Please remain calm. The event is proceeding normally.",
        "message_hi": "कृपया शांत रहें। कार्यक्रम सामान्य रूप से चल रहा है।",
        "message_od": "ଦୟାକରି ଶାନ୍ତ ରୁହନ୍ତୁ।",
        "target_zone": "ALL",
        "severity": "INFO"
    }
    resp = await client.post("/api/v1/announcements/broadcast", json=payload, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "id" in data


@pytest.mark.asyncio
async def test_broadcast_warning_announcement(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/announcements/broadcast", json={
        "event_id": "EVT-001",
        "message_en": "Crowd density increasing in Zone A. Please use alternate routes.",
        "severity": "WARNING",
        "target_zone": "ZONE-A"
    }, headers=auth_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_broadcast_critical_announcement(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/announcements/broadcast", json={
        "event_id": "EVT-001",
        "message_en": "EMERGENCY: Evacuate Zone B immediately via Exit Route 2.",
        "severity": "CRITICAL",
        "target_zone": "ZONE-B"
    }, headers=auth_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_announcements(client: AsyncClient, auth_headers):
    for i in range(3):
        await client.post("/api/v1/announcements/broadcast", json={
            "event_id": "EVT-ANN-GET",
            "message_en": f"Announcement {i}",
            "severity": "INFO"
        }, headers=auth_headers)

    resp = await client.get("/api/v1/announcements/EVT-ANN-GET", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert len(data["data"]) >= 3


@pytest.mark.asyncio
async def test_get_announcements_empty(client: AsyncClient, auth_headers):
    resp = await client.get("/api/v1/announcements/EVT-NO-ANN", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["data"] == []


@pytest.mark.asyncio
async def test_announcement_multilingual(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/announcements/broadcast", json={
        "event_id": "EVT-001",
        "message_en": "English message",
        "message_hi": "Hindi message",
        "message_od": "Odia message",
        "severity": "INFO"
    }, headers=auth_headers)
    assert resp.status_code == 200

    ann_id = resp.json()["id"]
    list_resp = await client.get("/api/v1/announcements/EVT-001", headers=auth_headers)
    anns = [a for a in list_resp.json()["data"] if a["id"] == ann_id]
    assert len(anns) == 1
    assert anns[0]["message_en"] == "English message"
    assert anns[0]["message_hi"] == "Hindi message"
    assert anns[0]["message_od"] == "Odia message"
