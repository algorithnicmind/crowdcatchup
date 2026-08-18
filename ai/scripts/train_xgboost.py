import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import os

def train_model():
    data_path = 'ai/data/crowd_data_synthetic.csv'
    
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Run generate_dataset.py first.")
        return

    print("Loading synthetic data...")
    df = pd.read_csv(data_path)
    
    # Must perfectly match the RiskService in the backend
    features = [
        'density',
        'entry_rate',
        'exit_rate',
        'average_speed'
    ]
    
    X = df[features]
    y_reg = df['risk_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y_reg, test_size=0.2, random_state=42)
    
    print(f"Training XGBoost Regressor on {len(X_train)} samples...")
    
    model = xgb.XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"R-squared: {r2:.4f}")
    
    # Save the model to the local AI folder
    os.makedirs('ai/models', exist_ok=True)
    local_path = 'ai/models/xgboost_risk_model.json'
    model.save_model(local_path)
    print(f"Model saved to {local_path}")

    # Save the model directly into the Backend Risk Service so it can use it immediately!
    backend_ml_dir = 'apps/api/features/risk/infrastructure/ml'
    os.makedirs(backend_ml_dir, exist_ok=True)
    backend_path = os.path.join(backend_ml_dir, 'bottleneck_model.json')
    model.save_model(backend_path)
    print(f"Model deployed to backend at {backend_path} 🚀")

if __name__ == "__main__":
    train_model()
