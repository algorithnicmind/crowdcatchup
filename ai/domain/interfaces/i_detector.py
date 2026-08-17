from abc import ABC, abstractmethod
from typing import List, Any
import numpy as np
from ..entities.detection import Detection

class IDetector(ABC):
    @abstractmethod
    def detect(self, frame: np.ndarray) -> List[Detection]:
        """Detect objects in a frame."""
        pass
