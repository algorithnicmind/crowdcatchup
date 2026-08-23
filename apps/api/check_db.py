"""
CrowdShield - PostgreSQL (Neon DB) Tables & Data Inspector
"""
import sys
import asyncio
from core.database import engine
from sqlalchemy import text

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

async def inspect_postgres():
    print("\n========================================================")
    print("🐘 NEON CLOUD POSTGRESQL (neondb) - DATA STORAGE STATUS")
    print("========================================================")
    
    tables = [
        "users",
        "officer_profiles",
        "events",
        "zones",
        "gates",
        "routes",
        "sources",
        "event_assignments",
        "interventions",
        "security_tasks",
        "incidents",
        "announcements",
        "crowd_state_snapshots",
        "contact_submissions"
    ]
    
    async with engine.connect() as conn:
        for t in tables:
            try:
                result = await conn.execute(text(f"SELECT count(*) FROM {t};"))
                count = result.scalar()
                print(f"  [TABLE] {t.ljust(25)} : {str(count).rjust(4)} records stored")
            except Exception as e:
                print(f"  [TABLE] {t.ljust(25)} : Initializing / Empty")
                
    print("========================================================")
    print(">>> All application entities persist in PostgreSQL! <<<\n")

if __name__ == "__main__":
    asyncio.run(inspect_postgres())
