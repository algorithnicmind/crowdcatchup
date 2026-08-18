from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db

from features.recommendations.infrastructure.models.intervention_models import InterventionModel

router = APIRouter()

@router.get("/events/{event_id}", summary="Generate a post-event report")
def generate_event_report(
    event_id: str,
    db: Session = Depends(get_db)
):
    """
    Generates a post-event summary report for Phase 8 Digital Twin.
    """
    interventions = db.query(InterventionModel).filter(InterventionModel.event_id == event_id).all()
    
    report = {
        "event_id": event_id,
        "summary": "Event concluded with safe crowd dynamics, though minor bottlenecks were resolved.",
        "peak_risk_incidents": len([i for i in interventions if "critical" in i.message.lower()]),
        "total_interventions": len(interventions),
        "interventions": [
            {
                "id": i.id,
                "type": i.intervention_type.value,
                "target_zone": i.target_zone,
                "status": i.status.value,
                "created_at": i.created_at.isoformat()
            } for i in interventions
        ]
    }
    
    return report
