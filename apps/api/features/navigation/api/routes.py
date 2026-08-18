from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ....core.database import get_db
from .schemas import RouteRequest, SafeRoute
from ..application.navigation_service import NavigationService

# Re-using the domain entities as schemas for simplicity, 
# but usually we separate them. We'll import from domain here.
from ..domain.entities.journey import RouteRequest as DomainRouteRequest
from ..domain.entities.journey import SafeRoute as DomainSafeRoute

router = APIRouter(prefix="/navigation", tags=["Navigation"])

@router.post("/plan", response_model=DomainSafeRoute)
def plan_route(request: DomainRouteRequest, db: Session = Depends(get_db)):
    service = NavigationService(db)
    return service.plan_safe_route(request)
