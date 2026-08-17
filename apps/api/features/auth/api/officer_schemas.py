from pydantic import BaseModel
from typing import Optional

class OfficerSettingsSchema(BaseModel):
    callsign: Optional[str] = None
    assigned_zone: Optional[str] = None
    priority_alert_override: bool = True
    tactical_haptics: bool = True
    radio_chatter_transcription: bool = False
    alert_volume: int = 80
    map_mode: str = "Dark Tactical"
    building_geometry_3d: bool = True
    unit_radar_overlay: bool = True

class OfficerSettingsResponse(BaseModel):
    email: str
    settings: OfficerSettingsSchema
