from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.database import get_db
from features.auth.infrastructure.models.officer_profile_model import OfficerProfileModel
from features.auth.api.officer_schemas import OfficerSettingsSchema, OfficerSettingsResponse

router = APIRouter(prefix="/api/v1/officers", tags=["officers"])

@router.get("/settings/{email}", response_model=OfficerSettingsResponse)
async def get_officer_settings(email: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(OfficerProfileModel).where(OfficerProfileModel.email == email))
    profile = result.scalars().first()
    
    if not profile:
        # Return default settings if profile doesn't exist yet
        return OfficerSettingsResponse(
            email=email,
            settings=OfficerSettingsSchema()
        )
        
    return OfficerSettingsResponse(
        email=email,
        settings=OfficerSettingsSchema(
            callsign=profile.callsign,
            assigned_zone=profile.assigned_zone,
            priority_alert_override=profile.priority_alert_override,
            tactical_haptics=profile.tactical_haptics,
            radio_chatter_transcription=profile.radio_chatter_transcription,
            alert_volume=profile.alert_volume,
            map_mode=profile.map_mode,
            building_geometry_3d=profile.building_geometry_3d,
            unit_radar_overlay=profile.unit_radar_overlay
        )
    )

@router.put("/settings/{email}", response_model=OfficerSettingsResponse)
async def update_officer_settings(email: str, settings: OfficerSettingsSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(OfficerProfileModel).where(OfficerProfileModel.email == email))
    profile = result.scalars().first()
    
    if not profile:
        profile = OfficerProfileModel(email=email)
        db.add(profile)
        
    profile.callsign = settings.callsign
    profile.assigned_zone = settings.assigned_zone
    profile.priority_alert_override = settings.priority_alert_override
    profile.tactical_haptics = settings.tactical_haptics
    profile.radio_chatter_transcription = settings.radio_chatter_transcription
    profile.alert_volume = settings.alert_volume
    profile.map_mode = settings.map_mode
    profile.building_geometry_3d = settings.building_geometry_3d
    profile.unit_radar_overlay = settings.unit_radar_overlay
    
    await db.commit()
    await db.refresh(profile)
    
    return OfficerSettingsResponse(
        email=email,
        settings=OfficerSettingsSchema(
            callsign=profile.callsign,
            assigned_zone=profile.assigned_zone,
            priority_alert_override=profile.priority_alert_override,
            tactical_haptics=profile.tactical_haptics,
            radio_chatter_transcription=profile.radio_chatter_transcription,
            alert_volume=profile.alert_volume,
            map_mode=profile.map_mode,
            building_geometry_3d=profile.building_geometry_3d,
            unit_radar_overlay=profile.unit_radar_overlay
        )
    )
