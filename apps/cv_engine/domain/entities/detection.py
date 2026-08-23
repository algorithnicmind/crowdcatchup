from pydantic import BaseModel
from typing import Tuple, Optional

class Detection(BaseModel):
    bbox: Tuple[float, float, float, float] # x1, y1, x2, y2
    confidence: float
    class_id: int

class TrackedObject(BaseModel):
    track_id: int
    bbox: Tuple[float, float, float, float]
    velocity: Optional[Tuple[float, float]] = None # dx, dy
    speed: Optional[float] = None
