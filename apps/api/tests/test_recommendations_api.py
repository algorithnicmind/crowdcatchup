import pytest
from httpx import AsyncClient
import uuid


@pytest.fixture
async def auth_headers(client: AsyncClient):
    email = f"admin_int_{uuid.uuid4().hex[:8]}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "TestPassword123",
        "full_name": "Admin Intervention Tester",
        "role": "AUTHORITY"
    })
    resp = await client.post("/api/v1/auth/login", json={"identifier": email, "password": "TestPassword123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_get_pending_interventions_empty(client: AsyncClient, auth_headers):
    resp = await client.get("/api/v1/recommendations/interventions/EVT-NO-INTERVENTIONS", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_create_intervention_via_db(client: AsyncClient, auth_headers):
    from sqlalchemy.ext.asyncio import AsyncSession
    from tests.conftest import test_engine
    from features.recommendations.infrastructure.models.intervention_models import InterventionModel
    from features.recommendations.domain.entities.intervention import InterventionStatus, InterventionType
    import uuid as _uuid

    async with AsyncSession(test_engine, expire_on_commit=False) as db:
        intervention = InterventionModel(
            id=str(_uuid.uuid4()),
            event_id="EVT-INT-CRUD",
            target_zone="ZONE-A",
            intervention_type=InterventionType.DEPLOY_POLICE,
            message="Deploy officers to Zone A",
            status=InterventionStatus.PENDING
        )
        db.add(intervention)
        await db.commit()
        intervention_id = intervention.id

    resp = await client.get("/api/v1/recommendations/interventions/EVT-INT-CRUD", headers=auth_headers)
    assert resp.status_code == 200
    interventions = resp.json()
    assert len(interventions) >= 1
    assert any(i["id"] == intervention_id for i in interventions)


@pytest.mark.asyncio
async def test_approve_intervention(client: AsyncClient, auth_headers):
    from sqlalchemy.ext.asyncio import AsyncSession
    from tests.conftest import test_engine
    from features.recommendations.infrastructure.models.intervention_models import InterventionModel
    from features.recommendations.domain.entities.intervention import InterventionStatus, InterventionType
    import uuid as _uuid

    int_id = str(_uuid.uuid4())
    async with AsyncSession(test_engine, expire_on_commit=False) as db:
        db.add(InterventionModel(
            id=int_id,
            event_id="EVT-INT-APPROVE",
            target_zone="ZONE-A",
            intervention_type=InterventionType.OPEN_GATES,
            message="Open emergency gates",
            status=InterventionStatus.PENDING
        ))
        await db.commit()

    resp = await client.post(f"/api/v1/recommendations/interventions/{int_id}/approve", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_reject_intervention(client: AsyncClient, auth_headers):
    from sqlalchemy.ext.asyncio import AsyncSession
    from tests.conftest import test_engine
    from features.recommendations.infrastructure.models.intervention_models import InterventionModel
    from features.recommendations.domain.entities.intervention import InterventionStatus, InterventionType
    import uuid as _uuid

    int_id = str(_uuid.uuid4())
    async with AsyncSession(test_engine, expire_on_commit=False) as db:
        db.add(InterventionModel(
            id=int_id,
            event_id="EVT-INT-REJECT",
            target_zone="ZONE-B",
            intervention_type=InterventionType.RESTRICT_ACCESS,
            message="Restrict access to Zone B",
            status=InterventionStatus.PENDING
        ))
        await db.commit()

    resp = await client.post(f"/api/v1/recommendations/interventions/{int_id}/reject", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_approve_nonexistent_intervention(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/v1/recommendations/interventions/nonexistent-id/approve",
        headers=auth_headers
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_reject_nonexistent_intervention(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/v1/recommendations/interventions/nonexistent-id/reject",
        headers=auth_headers
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_approved_intervention_not_pending(client: AsyncClient, auth_headers):
    from sqlalchemy.ext.asyncio import AsyncSession
    from tests.conftest import test_engine
    from features.recommendations.infrastructure.models.intervention_models import InterventionModel
    from features.recommendations.domain.entities.intervention import InterventionStatus, InterventionType
    import uuid as _uuid

    int_id = str(_uuid.uuid4())
    async with AsyncSession(test_engine, expire_on_commit=False) as db:
        db.add(InterventionModel(
            id=int_id,
            event_id="EVT-INT-VISIBILITY",
            target_zone="ZONE-A",
            intervention_type=InterventionType.BROADCAST_MESSAGE,
            message="Broadcast safety message",
            status=InterventionStatus.PENDING
        ))
        await db.commit()

    await client.post(f"/api/v1/recommendations/interventions/{int_id}/approve", headers=auth_headers)

    resp = await client.get("/api/v1/recommendations/interventions/EVT-INT-VISIBILITY", headers=auth_headers)
    pending = [i for i in resp.json() if i["id"] == int_id]
    assert len(pending) == 0
