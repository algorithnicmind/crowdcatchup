import time
from typing import Dict, List, Any
from ..domain.entities.detection import TrackedObject

class AnalyticsPipeline:
    """
    Computes advanced crowd analytics (occupancy, dwell time) from raw tracking data.
    """
    def __init__(self, max_capacity: int = 1000):
        self.max_capacity = max_capacity
        
        # Maps track_id to the timestamp they were first seen
        self.entry_times: Dict[int, float] = {}
        
        # Maps track_id to the timestamp they were last seen
        self.last_seen: Dict[int, float] = {}
        
        # Keep track of completed dwell times to compute moving average
        self.completed_dwell_times: List[float] = []
        self.max_history = 100
        
        # Timeout in seconds to consider an object as "left" the zone
        self.timeout_s = 5.0 
        
    def process(self, tracked_objects: List[TrackedObject]) -> Dict[str, Any]:
        current_time = time.time()
        current_ids = set()
        
        # 1. Update entry and last seen times
        for obj in tracked_objects:
            tid = obj.track_id
            current_ids.add(tid)
            
            if tid not in self.entry_times:
                self.entry_times[tid] = current_time
            self.last_seen[tid] = current_time
            
        # 2. Check for objects that have left
        left_ids = []
        for tid, last_t in self.last_seen.items():
            if tid not in current_ids and (current_time - last_t) > self.timeout_s:
                left_ids.append(tid)
                
        # 3. Process left objects to compute dwell time
        for tid in left_ids:
            dwell = self.last_seen[tid] - self.entry_times[tid]
            self.completed_dwell_times.append(dwell)
            if len(self.completed_dwell_times) > self.max_history:
                self.completed_dwell_times.pop(0)
                
            del self.entry_times[tid]
            del self.last_seen[tid]
            
        # 4. Calculate metrics
        occupancy = (len(current_ids) / self.max_capacity) * 100.0 if self.max_capacity > 0 else 0.0
        
        avg_dwell = 0.0
        if self.completed_dwell_times:
            avg_dwell = sum(self.completed_dwell_times) / len(self.completed_dwell_times)
            
        return {
            "occupancy_percentage": min(100.0, occupancy),
            "dwell_time_seconds": avg_dwell,
            "active_tracks": len(current_ids)
        }
