import time
from collections import deque
from typing import Dict, List, Any
from ..domain.entities.detection import TrackedObject

class AnalyticsPipeline:
    """
    Computes advanced crowd analytics (occupancy, dwell time) from raw tracking data.
    Uses deque for O(1) append/popleft on dwell time history instead of O(n) list.pop(0).
    """
    def __init__(self, max_capacity: int = 1000):
        self.max_capacity = max_capacity
        
        self.entry_times: Dict[int, float] = {}
        self.last_seen: Dict[int, float] = {}
        
        # deque with maxlen auto-evicts oldest entries — O(1) instead of O(n) list.pop(0)
        self.completed_dwell_times: deque[float] = deque(maxlen=100)
        
        self.timeout_s = 5.0 
        
    def process(self, tracked_objects: List[TrackedObject]) -> Dict[str, Any]:
        current_time = time.time()
        current_ids = set()
        
        for obj in tracked_objects:
            tid = obj.track_id
            current_ids.add(tid)
            
            if tid not in self.entry_times:
                self.entry_times[tid] = current_time
            self.last_seen[tid] = current_time
            
        left_ids = []
        for tid, last_t in self.last_seen.items():
            if tid not in current_ids and (current_time - last_t) > self.timeout_s:
                left_ids.append(tid)
                
        for tid in left_ids:
            dwell = self.last_seen[tid] - self.entry_times[tid]
            self.completed_dwell_times.append(dwell)
                
            del self.entry_times[tid]
            del self.last_seen[tid]
            
        occupancy = (len(current_ids) / self.max_capacity) * 100.0 if self.max_capacity > 0 else 0.0
        
        avg_dwell = 0.0
        if self.completed_dwell_times:
            avg_dwell = sum(self.completed_dwell_times) / len(self.completed_dwell_times)
            
        return {
            "occupancy_percentage": min(100.0, occupancy),
            "dwell_time_seconds": avg_dwell,
            "active_tracks": len(current_ids)
        }
