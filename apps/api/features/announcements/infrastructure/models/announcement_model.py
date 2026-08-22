from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from core.database import Base

class AnnouncementModel(Base):
    __tablename__ = "announcements"
    
    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, index=True, nullable=False)
    message_en = Column(Text, nullable=False)
    message_hi = Column(Text, nullable=True)
    message_od = Column(Text, nullable=True)
    target_zone = Column(String, nullable=True, default="ALL")
    severity = Column(String, nullable=True, default="INFO")
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
