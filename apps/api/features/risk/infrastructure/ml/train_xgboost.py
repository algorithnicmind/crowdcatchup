import os
import json
import logging
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "bottleneck_model.json")
META_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

FEATURES = [
    'density',
    'entry_rate',
    'exit_rate',
    'average_speed',
    'estimated_people',
    'net_flow',
    'flow_conflict',
    'confidence',
    'hour_of_day',
    'zone_capacity_pct',
]


def generate_synthetic_data(num_samples: int = 100000):
    np.random.seed(42)

    data = []
    for _ in range(num_samples):
        scenario = np.random.choice(
            ['NORMAL', 'CONGESTED', 'SURGE', 'CRITICAL'],
            p=[0.50, 0.25, 0.15, 0.10]
        )

        if scenario == 'NORMAL':
            density = np.random.uniform(0.1, 2.0)
            entry = np.random.uniform(10, 50)
            exit_rate = np.random.uniform(10, 50)
            speed = np.random.uniform(1.0, 1.5)
            estimated_people = np.random.randint(50, 300)
            zone_capacity = np.random.randint(300, 600)
        elif scenario == 'CONGESTED':
            density = np.random.uniform(2.0, 3.5)
            entry = np.random.uniform(30, 80)
            exit_rate = np.random.uniform(20, 60)
            speed = np.random.uniform(0.5, 1.0)
            estimated_people = np.random.randint(200, 500)
            zone_capacity = np.random.randint(300, 600)
        elif scenario == 'SURGE':
            density = np.random.uniform(3.0, 4.5)
            entry = np.random.uniform(80, 150)
            exit_rate = np.random.uniform(10, 40)
            speed = np.random.uniform(0.2, 0.6)
            estimated_people = np.random.randint(400, 550)
            zone_capacity = np.random.randint(300, 600)
        else:
            density = np.random.uniform(4.0, 6.0)
            entry = np.random.uniform(150, 300)
            exit_rate = np.random.uniform(0, 20)
            speed = np.random.uniform(0.0, 0.3)
            estimated_people = np.random.randint(500, 580)
            zone_capacity = np.random.randint(300, 600)

        net_flow = entry - exit_rate
        flow_conflict = 1 if (np.random.random() < 0.15 and density > 2.5) else 0
        confidence = np.random.uniform(0.6, 1.0)
        hour_of_day = np.random.choice(range(24))
        zone_capacity_pct = estimated_people / zone_capacity

        row = {
            'density': density,
            'entry_rate': entry,
            'exit_rate': exit_rate,
            'average_speed': speed,
            'estimated_people': estimated_people,
            'net_flow': net_flow,
            'flow_conflict': flow_conflict,
            'confidence': confidence,
            'hour_of_day': hour_of_day,
            'zone_capacity_pct': zone_capacity_pct,
        }

        # Risk formula (mirrors ai/scripts/generate_dataset.py)
        if density <= 1.0:
            base_risk = density * 8
        elif density <= 2.5:
            base_risk = 8 + (density - 1.0) * 14
        elif density <= 4.0:
            base_risk = 29 + (density - 2.5) * 14
        else:
            base_risk = 50 + (density - 4.0) * 18

        inflow_penalty = min(20, max(0, net_flow * 0.15))
        speed_penalty = max(0, (1.2 - speed) * 12.5)

        if zone_capacity_pct > 0.7:
            capacity_risk = min(10, (zone_capacity_pct - 0.7) * 33.33)
        else:
            capacity_risk = 0

        conflict_bonus = 8 if flow_conflict else 0

        if 18 <= hour_of_day <= 22:
            hour_mod = 3
        elif 6 <= hour_of_day <= 10:
            hour_mod = -2
        else:
            hour_mod = 0

        confidence_factor = 1.0 - confidence
        total_risk = base_risk + inflow_penalty + speed_penalty + capacity_risk + conflict_bonus + hour_mod
        noise_sigma = 2.0 + (confidence_factor * 4.0)
        total_risk += np.random.normal(0, noise_sigma)
        risk_score = float(min(100.0, max(0.0, total_risk)))

        row['risk_score'] = risk_score
        data.append(row)

    return pd.DataFrame(data)


def train_model():
    logger.info("Generating 100,000 synthetic crowd data samples...")
    df = generate_synthetic_data(100000)

    X = df[FEATURES]
    y = df['risk_score']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    logger.info(f"Training XGBoost Regressor on {len(X_train)} samples with {len(FEATURES)} features...")
    model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    logger.info(f"Mean Squared Error:      {mse:.4f}")
    logger.info(f"Root Mean Squared Error: {rmse:.4f}")
    logger.info(f"Mean Absolute Error:     {mae:.4f}")
    logger.info(f"R-squared:               {r2:.4f}")

    model.save_model(MODEL_PATH)
    logger.info(f"Model saved to {MODEL_PATH}")

    with open(META_PATH, 'w') as f:
        json.dump({
            'features': FEATURES,
            'test_r2': float(r2),
            'test_rmse': float(rmse),
            'test_mae': float(mae),
        }, f, indent=2)
    logger.info(f"Metadata saved to {META_PATH}")


if __name__ == "__main__":
    train_model()
