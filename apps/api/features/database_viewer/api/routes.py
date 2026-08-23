from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List, Dict, Any
import logging

from core.database import get_db
from features.auth.api.dependencies import get_current_active_user
from features.auth.infrastructure.models.user_model import UserModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/admin/database", tags=["Admin", "Database Viewer"])

def require_authority(user: UserModel = Depends(get_current_active_user)):
    if user.role != "AUTHORITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges. Only AUTHORITY can access this endpoint."
        )
    return user

@router.get("/tables", response_model=List[str])
async def list_tables(
    db: AsyncSession = Depends(get_db),
    user: UserModel = Depends(require_authority)
):
    """
    List all tables in the database. Restricted to AUTHORITY.
    """
    try:
        # PostgreSQL specific query to get all public tables
        query = text(
            "SELECT tablename FROM pg_catalog.pg_tables "
            "WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
        )
        result = await db.execute(query)
        tables = [row[0] for row in result.fetchall()]
        return tables
    except Exception as e:
        logger.error(f"Error fetching tables: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch tables.")

@router.get("/tables/{table_name}", response_model=List[Dict[str, Any]])
async def get_table_data(
    table_name: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    user: UserModel = Depends(require_authority)
):
    """
    Fetch raw data from a specific table. Restricted to AUTHORITY.
    """
    try:
        # Validate table_name to prevent SQL injection (must be alphanumeric/underscores)
        if not table_name.isidentifier():
            raise HTTPException(status_code=400, detail="Invalid table name format.")

        # Query the data
        query = text(f'SELECT * FROM "{table_name}" LIMIT :limit')
        result = await db.execute(query, {"limit": limit})
        
        # Convert rows to dictionary
        # Handle UUIDs and dates by converting them to strings for JSON serialization
        rows = []
        for row in result.mappings().all():
            row_dict = {}
            for key, value in row.items():
                if hasattr(value, "isoformat"):
                    row_dict[key] = value.isoformat()
                else:
                    row_dict[key] = str(value) if value is not None else None
            rows.append(row_dict)
        return rows
    except Exception as e:
        logger.error(f"Error fetching data from table {table_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Could not fetch data for table {table_name}.")
