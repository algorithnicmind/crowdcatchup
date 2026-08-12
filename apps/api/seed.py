"""
CrowdShield Backend — Seed Script (Step 1.6)
Populates the database with the "TechNova 2026" demo event and auth users.
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta

from core.database import async_session_factory, init_db
from core.security import hash_password
from features.auth.domain.entities.user import User
from features.auth.domain.enums.role import Role
from features.auth.infrastructure.models.user_model import UserModel

from features.events.domain.entities.event import Event
from features.events.domain.enums.event_status import EventStatus
from features.events.domain.value_objects.geo_point import GeoPoint
from features.events.domain.value_objects.date_range import DateRange
from features.events.infrastructure.models.event_models import (
    EventModel,
    ZoneModel,
    GateModel,
    RouteModel,
)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_data():
    logger.info("Initializing DB for seeding...")
    await init_db()

    async with async_session_factory() as db:
        # 1. Create Default Users (4 Roles)
        logger.info("Seeding users...")
        users = [
            UserModel(
                id="user_auth_1",
                email="authority@crowdshield.local",
                hashed_password=hash_password("Password123"),
                full_name="City Authority",
                role=Role.AUTHORITY.value,
            ),
            UserModel(
                id="user_police_1",
                email="police@crowdshield.local",
                hashed_password=hash_password("Password123"),
                full_name="Police Commander",
                role=Role.POLICE.value,
            ),
            UserModel(
                id="user_owner_1",
                email="owner@technova.local",
                hashed_password=hash_password("Password123"),
                full_name="TechNova Organizer",
                role=Role.EVENT_OWNER.value,
            ),
            UserModel(
                id="user_cit_1",
                email="citizen@example.local",
                hashed_password=hash_password("Password123"),
                full_name="Jane Doe",
                role=Role.CITIZEN.value,
            ),
        ]
        for u in users:
            await db.merge(u)

        # 2. Create TechNova 2026 Event
        logger.info("Seeding TechNova 2026 event...")
        event_id = "evt_technova_2026"
        now = datetime.now(timezone.utc)
        
        event = EventModel(
            id=event_id,
            name="TechNova Challenge 2026",
            description="Massive public tech event and hackathon demo.",
            venue_polygon=[
                {"lat": 28.6149, "lng": 77.2080},
                {"lat": 28.6149, "lng": 77.2100},
                {"lat": 28.6129, "lng": 77.2100},
                {"lat": 28.6129, "lng": 77.2080},
            ],
            start_date=now,
            end_date=now + timedelta(days=2),
            status=EventStatus.LIVE.value,
            owner_id="user_owner_1",
            expected_attendance=50000,
            max_capacity=60000,
        )
        await db.merge(event)

        # 3. Create 5 Zones
        logger.info("Seeding zones...")
        zones = [
            ("zone_main_stage", "Main Stage", 20000, "STAGE", [
                {"lat": 28.6145, "lng": 77.2085}, {"lat": 28.6145, "lng": 77.2095},
                {"lat": 28.6135, "lng": 77.2095}, {"lat": 28.6135, "lng": 77.2085},
            ]),
            ("zone_food_court", "Food Court", 10000, "FOOD", [
                {"lat": 28.6135, "lng": 77.2085}, {"lat": 28.6135, "lng": 77.2090},
                {"lat": 28.6130, "lng": 77.2090}, {"lat": 28.6130, "lng": 77.2085},
            ]),
            ("zone_vip", "VIP Area", 2000, "VIP", []),
            ("zone_entry", "Entry Plaza", 15000, "ASSEMBLY", []),
            ("zone_medical", "Medical Tent", 500, "MEDICAL", []),
        ]
        for z_id, z_name, z_cap, z_type, z_poly in zones:
            zm = ZoneModel(
                id=z_id,
                event_id=event_id,
                name=z_name,
                polygon=z_poly,
                capacity=z_cap,
                warning_threshold=int(z_cap * 0.8),
                critical_threshold=int(z_cap * 0.95),
                zone_type=z_type,
            )
            await db.merge(zm)

        # 4. Create 6 Gates
        logger.info("Seeding gates...")
        for i in range(1, 7):
            gate_type = "ENTRY" if i <= 3 else "EXIT"
            if i == 6:
                gate_type = "EMERGENCY"
            # Offset locations slightly for gates
            loc = {"lat": 28.6149, "lng": 77.2080 + (i * 0.0003)}
            gm = GateModel(
                id=f"gate_{i}",
                event_id=event_id,
                zone_id="zone_entry",
                name=f"Gate {i}",
                location=loc,
                type=gate_type,
                status="OPEN",
                capacity_per_minute=200,
            )
            await db.merge(gm)

        # 5. Create 8 Routes (including 2 emergency)
        logger.info("Seeding routes...")
        for i in range(1, 9):
            route_type = "TWO_WAY"
            if i >= 7:
                route_type = "EMERGENCY"
            
            # Simple line route for mock
            path = [
                {"lat": 28.6140, "lng": 77.2080 + (i * 0.0002)},
                {"lat": 28.6130, "lng": 77.2080 + (i * 0.0002)}
            ]
            
            rm = RouteModel(
                id=f"route_{i}",
                event_id=event_id,
                name=f"Route {i}",
                path=path,
                type=route_type,
                capacity=5000,
            )
            await db.merge(rm)

        await db.commit()
        logger.info("Seed complete! Run `uvicorn main:app --reload` to start.")


if __name__ == "__main__":
    asyncio.run(seed_data())
