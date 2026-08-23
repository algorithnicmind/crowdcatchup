from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class CrowdShieldBaseException(Exception):
    """
    Base exception for all CrowdShield errors.
    This allows the global exception handler to intercept these specifically.
    """
    def __init__(self, message: str, error_code: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ResourceNotFoundException(CrowdShieldBaseException):
    def __init__(self, resource_type: str, resource_id: str):
        super().__init__(
            message=f"{resource_type} with ID {resource_id} not found.",
            error_code="RESOURCE_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource_type": resource_type, "resource_id": resource_id}
        )

class DataFusionAnomalyException(CrowdShieldBaseException):
    def __init__(self, metric: str, divergence: float):
        super().__init__(
            message=f"Critical sensor disagreement detected for {metric}",
            error_code="DATA_FUSION_ANOMALY",
            status_code=status.HTTP_409_CONFLICT,
            details={"metric": metric, "divergence": divergence}
        )

class UnauthorizedAccessException(CrowdShieldBaseException):
    def __init__(self, role_required: str):
        super().__init__(
            message="You do not have permission to perform this action.",
            error_code="UNAUTHORIZED_ACCESS",
            status_code=status.HTTP_403_FORBIDDEN,
            details={"required_role": role_required}
        )
