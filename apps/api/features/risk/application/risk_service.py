import os
import xgboost as xgb
import logging
from ...fusion.api.schemas import CrowdStateDTO

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "infrastructure", "ml")
MODEL_PATH = os.path.join(MODEL_DIR, "bottleneck_model.json")

class RiskService:
    def __init__(self):
        self.model = None
        self._load_model()
        
    def _load_model(self):
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
        """
        if self.model is None:
            # Fallback mock logic if model is missing
            risk = (state.density / 6.0) * 100
            return min(100.0, max(0.0, risk))
            
        import pandas as pd
        df = pd.DataFrame([{
            "density": state.density,
            "entry_rate": state.entry_rate,
            "exit_rate": state.exit_rate,
            "average_speed": state.average_speed
        }])
        
        # XGBoost prediction
        pred = self.model.predict(df)[0]
        return float(min(100.0, max(0.0, pred)))

# Singleton instance
risk_service = RiskService()
