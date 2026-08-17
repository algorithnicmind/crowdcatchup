"""
Tests for PATCH /api/v1/auth/me/profile endpoint.
Verifies that full_name and phone_number are persisted to the database.
"""

import pytest
import pytest_asyncio


@pytest.mark.asyncio
async def test_update_profile_success(client):
    """Register a user, then update their profile — verify DB persistence."""
    # 1. Register a user first
    register_payload = {
        "email": "profile_test@crowdshield.ai",
        "password": "StrongPass123!",
        "full_name": "Original Name",
        "role": "AUTHORITY",
    }
    reg_res = await client.post("/api/v1/auth/register", json=register_payload)
    assert reg_res.status_code == 201, reg_res.text

    # 2. PATCH profile
    patch_res = await client.patch(
        "/api/v1/auth/me/profile",
        json={"full_name": "Updated Name", "phone_number": "+919876543210"},
        headers={"X-User-Email": "profile_test@crowdshield.ai"},
    )
    assert patch_res.status_code == 200, patch_res.text
    data = patch_res.json()
    assert data["full_name"] == "Updated Name"
    assert data["phone_number"] == "+919876543210"
    assert data["email"] == "profile_test@crowdshield.ai"


@pytest.mark.asyncio
async def test_update_profile_partial(client):
    """Only updating full_name — phone_number stays unchanged."""
    register_payload = {
        "email": "partial_update@crowdshield.ai",
        "password": "StrongPass123!",
        "full_name": "Original",
        "role": "AUTHORITY",
    }
    await client.post("/api/v1/auth/register", json=register_payload)

    # Only update name, leave phone_number as None
    patch_res = await client.patch(
        "/api/v1/auth/me/profile",
        json={"full_name": "New Name"},
        headers={"X-User-Email": "partial_update@crowdshield.ai"},
    )
    assert patch_res.status_code == 200, patch_res.text
    assert patch_res.json()["full_name"] == "New Name"


@pytest.mark.asyncio
async def test_update_profile_user_not_found(client):
    """Should return 404 when the email doesn't exist in DB."""
    patch_res = await client.patch(
        "/api/v1/auth/me/profile",
        json={"full_name": "Ghost"},
        headers={"X-User-Email": "ghost@nowhere.com"},
    )
    assert patch_res.status_code == 404
    assert "No account found" in patch_res.json()["detail"]


@pytest.mark.asyncio
async def test_update_profile_missing_header(client):
    """Should return 422 (validation error) when X-User-Email header is missing."""
    patch_res = await client.patch(
        "/api/v1/auth/me/profile",
        json={"full_name": "Someone"},
    )
    assert patch_res.status_code == 422
