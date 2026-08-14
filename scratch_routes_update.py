
import sys

with open("apps/api/features/fusion/api/routes.py", "r") as f:
    content = f.read()

content = content.replace("from .schemas import StandardObservation", "from .schemas import StandardObservation\nfrom ..application.data_normalization import DataNormalizer\nfrom ..application.source_health_monitor import SourceHealthMonitor")

content = content.replace("observation_queue.append(obs)", "obs = DataNormalizer.normalize(obs.model_dump())\n        SourceHealthMonitor.update_health(obs)\n        observation_queue.append(obs)")

with open("apps/api/features/fusion/api/routes.py", "w") as f:
    f.write(content)

