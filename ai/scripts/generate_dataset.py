import pandas as pd
import numpy as np
import os

def calculate_risk(row):
    """
    Deterministic function to assign ground-truth risk score based on 4 features.
    Simulates a physical crowd safety model.
    """
    density = row['density']
    entry = row['entry_rate']
    exit = row['exit_rate']
    speed = row['average_speed']
    
    # Base risk from density (0 to 60 points)
    if density <= 1.0:
        base_risk = density * 10
    elif density <= 2.5:
        base_risk = 10 + (density - 1.0) * 13.33  # up to ~30
    elif density <= 4.0:
        base_risk = 30 + (density - 2.5) * 13.33  # up to ~50
    else:
        base_risk = 50 + (density - 4.0) * 20     # up to 60+
        
    # Penalty for net inflow (0 to 20 points)
    net_inflow = max(0, entry - exit)
    inflow_penalty = min(20, net_inflow * 0.5)
    
    # Penalty for low speed (0 to 20 points)
    speed_penalty = max(0, (1.5 - speed) * 13.33)
    
    total_risk = base_risk + inflow_penalty + speed_penalty
    
    # Add a tiny bit of noise
    total_risk += np.random.normal(0, 2)
    
    return min(100.0, max(0.0, total_risk))

def get_risk_level(score):
    if score <= 40:
        return 'LOW'
    elif score <= 65:
        return 'WARNING'
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
            entry = np.random.uniform(10, 50)
            exit = np.random.uniform(10, 50)
            speed = np.random.uniform(1.0, 1.5)
        elif scenario == 'CONGESTED':
            density = np.random.uniform(2.0, 3.5)
            entry = np.random.uniform(30, 80)
            exit = np.random.uniform(20, 60)
            speed = np.random.uniform(0.5, 1.0)
        elif scenario == 'SURGE':
            density = np.random.uniform(3.0, 4.0)
            entry = np.random.uniform(80, 150)
            exit = np.random.uniform(10, 40)
            speed = np.random.uniform(0.2, 0.6)
        else: # CRITICAL
            density = np.random.uniform(4.0, 6.0)
            entry = np.random.uniform(150, 300)
            exit = np.random.uniform(0, 20)
            speed = np.random.uniform(0.0, 0.3)
            
        row = {
            'density': density,
            'entry_rate': entry,
            'exit_rate': exit,
            'average_speed': speed
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
