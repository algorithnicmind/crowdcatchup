class AnomalyDetectionPipeline:
    """
    Detects bottlenecks, flow conflicts, and stagnant movement in crowd data.
    """
    def __init__(self):
        self.history = []

    def detect(self, current_features: dict) -> dict:
        """
        Takes current state features and detects anomalies.
        Expected features: density, speed, entry_rate, exit_rate
        """
        density = current_features.get('density', 0.0)
        speed = current_features.get('speed', 0.0)
        entry_rate = current_features.get('entry_rate', 0.0)
        exit_rate = current_features.get('exit_rate', 0.0)

        # 1. Bottleneck Score
        # High density + low speed + more people entering than exiting = high bottleneck score
        bottleneck_score = 0.0
        if density > 1.5 and speed < 0.5:
            # Score base
            bottleneck_score = 0.5
            # Add penalty for entry > exit
            if entry_rate > exit_rate and exit_rate > 0:
                ratio = entry_rate / exit_rate
                bottleneck_score += min(0.5, (ratio - 1) * 0.1)
            elif entry_rate > 0 and exit_rate == 0:
                bottleneck_score = 1.0

        bottleneck_score = min(1.0, max(0.0, bottleneck_score))

        # 2. Flow Conflict
        # Could be detected by high density variance or opposing direction vectors if available.
        # For MVP, we flag conflict if density is high and speed is very low but entry/exit are both high (churn).
        flow_conflict = False
        if density > 2.0 and speed < 0.2 and entry_rate > 50 and exit_rate > 50:
            flow_conflict = True

        # 3. Stagnant Movement
        stagnant = False
        if density > 1.0 and speed < 0.1:
            stagnant = True

        return {
            "bottleneck_score": bottleneck_score,
            "flow_conflict": flow_conflict,
            "stagnant_movement": stagnant
        }
