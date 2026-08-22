from sqlalchemy import Column, String, DateTime
from datetime import datetime
from core.database import Base

class OrganizationModel(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
