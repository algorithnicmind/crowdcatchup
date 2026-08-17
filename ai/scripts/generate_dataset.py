import pandas as pd
import numpy as np
import os
import random

def calculate_risk(row):
    """
    Deterministic function to assign ground-truth risk score based on features.
    Simulates a physical crowd safety model.
    """
    density = row['density']
    density_growth = row['density_growth_rate']
    speed = row['speed']
    speed_decline = row['speed_decline_rate']
    imbalance = row['entry_exit_imbalance']
    bottleneck = row['bottleneck_score']
    
    # Base risk purely from density (0 to 60 points)
    # Density >= 4.5 is extremely dangerous
    if density <= 1.0:
        base_risk = density * 10
    elif density <= 2.5:
        base_risk = 10 + (density - 1.0) * 13.33  # up to ~30
    elif density <= 4.0:
        base_risk = 30 + (density - 2.5) * 13.33  # up to ~50
    else:
        base_risk = 50 + (density - 4.0) * 20     # up to 60+
        
    # Penalty for high growth rate (0 to 15 points)
    growth_penalty = max(0, density_growth * 15)
    
    # Penalty for low speed (0 to 15 points)
    speed_penalty = max(0, (1.5 - speed) * 10)
    
    # Penalty for entry/exit imbalance (0 to 10 points)
    imbalance_penalty = max(0, (imbalance / 100.0) * 5)
    
    # Penalty for bottlenecks (0 to 10 points)
    bottleneck_penalty = bottleneck * 10
    
    total_risk = base_risk + growth_penalty + speed_penalty + imbalance_penalty + bottleneck_penalty
    
    # Add a tiny bit of noise
    total_risk += np.random.normal(0, 2)
    
    return min(100.0, max(0.0, total_risk))

def get_risk_level(score):
    if score <= 40:
        return 'LOW'
    elif score <= 65:
        return 'MODERATE'
    elif score <= 85:
        return 'HIGH'
    else:
        return 'CRITICAL'

def generate_dataset(num_samples=10000):
    np.random.seed(42)
    
    data = []
    for _ in range(num_samples):
        # Determine scenario type to get good distribution
        scenario = np.random.choice(['NORMAL', 'CONGESTED', 'SURGE', 'CRITICAL'], p=[0.5, 0.3, 0.15, 0.05])
        
        if scenario == 'NORMAL':
            density = np.random.uniform(0.1, 2.0)
            density_growth = np.random.uniform(-0.2, 0.2)
            speed = np.random.uniform(1.0, 1.5)
            speed_decline = np.random.uniform(-0.1, 0.1)
            imbalance = np.random.uniform(-10, 20)
            bottleneck = np.random.uniform(0.0, 0.2)
        elif scenario == 'CONGESTED':
            density = np.random.uniform(2.0, 3.5)
            density_growth = np.random.uniform(0.0, 0.5)
            speed = np.random.uniform(0.5, 1.0)
            speed_decline = np.random.uniform(0.0, 0.3)
            imbalance = np.random.uniform(10, 50)
            bottleneck = np.random.uniform(0.2, 0.6)
        elif scenario == 'SURGE':
            density = np.random.uniform(3.0, 4.0)
            density_growth = np.random.uniform(0.5, 1.5)
            speed = np.random.uniform(0.2, 0.6)
            speed_decline = np.random.uniform(0.2, 0.8)
            imbalance = np.random.uniform(40, 150)
            bottleneck = np.random.uniform(0.5, 0.8)
        else: # CRITICAL
            density = np.random.uniform(4.0, 6.0)
            density_growth = np.random.uniform(0.5, 2.0)
            speed = np.random.uniform(0.0, 0.3)
            speed_decline = np.random.uniform(0.1, 0.5)
            imbalance = np.random.uniform(100, 300)
            bottleneck = np.random.uniform(0.8, 1.0)
            
        row = {
            'density': density,
            'density_growth_rate': density_growth,
            'speed': speed,
            'speed_decline_rate': speed_decline,
            'entry_exit_imbalance': imbalance,
            'bottleneck_score': bottleneck
        }
        
        score = calculate_risk(row)
        row['risk_score'] = score
        row['risk_level'] = get_risk_level(score)
        
        data.append(row)
        
    df = pd.DataFrame(data)
    
    os.makedirs(os.path.dirname('ai/data/'), exist_ok=True)
    out_path = 'ai/data/crowd_data_synthetic.csv'
    df.to_csv(out_path, index=False)
    print(f"Generated {num_samples} rows of synthetic data at {out_path}")
    print(df['risk_level'].value_counts())

if __name__ == "__main__":
    generate_dataset(10000)
