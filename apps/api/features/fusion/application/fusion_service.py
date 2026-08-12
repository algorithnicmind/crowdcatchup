import logging
from typing import Dict
from datetime import datetime
from ..api.schemas import StandardObservation, CrowdStateDTO

logger = logging.getLogger(__name__)

# Temporary in-memory state for hackathon (normally Redis)
zone_states: Dict[str, CrowdStateDTO] = {}

class FusionService:
    @staticmethod
    def process_observation(obs: StandardObservation) -> CrowdStateDTO:
        """
        Fuses a single observation into the global zone state.
        In a full implementation, this uses confidence-weighted fusion.
        For MVP, we update the state directly.
        """
        zone_id = obs.zone_id
        
        # Initialize zone state if it doesn't exist
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
                timestamp=datetime.utcnow()
            )
            
        state = zone_states[zone_id]
        
        # Update specific metric based on the observation
        if obs.metric == "people_count":
            state.estimated_people = int(obs.value)
            # Dummy density calculation (assuming 1000 sqm for demo)
            state.density = state.estimated_people / 1000.0
        elif obs.metric == "entry_rate":
            state.entry_rate = obs.value
        elif obs.metric == "exit_rate":
            state.exit_rate = obs.value
        elif obs.metric == "avg_speed":
            state.average_speed = obs.value
            
        # Update density level
        if state.density < 2.0:
            state.density_level = "LOW"
        elif state.density < 3.0:
            state.density_level = "MODERATE"
        elif state.density < 4.0:
            state.density_level = "HIGH"
        else:
            state.density_level = "CRITICAL"
            
        state.timestamp = datetime.utcnow()
        state.confidence = obs.confidence
        
        zone_states[zone_id] = state
        return state
