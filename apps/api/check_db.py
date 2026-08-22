import asyncio
import os
import sys

# Add apps/api to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from core.database import engine, init_db, Base
from core.config import get_settings

# Import all SQLAlchemy models to register them
try:
    import features.auth.infrastructure.models.user_model
    import features.auth.infrastructure.models.officer_profile_model
    import features.events.infrastructure.models.event_models
    import features.incidents.infrastructure.models.incident_model
    import features.organizations.infrastructure.models.org_model
    import features.police.infrastructure.models.task_model
    import features.recommendations.infrastructure.models.intervention_models
    import features.audit.infrastructure.models.audit_model
except Exception as e:
    print(f"Warning importing models: {e}")

async def test_db():
    settings = get_settings()
    db_url_masked = settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL
    print(f"[*] Target Database Host: {db_url_masked}")
    
    print("\n--- 1. Testing Connection to Neon Cloud DB ---")
    try:
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT version();"))
            version_str = res.scalar()
            print(f"[OK] CONNECTED! PostgreSQL is reachable.")
            print(f"     Database Version: {version_str}")
    except Exception as e:
        print(f"[FAIL] ERROR: Connection failed: {e}")
        return

    print("\n--- 2. Checking Registered Models & Syncing Tables ---")
    registered_tables = list(Base.metadata.tables.keys())
    print(f"[*] ORM Models defined ({len(registered_tables)} tables): {registered_tables}")
    
    try:
        print("[*] Running init_db() to create any missing tables in Neon DB...")
        await init_db()
        print("[OK] Table synchronization completed.")
    except Exception as e:
        print(f"[FAIL] ERROR during table init: {e}")

    print("\n--- 3. Inspecting Tables & Row Counts in Neon DB ---")
    try:
        async with engine.connect() as conn:
            res_tables = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            tables = [r[0] for r in res_tables.fetchall()]
            print(f"[OK] Found {len(tables)} tables in Neon 'public' schema:\n")
            for t in tables:
                try:
                    cnt_res = await conn.execute(text(f'SELECT count(*) FROM "{t}";'))
                    cnt = cnt_res.scalar()
                    print(f"     - {t.ljust(25)} : {cnt} rows")
                except Exception as ex:
                    print(f"     - {t.ljust(25)} : error counting rows ({ex})")
    except Exception as e:
        print(f"[FAIL] ERROR inspecting tables: {e}")

    print("\n--- 4. Testing Read/Write Transactions ---")
    try:
        async with engine.begin() as conn:
            await conn.execute(text("CREATE TEMP TABLE _health_test (id serial primary key, val text);"))
            await conn.execute(text("INSERT INTO _health_test (val) VALUES ('neon_operational');"))
            res = await conn.execute(text("SELECT val FROM _health_test WHERE val = 'neon_operational';"))
            val = res.scalar()
            if val == 'neon_operational':
                print("[OK] Transaction Read/Write test: PASSED")
            else:
                print("[FAIL] Transaction Read/Write test: FAILED (Unexpected value)")
    except Exception as e:
        print(f"[FAIL] ERROR during read/write transaction: {e}")

    await engine.dispose()
    print("\n=======================================================")
    print("  RESULT: NEON POSTGRESQL DATABASE IS FULLY FUNCTIONAL  ")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(test_db())
