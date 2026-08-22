import asyncio
import logging
from sqlalchemy import select
from core.database import async_session_factory
from core.security import hash_password
from features.auth.infrastructure.models.user_model import UserModel
from features.events.infrastructure.models.event_models import (
    EventModel, ZoneModel, GateModel, RouteModel, SourceModel,
)
import uuid

logger = logging.getLogger(__name__)

EVENT_ID = "EVT-001"


async def seed_demo_event():
    """Seed a demo event with zones, gates, routes, and sources if none exist."""
    async with async_session_factory() as session:
        try:
            result = await session.execute(select(EventModel).limit(1))
            if result.scalars().first():
                logger.info("Event already exists. Skipping event seed.")
                return

            logger.info("Seeding demo event...")

            event = EventModel(
                id=EVENT_ID,
                name="Kumbh Mela 2026 — Prayagraj",
                description="World's largest peaceful gathering. CrowdShield monitoring demo.",
                venue_polygon=[
                    {"lat": 25.4358, "lng": 81.8463},
                    {"lat": 25.4358, "lng": 81.8563},
                    {"lat": 25.4258, "lng": 81.8563},
                    {"lat": 25.4258, "lng": 81.8463},
                ],
                status="ACTIVE",
                owner_id="OWNER-001",
                expected_attendance=50000,
                max_capacity=80000,
            )

            zones = [
                ZoneModel(
                    id="ZONE-A",
                    event_id=EVENT_ID,
                    name="Main Bathing Area",
                    polygon=[
                        {"lat": 25.4348, "lng": 81.8473},
                        {"lat": 25.4348, "lng": 81.8533},
                        {"lat": 25.4298, "lng": 81.8533},
                        {"lat": 25.4298, "lng": 81.8473},
                    ],
                    capacity=20000,
                    warning_threshold=12000,
                    critical_threshold=16000,
                    zone_type="BATHING",
                ),
                ZoneModel(
                    id="ZONE-B",
                    event_id=EVENT_ID,
                    name="Northern Corridor",
                    polygon=[
                        {"lat": 25.4358, "lng": 81.8483},
                        {"lat": 25.4358, "lng": 81.8553},
                        {"lat": 25.4318, "lng": 81.8553},
                        {"lat": 25.4318, "lng": 81.8483},
                    ],
                    capacity=15000,
                    warning_threshold=9000,
                    critical_threshold=12000,
                    zone_type="CORRIDOR",
                ),
            ]

            gates = [
                GateModel(id="GATE-A1", event_id=EVENT_ID, zone_id="ZONE-A", name="Gate A — North Entry", location={"lat": 25.4348, "lng": 81.8503}, type="ENTRY", status="OPEN", capacity_per_minute=60),
                GateModel(id="GATE-A2", event_id=EVENT_ID, zone_id="ZONE-A", name="Gate A — South Exit", location={"lat": 25.4298, "lng": 81.8503}, type="EXIT", status="OPEN", capacity_per_minute=60),
                GateModel(id="GATE-B1", event_id=EVENT_ID, zone_id="ZONE-B", name="Gate B — East Entry", location={"lat": 25.4338, "lng": 81.8553}, type="ENTRY", status="OPEN", capacity_per_minute=45),
                GateModel(id="GATE-B2", event_id=EVENT_ID, zone_id="ZONE-B", name="Gate B — West Exit", location={"lat": 25.4338, "lng": 81.8483}, type="EXIT", status="OPEN", capacity_per_minute=45),
            ]

            routes = [
                RouteModel(id="ROUTE-01", event_id=EVENT_ID, name="Main Path — Zone A to B", path=[{"lat": 25.4348, "lng": 81.8503}, {"lat": 25.4348, "lng": 81.8543}], type="TWO_WAY", is_active=True, capacity=200),
            ]

            sources = [
                SourceModel(id="SRC-CCTV-01", event_id=EVENT_ID, source_type="CCTV", name="CCTV — Zone A Center", location_description="Main bathing area camera", is_active=True),
                SourceModel(id="SRC-SG-01", event_id=EVENT_ID, source_type="SMART_GATE", name="Smart Gate — Gate A1", location_description="North entry smart gate sensor", is_active=True),
            ]

            session.add(event)
            session.add_all(zones)
            session.add_all(gates)
            session.add_all(routes)
            session.add_all(sources)
            await session.commit()
            logger.info("Successfully seeded demo event with zones, gates, routes, and sources.")

        except Exception as e:
            await session.rollback()
            logger.error(f"Failed to seed demo event: {e}")


async def seed_users():
    """Seed the database with default test users if they don't exist."""
    async with async_session_factory() as session:
        try:
            logger.info("Seeding database with default test users...")
            
            default_password = hash_password("Password123!")

            users_to_seed = [
                UserModel(id=str(uuid.uuid4()), email="admin@test.com", phone_number="1000000001", hashed_password=default_password, full_name="Admin Authority", role="AUTHORITY", is_active=True),
                UserModel(id=str(uuid.uuid4()), email="police@test.com", phone_number="1000000002", hashed_password=default_password, full_name="Police Officer", role="POLICE", is_active=True),
                UserModel(id=str(uuid.uuid4()), email="owner@test.com", phone_number="1000000003", hashed_password=default_password, full_name="Event Owner", role="EVENT_OWNER", is_active=True),
                UserModel(id=str(uuid.uuid4()), email="citizen@test.com", phone_number="1000000004", hashed_password=default_password, full_name="Citizen One", role="CITIZEN", is_active=True),
                UserModel(id=str(uuid.uuid4()), email="citizen2@test.com", phone_number="1000000005", hashed_password=default_password, full_name="Citizen Two", role="CITIZEN", is_active=True),
                UserModel(id=str(uuid.uuid4()), email="citizen3@test.com", phone_number="1000000006", hashed_password=default_password, full_name="Citizen Three", role="CITIZEN", is_active=True),
            ]

            seeded_count = 0
            for user in users_to_seed:
                result = await session.execute(select(UserModel).where(UserModel.email == user.email))
                existing_user = result.scalars().first()
                if not existing_user:
                    session.add(user)
                    seeded_count += 1
            
            if seeded_count > 0:
                await session.commit()
                logger.info(f"Successfully seeded {seeded_count} test users.")
            else:
                logger.info("All test users already exist in database. Skipping seed.")

        except Exception as e:
            await session.rollback()
            logger.error(f"Failed to seed users: {e}")

if __name__ == "__main__":
    asyncio.run(seed_users())
