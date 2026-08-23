"""
YOLO Model Singleton Registry
Prevents loading the same model multiple times across pipeline instances.
"""

from ultralytics import YOLO
import logging
import threading

logger = logging.getLogger(__name__)

_model_cache: dict[str, YOLO] = {}
_lock = threading.Lock()


def get_yolo_model(model_path: str = "yolov8n.pt") -> YOLO:
    """
    Returns a cached YOLO model instance for the given path.
    Thread-safe: uses a lock to prevent duplicate loads under concurrent access.
    """
    if model_path not in _model_cache:
        with _lock:
            if model_path not in _model_cache:
                logger.info(f"Loading YOLO model from {model_path} (first use)...")
                _model_cache[model_path] = YOLO(model_path)
                logger.info(f"YOLO model loaded successfully from {model_path}")
    return _model_cache[model_path]
