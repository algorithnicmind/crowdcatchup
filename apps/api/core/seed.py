import asyncio
import logging
from sqlalchemy import select
from core.database import async_session_factory
from core.security import hash_password
from features.auth.infrastructure.models.user_model import UserModel
import uuid

logger = logging.getLogger(__name__)

async def seed_users():
    """Seed the database with default Authority user if it doesn't exist."""
    async with async_session_factory() as session:
        try:
            logger.info("Seeding database with default Authority user...")
            
            default_password = hash_password("Password123!")

            users_to_seed = [
                UserModel(id=str(uuid.uuid4()), email="admin@test.com", phone_number="1000000001", hashed_password=default_password, full_name="Admin Authority", role="AUTHORITY", is_active=True),
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
