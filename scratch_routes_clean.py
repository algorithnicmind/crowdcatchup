
import re

with open("apps/api/features/fusion/api/routes.py", "r") as f:
    content = f.read()

# Remove the process_observation_background function and all its contents
content = re.sub(r"def process_observation_background.*?# Broadcast crowd_state via WebSockets.*?await ws_manager\.broadcast_to_event.*?\n", "", content, flags=re.DOTALL)
content = re.sub(r"background_tasks\.add_task\(process_observation_background, obs\)", "", content)
content = re.sub(r"queue_length\": len\(observation_queue\)", "queue_length\": \"Redis PubSub\"", content)

with open("apps/api/features/fusion/api/routes.py", "w") as f:
    f.write(content)

