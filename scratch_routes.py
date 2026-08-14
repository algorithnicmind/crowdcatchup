
import sys

with open("apps/api/features/fusion/api/routes.py", "r") as f:
    content = f.read()

# Make sure get_redis is imported
if "from core.redis import get_redis" not in content:
    content = content.replace("from core.database import get_db", "from core.database import get_db\nfrom core.redis import get_redis")

# Replace the observation_queue appending with Redis publish
old_queue = """
        # TODO: Phase 3.7 - Replace this in-memory list with a real Redis queue or Pub/Sub
        observation_queue.append(obs)
"""

new_redis = """
        # Push the observation to the Redis Pub/Sub channel
        redis = await get_redis()
        # Ensure we publish as a JSON string
        await redis.publish("crowd_observations", obs.model_dump_json())
"""

content = content.replace("observation_queue.append(obs)", new_redis)

with open("apps/api/features/fusion/api/routes.py", "w") as f:
    f.write(content)

