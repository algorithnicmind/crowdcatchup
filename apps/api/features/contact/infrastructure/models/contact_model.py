from sqlalchemy import Column, String, Text, DateTime
from datetime import datetime, timezone
from core.database import Base


class ContactSubmissionModel(Base):
    __tablename__ = "contact_submissions"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    message = Column(Text, nullable=False)
    status = Column(String, default="NEW", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
