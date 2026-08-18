from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db

from features.fusion.application.fusion_service import zone_states
from .schemas import WhatIfRequest, WhatIfResponse, ScenarioRequest
from ..application.simulation_service import SimulationService

router = APIRouter()

def get_simulation_service(db: Session = Depends(get_db)) -> SimulationService:
    return SimulationService(db)

@router.post("/what-if", response_model=WhatIfResponse, summary="Predict the outcome of an action on a zone")
def run_what_if_analysis(
    request: WhatIfRequest,
    service: SimulationService = Depends(get_simulation_service)
):
    """
    Given a zone and a hypothetical action (like closing a gate), 
    run the XGBoost ML model to predict the ripple effects and new risk score.
    """
    states = zone_states
    if request.zone_id not in states:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Live state for zone {request.zone_id} not found."
        )
        
    current_state = states[request.zone_id]
    result = service.run_what_if(current_state, request)
    return result

@router.post("/scenario", summary="Trigger a simulated scenario")
async def trigger_scenario(
    request: ScenarioRequest,
    service: SimulationService = Depends(get_simulation_service)
):
    """
    Triggers a predefined scenario (e.g., 'crowd_surge') for the Digital Twin simulation.
    """
    await service.trigger_scenario(request.event_id, request.scenario_id)
    return {"message": f"Scenario {request.scenario_id} triggered successfully."}
