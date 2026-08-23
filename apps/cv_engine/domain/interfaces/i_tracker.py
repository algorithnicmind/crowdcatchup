from abc import ABC, abstractmethod
from typing import List
import numpy as np
from ..entities.detection import Detection, TrackedObject

class ITracker(ABC):
    @abstractmethod
    def track(self, frame: np.ndarray, detections: List[Detection]) -> List[TrackedObject]:
        """Track objects across frames based on detections."""
        pass
