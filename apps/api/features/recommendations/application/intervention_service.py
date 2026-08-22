import logging
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import uuid

from .rules_engine import RecommendationEngine
from ..domain.entities.intervention import InterventionStatus, InterventionType
from ..infrastructure.models.intervention_models import InterventionModel
from features.fusion.api.schemas import CrowdStateDTO
from shared.infrastructure.websocket_manager import get_ws_manager

logger = logging.getLogger(__name__)

class InterventionService:
    def __init__(self, db: Session):
        self.db = db

    async def evaluate_and_store_recommendations(self, state: CrowdStateDTO):
        """
        Runs the rules engine on the crowd state and persists any new recommendations
        that don't already have an active pending intervention for that zone/type.
        """
        recs = RecommendationEngine.generate_recommendations(state)
        
        for rec in recs:
            # Check if an identical pending intervention exists
            existing = self.db.query(InterventionModel).filter(
                InterventionModel.event_id == state.event_id,
                InterventionModel.target_zone == rec["target"],
                InterventionModel.intervention_type == InterventionType(rec["type"]),
                InterventionModel.status == InterventionStatus.PENDING
            ).first()
            
            if not existing:
                new_intervention = InterventionModel(
                    id=str(uuid.uuid4()),
                    event_id=state.event_id,
                    target_zone=rec["target"],
                    intervention_type=InterventionType(rec["type"]),
                    message=rec["message"],
                    risk_score=rec.get("risk_score"),
                    explanation=rec.get("explanation"),
                    actions=rec.get("actions"),
                    status=InterventionStatus.PENDING
                )
                self.db.add(new_intervention)
                
                # Broadcast recommendation alert
                ws_manager = get_ws_manager()
                await ws_manager.broadcast_to_event(new_intervention.event_id, {
                    "type": "RECOMMENDATION_ALERT",
                    "payload": {
                        "recommendation_id": new_intervention.id,
                        "event_id": new_intervention.event_id,
                        "zone_id": new_intervention.target_zone,
                        "intervention_type": new_intervention.intervention_type.value,
                        "message": new_intervention.message,
                        "risk_score": new_intervention.risk_score,
                        "explanation": new_intervention.explanation,
                        "actions": new_intervention.actions
                    }
                })
                
        self.db.commit()

    def get_pending_interventions(self, event_id: str) -> List[InterventionModel]:
        return self.db.query(InterventionModel).filter(
            InterventionModel.event_id == event_id,
            InterventionModel.status == InterventionStatus.PENDING
        ).all()

    async def approve_intervention(self, intervention_id: str) -> InterventionModel:
        intervention = self.db.query(InterventionModel).filter(InterventionModel.id == intervention_id).first()
        if not intervention:
            raise ValueError("Intervention not found")
            
        intervention.status = InterventionStatus.APPROVED
        intervention.action_taken_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(intervention)
        
        ws_manager = get_ws_manager()
        
        # Broadcast execution/task WebSocket events
        payload = {
            "intervention_id": intervention.id,
            "target_zone": intervention.target_zone,
            "message": intervention.message,
            "intervention_type": intervention.intervention_type.value
        }
        
        # Broadcast to all Authority clients that the intervention was approved
        await ws_manager.broadcast_to_role(intervention.event_id, "AUTHORITY", {
            "type": "INTERVENTION_APPROVED",
            "payload": payload
        })
        
        if intervention.intervention_type == InterventionType.DEPLOY_POLICE:
            await ws_manager.broadcast_to_role(intervention.event_id, "POLICE", {
                "type": "SECURITY_TASK",
                "payload": payload
            })
        elif intervention.intervention_type == InterventionType.BROADCAST_MESSAGE:
            await ws_manager.broadcast_to_event(intervention.event_id, {
                "type": "CITIZEN_ALERT",
                "payload": payload
            })
        else:
            await ws_manager.broadcast_to_event(intervention.event_id, {
                "type": "EXECUTE_ACTION",
                "payload": payload
            })
            
        return intervention

    async def reject_intervention(self, intervention_id: str) -> InterventionModel:
        intervention = self.db.query(InterventionModel).filter(InterventionModel.id == intervention_id).first()
        if not intervention:
            raise ValueError("Intervention not found")
            
        intervention.status = InterventionStatus.REJECTED
        intervention.action_taken_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(intervention)
        return intervention
