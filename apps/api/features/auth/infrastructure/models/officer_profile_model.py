from sqlalchemy import Column, String, Boolean, Integer, JSON
from core.database import Base

class OfficerProfileModel(Base):
    __tablename__ = "officer_profiles"

    email = Column(String, primary_key=True, index=True)
    callsign = Column(String, nullable=True)
    assigned_zone = Column(String, nullable=True)
    priority_alert_override = Column(Boolean, default=True)
    tactical_haptics = Column(Boolean, default=True)
    radio_chatter_transcription = Column(Boolean, default=False)
    alert_volume = Column(Integer, default=80)
    map_mode = Column(String, default="Dark Tactical")
    building_geometry_3d = Column(Boolean, default=True)
    unit_radar_overlay = Column(Boolean, default=True)
