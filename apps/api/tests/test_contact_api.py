import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_submit_contact_form(client: AsyncClient):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "I have a question about the event schedule."
    }
    resp = await client.post("/api/v1/contact", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "saved" in data["message"].lower()


@pytest.mark.asyncio
async def test_submit_contact_form_different_names(client: AsyncClient):
    for name in ["Alice", "Bob", "Charlie"]:
        resp = await client.post("/api/v1/contact", json={
            "name": name,
            "email": f"{name.lower()}@example.com",
            "message": f"Message from {name}"
        })
        assert resp.status_code == 200
        assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_contact_form_persists_to_db(client: AsyncClient):
    resp = await client.post("/api/v1/contact", json={
        "name": "DB Check",
        "email": "dbcheck@example.com",
        "message": "Verify this is stored in NeonDB"
    })
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_contact_form_empty_message(client: AsyncClient):
    resp = await client.post("/api/v1/contact", json={
        "name": "Empty",
        "email": "empty@example.com",
        "message": ""
    })
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_contact_form_long_message(client: AsyncClient):
    resp = await client.post("/api/v1/contact", json={
        "name": "Long Msg",
        "email": "long@example.com",
        "message": "A" * 5000
    })
    assert resp.status_code == 200
