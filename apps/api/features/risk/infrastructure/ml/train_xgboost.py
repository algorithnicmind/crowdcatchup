import os
import json
import logging
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import xgboost as xgb

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Path to save the model
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "bottleneck_model.json")

def generate_synthetic_data(num_samples: int = 1000):
    """
    Generates synthetic crowd data to train the risk model.
    Features: density, entry_rate, exit_rate, average_speed
    Target: risk_score (0-100)
    """
    logger.info(f"Generating {num_samples} synthetic crowd data samples...")
    
    # 0 to 6 people per sq meter
    density = np.random.uniform(0, 6.0, num_samples)
    
    # people entering per minute
    entry_rate = np.random.uniform(0, 200, num_samples)
    
    # people exiting per minute
    exit_rate = np.random.uniform(0, 200, num_samples)
    
    # average speed (m/s), slower when density is high
    average_speed = np.clip(1.5 - (density * 0.2) + np.random.normal(0, 0.1, num_samples), 0, 2.0)
    
    # Calculate synthetic risk score
    # High density + high entry - low exit = HIGH RISK
    net_flow = entry_rate - exit_rate
    base_risk = (density / 6.0) * 60  # max 60 points from density
    flow_risk = np.clip(net_flow / 200.0, 0, 1) * 30  # max 30 points from net positive flow
    speed_penalty = (1.5 - average_speed) * 10  # up to 15 points if speed is 0
    
    risk_score = np.clip(base_risk + flow_risk + speed_penalty + np.random.normal(0, 2, num_samples), 0, 100)
    
    df = pd.DataFrame({
        "density": density,
        "entry_rate": entry_rate,
        "exit_rate": exit_rate,
        "average_speed": average_speed,
        "risk_score": risk_score
    })
    
    return df

def train_model():
    """Trains the XGBoost regressor and saves it."""
    df = generate_synthetic_data(5000)
    
    X = df[["density", "entry_rate", "exit_rate", "average_speed"]]
    y = df["risk_score"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    logger.info("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=4,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    logger.info(f"Model R^2 Score on Test Data: {score:.4f}")
    
    model.save_model(MODEL_PATH)
    logger.info(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
