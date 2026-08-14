
import sys

with open("apps/api/main.py", "r") as f:
    content = f.read()

import_statement = "from features.fusion.application.redis_subscriber import start_redis_subscriber\nimport asyncio"
if import_statement not in content:
    content = content.replace("from core.redis import close_redis", "from core.redis import close_redis\n" + import_statement)

subscriber_task = """
    # Start background Redis subscriber for fusion engine
    subscriber_task = asyncio.create_task(start_redis_subscriber())
    yield
"""
content = content.replace("    yield", subscriber_task)

content = content.replace("    await close_redis()", "    subscriber_task.cancel()\n    await close_redis()")

with open("apps/api/main.py", "w") as f:
    f.write(content)

