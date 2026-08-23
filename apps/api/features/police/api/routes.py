from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from ..application.task_manager import TaskManager

router = APIRouter(prefix="/api/v1/police", tags=["Police"])
logger = logging.getLogger(__name__)

class TaskRequest(BaseModel):
    event_id: str
    zone_id: str
    instructions: str
    risk_level: str = "CRITICAL"
    required_officers: int = 1

@router.post("/tasks")
async def create_task(req: TaskRequest, db: AsyncSession = Depends(get_db)):
    task_id = await TaskManager.create_task(
        db, req.event_id, req.zone_id, req.instructions, req.risk_level, req.required_officers
    )
    return {"status": "success", "task_id": task_id}

@router.get("/events/{event_id}/tasks")
async def get_tasks(event_id: str, db: AsyncSession = Depends(get_db)):
    tasks = await TaskManager.get_tasks(db, event_id)
    return {"status": "success", "data": tasks}

@router.post("/tasks/{task_id}/accept")
async def accept_task(task_id: str, db: AsyncSession = Depends(get_db)):
    task = await TaskManager.accept_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or already resolved")
    return {"status": "success", "message": "Task accepted"}

@router.post("/tasks/{task_id}/resolve")
async def resolve_task(task_id: str, db: AsyncSession = Depends(get_db)):
    success = await TaskManager.resolve_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "success", "message": "Task resolved"}
