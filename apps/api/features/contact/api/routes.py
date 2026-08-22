import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from ..infrastructure.models.contact_model import ContactSubmissionModel

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str


class ContactResponse(BaseModel):
    success: bool
    message: str


@router.post("/contact", response_model=ContactResponse)
async def submit_contact(request: ContactRequest, db: AsyncSession = Depends(get_db)):
    submission = ContactSubmissionModel(
        id=str(uuid.uuid4()),
        name=request.name,
        email=request.email,
        message=request.message,
        status="NEW",
    )
    db.add(submission)
    await db.commit()
    return ContactResponse(success=True, message="Your message has been saved. We'll get back to you soon.")
