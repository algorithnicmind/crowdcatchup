import asyncio
import logging
from sqlalchemy import select
from core.database import async_session_factory
from core.security import hash_password
from features.auth.infrastructure.models.user_model import UserModel
import uuid

logger = logging.getLogger(__name__)

async def seed_users():
    """Seed the database with default test users if they don't exist."""
    async with async_session_factory() as session:
        try:
            # Check if users already exist
            result = await session.execute(select(UserModel).limit(1))
            if result.scalars().first():
                logger.info("Users already exist in database. Skipping seed.")
                return

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

            session.add_all(users_to_seed)
            await session.commit()
            logger.info("Successfully seeded 6 test users.")

        except Exception as e:
            await session.rollback()
            logger.error(f"Failed to seed users: {e}")

if __name__ == "__main__":
    asyncio.run(seed_users())
