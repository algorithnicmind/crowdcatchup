import pandas as pd
import numpy as np
import os


def calculate_risk(row):
    """
    Non-linear crowd risk formula with 10 features.
    Returns a risk score between 0 and 100.
    """
    density = row['density']
    entry = row['entry_rate']
    exit_rate = row['exit_rate']
    speed = row['average_speed']
    estimated_people = row['estimated_people']
    net_flow = row['net_flow']
    flow_conflict = row['flow_conflict']
    confidence = row['confidence']
    hour_of_day = row['hour_of_day']
    zone_capacity_pct = row['zone_capacity_pct']

    # --- Base risk from density (0 to 50 points, non-linear) ---
    if density <= 1.0:
        base_risk = density * 8
    elif density <= 2.5:
        base_risk = 8 + (density - 1.0) * 14
    elif density <= 4.0:
        base_risk = 29 + (density - 2.5) * 14
    else:
        base_risk = 50 + (density - 4.0) * 18

    # --- Net inflow penalty (0 to 20 points) ---
    inflow_penalty = min(20, max(0, net_flow * 0.15))

    # --- Low speed penalty (0 to 15 points) ---
    speed_penalty = max(0, (1.2 - speed) * 12.5)

    # --- Zone capacity pressure (0 to 10 points, exponential above 70%) ---
    if zone_capacity_pct > 0.7:
        capacity_risk = min(10, (zone_capacity_pct - 0.7) * 33.33)
    else:
        capacity_risk = 0

    # --- Flow conflict bonus (0 or 8 points) ---
    conflict_bonus = 8 if flow_conflict else 0

    # --- Hour of day modifier (-3 to +3 points) ---
    # Peak hours: 18-22 slightly riskier
    if 18 <= hour_of_day <= 22:
        hour_mod = 3
    elif 6 <= hour_of_day <= 10:
        hour_mod = -2
    else:
        hour_mod = 0

    # --- Confidence penalty: low confidence adds uncertainty noise ---
    confidence_factor = 1.0 - confidence  # 0 = fully confident, 1 = no confidence

    total_risk = base_risk + inflow_penalty + speed_penalty + capacity_risk + conflict_bonus + hour_mod

    # Add noise scaled by confidence (low confidence = more noise)
    noise_sigma = 2.0 + (confidence_factor * 4.0)
    total_risk += np.random.normal(0, noise_sigma)

    return float(min(100.0, max(0.0, total_risk)))


def get_risk_level(score):
    if score <= 35:
        return 'LOW'
    elif score <= 60:
        return 'WARNING'
    else:
        return 'CRITICAL'


def generate_dataset(num_samples=100000):
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
        else:  # CRITICAL
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

        score = calculate_risk(row)
        row['risk_score'] = score
        row['risk_level'] = get_risk_level(score)

        data.append(row)

    df = pd.DataFrame(data)

    os.makedirs('apps/cv_engine/data', exist_ok=True)
    out_path = 'apps/cv_engine/data/crowd_data_synthetic.csv'
    df.to_csv(out_path, index=False)
    print(f"Generated {num_samples} rows of synthetic data at {out_path}")
    print(f"Columns: {list(df.columns)}")
    print(f"\nRisk level distribution:")
    print(df['risk_level'].value_counts().to_string())
    print(f"\nFeature statistics:")
    print(df.describe().to_string())


if __name__ == "__main__":
    generate_dataset(100000)
