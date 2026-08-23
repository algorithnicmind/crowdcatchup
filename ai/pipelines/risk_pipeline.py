import xgboost as xgb
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

# Feature order must match training
FEATURE_NAMES = [
    'density', 'density_growth_rate', 'speed', 'speed_decline_rate',
    'entry_exit_imbalance', 'bottleneck_score'
]


class RiskPipeline:
    def __init__(self, model_path=None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, 'models', 'xgboost_risk_model.json')
            
        self.model = xgb.XGBRegressor()
        if os.path.exists(model_path):
            self.model.load_model(model_path)
            self.is_loaded = True
        else:
            self.is_loaded = False
            logger.warning(f"Model not found at {model_path}. Please train it first.")

    def get_risk_level(self, score: float) -> str:
        if score <= 40:
            return 'LOW'
        elif score <= 65:
            return 'MODERATE'
        elif score <= 85:
            return 'HIGH'
        else:
            return 'CRITICAL'

    def predict_risk(self, current_features: dict) -> dict:
        """
        Takes current state features and predicts the risk score and future trajectory.
        Uses numpy arrays instead of Pandas DataFrames for ~10-50x faster single-row predictions.
        Batches all 4 predictions (current + 3 horizons) into a single model.predict() call.
        """
        if not self.is_loaded:
            return {"error": "Model not loaded."}
            
        rows = []
        
        # Row 0: current state
        rows.append([
            current_features.get('density', 0),
            current_features.get('density_growth_rate', 0),
            current_features.get('speed', 0),
            current_features.get('speed_decline_rate', 0),
            current_features.get('entry_exit_imbalance', 0),
            current_features.get('bottleneck_score', 0),
        ])
        
        # Rows 1-3: extrapolated future states (5, 10, 15 mins)
        for minutes in [5, 10, 15]:
            future = current_features.copy()
            future['density'] = max(0.0, future['density'] + future['density_growth_rate'] * (minutes / 5.0))
            future['speed'] = max(0.0, future['speed'] - future['speed_decline_rate'] * (minutes / 5.0))
            rows.append([
                future['density'],
                future['density_growth_rate'],
                future['speed'],
                future['speed_decline_rate'],
                future['entry_exit_imbalance'],
                future['bottleneck_score'],
            ])
        
        # Single batched prediction
        arr = np.array(rows, dtype=np.float32)
        all_preds = self.model.predict(arr)
        
        current_risk_score = float(np.clip(all_preds[0], 0.0, 100.0))
        
        predictions = []
        for i, minutes in enumerate([5, 10, 15]):
            future_risk = float(np.clip(all_preds[i + 1], 0.0, 100.0))
            future_density = rows[i + 1][0]
            predictions.append({
                "horizon_minutes": minutes,
                "predicted_risk_score": future_risk,
                "predicted_risk_level": self.get_risk_level(future_risk),
                "projected_density": future_density
            })
            
        return {
            "current_risk_score": current_risk_score,
            "current_risk_level": self.get_risk_level(current_risk_score),
            "predictions": predictions
        }
