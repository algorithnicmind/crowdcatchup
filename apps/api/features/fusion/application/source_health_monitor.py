
import logging
from typing import Dict
from datetime import datetime, timedelta, timezone
from ..api.schemas import StandardObservation

logger = logging.getLogger(__name__)

class SourceHealthMonitor:
    source_last_seen: Dict[str, datetime] = {}
    source_status: Dict[str, str] = {}

    @classmethod
    def update_health(cls, obs: StandardObservation):
        """Update health status of a source based on incoming observation."""
        cls.source_last_seen[obs.source_id] = datetime.now(timezone.utc)
        if obs.health != cls.source_status.get(obs.source_id):
            cls.source_status[obs.source_id] = obs.health
            logger.info(f"Source {obs.source_id} health updated to {obs.health}")

    @classmethod
    def check_for_offline_sources(cls):
        """Background task to mark sources offline if they haven't sent data in 30s."""
        now = datetime.now(timezone.utc)
        for source_id, last_seen in cls.source_last_seen.items():
            if now - last_seen > timedelta(seconds=30):
                if cls.source_status.get(source_id) != "OFFLINE":
                    cls.source_status[source_id] = "OFFLINE"
                    logger.warning(f"Source {source_id} has gone OFFLINE (no data for >30s).")
                    # Here we would also broadcast a SOURCE_HEALTH WS event
