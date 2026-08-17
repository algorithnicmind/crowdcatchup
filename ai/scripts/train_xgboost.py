import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
import os
import joblib
import json

def train_model():
    data_path = 'ai/data/crowd_data_synthetic.csv'
    
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Run generate_dataset.py first.")
        return

    print("Loading synthetic data...")
    df = pd.read_csv(data_path)
    
    features = [
        'density',
        'density_growth_rate',
        'speed',
        'speed_decline_rate',
        'entry_exit_imbalance',
        'bottleneck_score'
    ]
    
    X = df[features]
    y_reg = df['risk_score']
    y_cls = df['risk_level'].astype('category').cat.codes  # For classification if needed
    
    # We will train a Regression model to output the raw 0-100 score
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
    
    # Save the model
    os.makedirs('ai/models', exist_ok=True)
    model_path = 'ai/models/xgboost_risk_model.json'
    model.save_model(model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
