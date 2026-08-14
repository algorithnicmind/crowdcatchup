import pytest
from httpx import AsyncClient
import uuid

@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient):
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": unique_email,
        "password": "StrongPassword123",
        "full_name": "Test User",
        "role": "CITIZEN"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == unique_email
    assert "id" in data

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    email = f"dup_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": email,
        "password": "StrongPassword123",
        "full_name": "Test User",
        "role": "CITIZEN"
    }
    # First registration
    response1 = await client.post("/api/v1/auth/register", json=payload)
    assert response1.status_code == 201
    
    # Second registration with same email
    response2 = await client.post("/api/v1/auth/register", json=payload)
    assert response2.status_code == 409
    assert "already registered" in response2.json()["detail"]

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    email = f"login_{uuid.uuid4().hex[:8]}@example.com"
    password = "LoginPassword123"
    
    # Register first
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Login User",
        "role": "AUTHORITY"
    })
    
    # Login
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient):
    email = f"invalid_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "CorrectPassword123",
        "full_name": "Invalid Login User",
        "role": "CITIZEN"
    })
    
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "WrongPassword123"
    })
    
    assert response.status_code == 400
    assert "Invalid email or password" in response.json()["detail"]
