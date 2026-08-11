"""
Auth Feature — User SQLAlchemy Model
Maps the User domain entity to the 'users' database table.
Doc 12 §3.3 Rule 6: DB models map domain entities to database tables.
"""

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from core.database import Base


class UserModel(Base):
    """SQLAlchemy model for the users table."""

    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False, default="")
    role = Column(String, nullable=False, default="CITIZEN")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
