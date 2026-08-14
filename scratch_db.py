
import sys

with open("apps/api/core/database.py", "r") as f:
    content = f.read()

# Add connection pooling parameters
pool_args = """    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,"""

content = content.replace("echo=settings.DEBUG,", f"echo=settings.DEBUG,\n{pool_args}")

# Enable PostGIS extension during init_db
postgis_setup = """    async with engine.begin() as conn:
        from sqlalchemy import text
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        except Exception as e:
            # Might fail if user doesn't have superuser rights or extension missing on OS
            pass
        await conn.run_sync(Base.metadata.create_all)"""

content = content.replace("    async with engine.begin() as conn:\n        await conn.run_sync(Base.metadata.create_all)", postgis_setup)

with open("apps/api/core/database.py", "w") as f:
    f.write(content)

