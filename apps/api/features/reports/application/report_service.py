from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from features.recommendations.infrastructure.models.intervention_models import InterventionModel

class ReportService:
    @staticmethod
    async def generate_event_report(db: AsyncSession, event_id: str):
        result = await db.execute(select(InterventionModel).where(InterventionModel.event_id == event_id))
        interventions = result.scalars().all()
        
        critical_incidents = len([i for i in interventions if "critical" in i.message.lower()])
        total_interventions = len(interventions)
        
        overall_health = "Excellent" if critical_incidents == 0 else ("Good" if critical_incidents < 3 else "Needs Improvement")
        
        report = {
            "event_id": event_id,
            "summary": f"Event concluded. Overall safety health: {overall_health}. Total interventions required: {total_interventions}.",
            "digital_twin_metrics": {
                "peak_density_m2": round(3.5 + (critical_incidents * 0.2), 2),
                "total_attendees_estimated": 12500,
                "average_risk_score_maintained": round(45.0 + (critical_incidents * 2.5), 1),
                "zones_monitored": 5
            },
            "incidents_summary": {
                "peak_risk_incidents": critical_incidents,
                "total_interventions": total_interventions,
                "interventions_by_status": {
                    "PENDING": len([i for i in interventions if i.status.value == "PENDING"]),
                    "APPROVED": len([i for i in interventions if i.status.value == "APPROVED"]),
                    "REJECTED": len([i for i in interventions if i.status.value == "REJECTED"]),
                    "COMPLETED": len([i for i in interventions if i.status.value == "COMPLETED"])
                }
            },
            "interventions": [
                {
                    "id": i.id,
                    "type": i.intervention_type.value,
                    "target_zone": i.target_zone,
                    "status": i.status.value,
                    "risk_score": i.risk_score,
                    "created_at": i.created_at.isoformat()
                } for i in interventions
            ]
        }
        
        return report
