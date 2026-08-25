import os
import xgboost as xgb
import logging
import numpy as np
from ...fusion.api.schemas import CrowdStateDTO

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "infrastructure", "ml")
MODEL_PATH = os.path.join(MODEL_DIR, "bottleneck_model.json")


class RiskService:
    """
    [ARCHITECTURAL DECISION: AI RISK ENGINE]
    
    Why this exists:
    Evaluates real-time crowd metrics (density, flow, speed) against trained ML models 
    to predict the likelihood of a dangerous bottleneck forming in the next 15 minutes.
    
    How it works:
    Uses an XGBoost Regressor for rapid inference. If the model file is missing 
    (e.g., during local dev without ML training), it gracefully degrades to a 
    rule-based mathematical heuristic.
    """
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """
        Attempts to load the pre-trained XGBoost model from the local infrastructure directory.
        Falls back to rule-based execution if the model file is not found.
        """
        try:
            if os.path.exists(MODEL_PATH):
                self.model = xgb.XGBRegressor()
                self.model.load_model(MODEL_PATH)
                logger.info("XGBoost model loaded successfully.")
            else:
                logger.warning(f"XGBoost model not found at {MODEL_PATH}. Running in fallback rule-based mode.")
        except Exception as e:
            logger.error(f"Error loading XGBoost model: {str(e)}")

    def predict_risk(self, state: CrowdStateDTO) -> float:
        """
        Predicts the bottleneck risk score (0-100).
        Uses numpy array instead of Pandas DataFrame for faster inference.
        """
        if self.model is None:
            risk = (state.density / 6.0) * 100
            return min(100.0, max(0.0, risk))

        net_flow = state.entry_rate - state.exit_rate
        from datetime import datetime, timezone
        hour_of_day = datetime.now(timezone.utc).hour

        arr = np.array([[
            state.density,
            state.entry_rate,
            state.exit_rate,
            state.average_speed,
            state.estimated_people,
            net_flow,
            int(state.flow_conflict),
            state.confidence,
            hour_of_day,
            min(state.estimated_people / 500.0, 1.0),
        ]], dtype=np.float32)

        pred = self.model.predict(arr)[0]
        return float(min(100.0, max(0.0, pred)))


# Singleton instance
risk_service = RiskService()
