from abc import ABC, abstractmethod
from typing import Iterator
import numpy as np

class IDataSource(ABC):
    @abstractmethod
    def read_frames(self) -> Iterator[np.ndarray]:
        """Generator that yields frames from the data source."""
        pass
    
    @abstractmethod
    def release(self):
        """Release any resources held by the data source."""
        pass
