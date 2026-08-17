import xgboost as xgb
import pandas as pd
import numpy as np
import os

class RiskPipeline:
    def __init__(self, model_path=None):
        if model_path is None:
            # Resolve relative to the current file
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, 'models', 'xgboost_risk_model.json')
            
        self.model = xgb.XGBRegressor()
        if os.path.exists(model_path):
            self.model.load_model(model_path)
            self.is_loaded = True
        else:
            self.is_loaded = False
            print(f"Warning: Model not found at {model_path}. Please train it first.")

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
        Expected features: density, density_growth_rate, speed, speed_decline_rate, entry_exit_imbalance, bottleneck_score.
        """
        if not self.is_loaded:
            return {"error": "Model not loaded."}
            
        # Create DataFrame from features
        df = pd.DataFrame([current_features])
        
        # Predict current risk
        current_risk_score = float(self.model.predict(df)[0])
        current_risk_score = min(100.0, max(0.0, current_risk_score))
        
        # Predict future states (5, 10, 15 mins) using basic linear extrapolation of features
        # In a real system, you'd use LSTM or a proper time-series model. For MVP, we extrapolate features.
        predictions = []
        for minutes in [5, 10, 15]:
            future_features = current_features.copy()
            # Extrapolate density based on growth rate
            future_features['density'] += future_features['density_growth_rate'] * (minutes / 5.0)
            future_features['density'] = max(0.0, future_features['density'])
            
            # Extrapolate speed
            future_features['speed'] -= future_features['speed_decline_rate'] * (minutes / 5.0)
            future_features['speed'] = max(0.0, future_features['speed'])
            
            # Re-predict
            future_df = pd.DataFrame([future_features])
            future_risk = float(self.model.predict(future_df)[0])
            future_risk = min(100.0, max(0.0, future_risk))
            
            predictions.append({
                "horizon_minutes": minutes,
                "predicted_risk_score": future_risk,
                "predicted_risk_level": self.get_risk_level(future_risk),
                "projected_density": future_features['density']
            })
            
        return {
            "current_risk_score": current_risk_score,
            "current_risk_level": self.get_risk_level(current_risk_score),
            "predictions": predictions
        }
