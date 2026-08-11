"""
Shared Kernel — API Error Handlers
Converts domain exceptions to proper HTTP responses.
Doc 12 §3.4: Routes return proper HTTP status codes.
"""

from fastapi import Request
from fastapi.responses import JSONResponse
from shared.infrastructure.exceptions import (
    DomainError,
    NotFoundError,
    AuthorizationError,
    ValidationError,
    ConflictError,
)


async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": exc.message})


async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": exc.message})


async def authorization_handler(
    request: Request, exc: AuthorizationError
) -> JSONResponse:
    return JSONResponse(status_code=403, content={"detail": exc.message})


async def validation_error_handler(
    request: Request, exc: ValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": exc.message, "field": exc.field},
    )


async def conflict_handler(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": exc.message})


def register_error_handlers(app):
    """Register all domain exception handlers on the FastAPI app."""
    app.add_exception_handler(NotFoundError, not_found_handler)
    app.add_exception_handler(AuthorizationError, authorization_handler)
    app.add_exception_handler(ValidationError, validation_error_handler)
    app.add_exception_handler(ConflictError, conflict_handler)
    app.add_exception_handler(DomainError, domain_error_handler)
