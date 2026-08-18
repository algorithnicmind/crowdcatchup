from pydantic import BaseModel, Field
from typing import Literal, Dict, Any
from features.fusion.api.schemas import CrowdStateDTO

class WhatIfRequest(BaseModel):
    event_id: str
    zone_id: str
    action: Literal["close_gate", "open_gate", "deploy_police", "custom"]
    modifications: Dict[str, Any] = Field(default_factory=dict, description="Custom modifications like {'exit_rate': 0}")

class WhatIfResponse(BaseModel):
    projected_state: CrowdStateDTO
    ripple_effects: list[str]

class ScenarioRequest(BaseModel):
    event_id: str
    scenario_id: str
