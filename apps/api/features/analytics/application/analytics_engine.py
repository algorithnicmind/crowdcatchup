import logging
from features.fusion.api.schemas import CrowdStateDTO
from typing import Dict, List
import math

logger = logging.getLogger(__name__)

class AnalyticsEngine:
    """
    Enriches the CrowdStateDTO with advanced analytics before risk assessment.
    """
    
    # Store historical states for calculating changes
    _history: Dict[str, List[CrowdStateDTO]] = {}
    
    @staticmethod
    def enrich_crowd_state(state: CrowdStateDTO) -> CrowdStateDTO:
        zone_id = state.zone_id
        
        if zone_id not in AnalyticsEngine._history:
            AnalyticsEngine._history[zone_id] = []
            
        history = AnalyticsEngine._history[zone_id]
        
        # Calculate bottleneck score based on entry vs exit rate
        if state.entry_rate > 0 and state.exit_rate >= 0:
            ratio = state.entry_rate / (state.exit_rate + 1.0) # Avoid division by zero
            # Map ratio (1 to infinity) to a 0-1 scale smoothly
            bottleneck = 1.0 - math.exp(-0.2 * max(0, ratio - 1.0))
            state.bottleneck_score = round(bottleneck, 2)
        else:
            state.bottleneck_score = 0.0
            
        # Determine flow conflicts
        state.flow_conflict = state.entry_rate > 100 and state.exit_rate > 100 and state.average_speed < 0.5
        
        # Append to history
        history.append(state)
        # Keep last 10
        if len(history) > 10:
            history.pop(0)
            
        return state
