import uuid
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..infrastructure.models.task_model import SecurityTaskModel
from shared.infrastructure.websocket_manager import get_ws_manager
import asyncio

logger = logging.getLogger(__name__)

class TaskManager:
    @staticmethod
    async def create_task(
        db: AsyncSession, 
        event_id: str, 
        zone_id: str,
        instructions: str,
        risk_level: str = "CRITICAL",
        required_officers: int = 1
    ) -> str:
        task_id = f"tsk-{str(uuid.uuid4())[:8]}"
        
        new_task = SecurityTaskModel(
            id=task_id,
            event_id=event_id,
            zone_id=zone_id,
            risk_level=risk_level,
            instructions=instructions,
            required_officers=required_officers,
            assigned_officers=0,
            status="PENDING",
            created_at=datetime.utcnow()
        )
        db.add(new_task)
        await db.commit()
        
        ws_payload = {
            "type": "NEW_TASK",
            "data": {
                "id": task_id,
                "zone_id": zone_id,
                "risk_level": risk_level,
                "instructions": instructions,
                "required_officers": required_officers,
                "assigned_officers": 0
            }
        }
        
        ws_manager = get_ws_manager()
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(ws_manager.broadcast_to_role(event_id, "POLICE", ws_payload))
        except RuntimeError:
            pass
            
        logger.info(f"Created task {task_id} for zone {zone_id}")
        return task_id

    @staticmethod
    async def get_tasks(db: AsyncSession, event_id: str):
        result = await db.execute(
            select(SecurityTaskModel)
            .where(SecurityTaskModel.event_id == event_id)
            .order_by(SecurityTaskModel.created_at.desc())
        )
        return result.scalars().all()
        
    @staticmethod
    async def accept_task(db: AsyncSession, task_id: str):
        result = await db.execute(select(SecurityTaskModel).where(SecurityTaskModel.id == task_id))
        task = result.scalar_one_or_none()
        if task and task.status != "RESOLVED":
            task.assigned_officers += 1
            if task.assigned_officers >= task.required_officers:
                task.status = "IN_PROGRESS"
            await db.commit()
            return task
        return None
        
    @staticmethod
    async def resolve_task(db: AsyncSession, task_id: str):
        result = await db.execute(select(SecurityTaskModel).where(SecurityTaskModel.id == task_id))
        task = result.scalar_one_or_none()
        if task:
            task.status = "RESOLVED"
            task.resolved_at = datetime.utcnow()
            await db.commit()
            return True
        return False
