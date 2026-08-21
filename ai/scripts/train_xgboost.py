import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import os
import json

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


def train_model():
    data_path = 'ai/data/crowd_data_synthetic.csv'

    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Run generate_dataset.py first.")
        return

    print("Loading synthetic data...")
    df = pd.read_csv(data_path)

    X = df[FEATURES]
    y_reg = df['risk_score']

    X_train, X_test, y_train, y_test = train_test_split(X, y_reg, test_size=0.2, random_state=42)

    print(f"Training XGBoost Regressor on {len(X_train)} samples with {len(FEATURES)} features...")

    model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
    )

    model.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error:      {mse:.4f}")
    print(f"Root Mean Squared Error: {rmse:.4f}")
    print(f"Mean Absolute Error:     {mae:.4f}")
    print(f"R-squared:               {r2:.4f}")

    # Save model to local AI folder
    os.makedirs('ai/models', exist_ok=True)
    local_path = 'ai/models/xgboost_risk_model.json'
    model.save_model(local_path)
    print(f"Model saved to {local_path}")

    # Save feature metadata alongside model
    meta_path = 'ai/models/model_metadata.json'
    with open(meta_path, 'w') as f:
        json.dump({
            'features': FEATURES,
            'n_estimators': 200,
            'learning_rate': 0.05,
            'max_depth': 6,
            'test_r2': float(r2),
            'test_rmse': float(rmse),
            'test_mae': float(mae),
            'training_samples': len(X_train),
        }, f, indent=2)
    print(f"Metadata saved to {meta_path}")

    # Deploy to backend
    backend_ml_dir = 'apps/api/features/risk/infrastructure/ml'
    os.makedirs(backend_ml_dir, exist_ok=True)
    backend_path = os.path.join(backend_ml_dir, 'bottleneck_model.json')
    model.save_model(backend_path)

    backend_meta_path = os.path.join(backend_ml_dir, 'model_metadata.json')
    with open(backend_meta_path, 'w') as f:
        json.dump({
            'features': FEATURES,
            'test_r2': float(r2),
            'test_rmse': float(rmse),
        }, f, indent=2)

    print(f"Model deployed to backend at {backend_path}")
    print(f"Metadata deployed to backend at {backend_meta_path}")


if __name__ == "__main__":
    train_model()
