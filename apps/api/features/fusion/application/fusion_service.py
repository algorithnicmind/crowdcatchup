import logging
from typing import Dict, List
from datetime import datetime, timedelta
import statistics
from ..api.schemas import StandardObservation, CrowdStateDTO

logger = logging.getLogger(__name__)

# Temporary in-memory state for hackathon (normally Redis)
zone_states: Dict[str, CrowdStateDTO] = {}
# Buffer to store recent observations for fusion
observation_buffer: Dict[str, List[StandardObservation]] = {}

SOURCE_RELIABILITY = {
    "CCTV": 0.9,
    "SMART_GATE": 0.95,
    "GPS": 0.7,
    "DRONE": 0.8,
    "SYNTHETIC": 1.0  # For simulation purposes
}

class FusionService:
    """
    [ARCHITECTURAL DECISION: SENSOR FUSION ENGINE]
    
    Why this exists:
    A real-world venue receives messy, conflicting data. CCTV Camera A might say there are 100 people 
    in Zone 1 (90% confidence), while Smart Gate B says 120 people (95% confidence). 
    If we just overwrite the database with the latest ping, the UI will flicker violently.
    
    How it works:
    This engine implements a Confidence-Weighted Sensor Fusion Algorithm (TRD §2.2).
    It buffers incoming streams, detects sensor disagreements (e.g., if CCTV breaks and reports 0),
    and mathematically merges multi-modal inputs (CCTV + RFID Gates + GPS) into a single, 
    stabilized `CrowdStateDTO` representing the undeniable "ground truth".
    """
    @staticmethod
    def get_reliability(source_type: str) -> float:
        return SOURCE_RELIABILITY.get(source_type, 0.5)

    @staticmethod
    def detect_disagreement(observations: List[StandardObservation], metric: str):
        """Detect when sources significantly disagree on a metric."""
        metric_obs = [o for o in observations if o.metric == metric]
        if len(metric_obs) < 2:
            return
            
        values = [o.value for o in metric_obs]
        median = statistics.median(values)
        if median == 0:
            return
            
        for obs in metric_obs:
            deviation = abs(obs.value - median) / median
            if deviation > 0.3:  # 30% deviation threshold
                logger.warning(
                    f"[SENSOR_DISAGREEMENT] {obs.source_id} anomaly in {obs.zone_id} for {metric}: "
                    f"Reported {obs.value} vs Median {median}"
                )

    @staticmethod
    def fuse_metric(observations: List[StandardObservation], metric: str, default: float) -> float:
        """Confidence-weighted estimation for a specific metric."""
        metric_obs = [o for o in observations if o.metric == metric]
        if not metric_obs:
            return default
            
        weighted_sum = 0.0
        total_weight = 0.0
        
        for obs in metric_obs:
            weight = obs.confidence * FusionService.get_reliability(obs.source_type)
            weighted_sum += obs.value * weight
            total_weight += weight
            
        return weighted_sum / total_weight if total_weight > 0 else default

    @staticmethod
    def process_observation(obs: StandardObservation) -> CrowdStateDTO:
        """
        Fuses a single observation into the global zone state using confidence-weighted fusion.
        """
        zone_id = obs.zone_id
        now = datetime.utcnow()
        
        # 1. Update Observation Buffer
        if zone_id not in observation_buffer:
            observation_buffer[zone_id] = []
            
        observation_buffer[zone_id].append(obs)
        
        # Clean up old observations (keep last 2 minutes)
        # Handle naive vs aware datetime depending on how it's sent
        obs_time = obs.timestamp.replace(tzinfo=None) if obs.timestamp else now
        cutoff_time = now - timedelta(minutes=2)
        observation_buffer[zone_id] = [
            o for o in observation_buffer[zone_id] 
            if (o.timestamp.replace(tzinfo=None) if o.timestamp else now) > cutoff_time
        ]
        
        recent_obs = observation_buffer[zone_id]
        
        # 2. Detect Disagreements
        FusionService.detect_disagreement(recent_obs, obs.metric)
        
        # 3. Initialize zone state if it doesn't exist
        if zone_id not in zone_states:
            zone_states[zone_id] = CrowdStateDTO(
                event_id=obs.event_id,
                zone_id=zone_id,
                estimated_people=0,
                density=0.0,
                density_level="LOW",
                average_speed=0.0,
                flow_direction="UNKNOWN",
                entry_rate=0.0,
                exit_rate=0.0,
                bottleneck_score=0.0,
                flow_conflict=False,
                risk_score=0.0,
                risk_level="LOW",
                confidence=0.0,
                timestamp=now
            )
            
        state = zone_states[zone_id]
        
        # 4. Fuse Metrics
        state.estimated_people = int(FusionService.fuse_metric(recent_obs, "people_count", state.estimated_people))
        state.entry_rate = FusionService.fuse_metric(recent_obs, "entry_rate", state.entry_rate)
        state.exit_rate = FusionService.fuse_metric(recent_obs, "exit_rate", state.exit_rate)
        state.average_speed = FusionService.fuse_metric(recent_obs, "avg_speed", state.average_speed)
        
        # Dummy density calculation (assuming 1000 sqm for demo)
        state.density = state.estimated_people / 1000.0
            
        # 5. Update density level
        if state.density < 2.0:
            state.density_level = "LOW"
        elif state.density < 3.0:
            state.density_level = "MODERATE"
        elif state.density < 4.0:
            state.density_level = "HIGH"
        else:
            state.density_level = "CRITICAL"
            
        state.timestamp = now
        # Overall confidence is max of recent observations for now
        state.confidence = max((o.confidence for o in recent_obs), default=0.0)
        
        # 6. Apply Analytics Engine
        from features.analytics.application.analytics_engine import AnalyticsEngine
        state = AnalyticsEngine.enrich_crowd_state(state)
        
        zone_states[zone_id] = state
        return state
