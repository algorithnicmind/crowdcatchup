from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from core.database import Base

class AuditLogModel(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
