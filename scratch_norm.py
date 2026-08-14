
norm_code = """
import logging
from typing import Dict, Any
from ..api.schemas import StandardObservation
from datetime import datetime

logger = logging.getLogger(__name__)

class DataNormalizer:
    @staticmethod
    def normalize(payload: Dict[str, Any]) -> StandardObservation:
        \"\"\"
        Converts diverse adapter outputs into the StandardObservation format.
        If it already matches, it just parses it.
        \"\"\"
        # Map raw fields if necessary based on source_type
        # For this MVP, we assume adapters send it mostly in the correct format,
        # but we handle potential missing confidence or latency.
        
        if "confidence" not in payload:
            payload["confidence"] = 0.8  # default confidence
            
        if "latency_ms" not in payload:
            payload["latency_ms"] = 0
            
        if "health" not in payload:
            payload["health"] = "ONLINE"
            
        if "timestamp" not in payload:
            payload["timestamp"] = datetime.utcnow().isoformat()
            
        return StandardObservation(**payload)
"""
with open("apps/api/features/fusion/application/data_normalization.py", "w") as f:
    f.write(norm_code)

