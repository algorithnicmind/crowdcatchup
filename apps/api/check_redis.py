"""
CrowdShield - Redis Diagnostics & Health Check Script
"""
import sys
import asyncio
from core.redis import get_redis

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

async def check_redis_health():
    print("\n[+] Checking Redis connection...")
    try:
        redis = await get_redis()
        
        # 1. Test Key-Value Storage (SET / GET)
        test_key = "health_check_key"
        test_val = "crowdshield_redis_online"
        
        await redis.set(test_key, test_val)
        retrieved = await redis.get(test_key)
        
        if retrieved == test_val:
            print("[SUCCESS] [1/2] Key-Value Storage: WORKING (SET & GET confirmed)")
        else:
            print("[FAILED] [1/2] Key-Value Storage: FAILED")
            return
            
        # 2. Test Pub/Sub Message Dispatch
        pubsub = redis.pubsub()
        await pubsub.subscribe("test_channel")
        
        # Publish test message
        await redis.publish("test_channel", "ping_from_crowdshield")
        
        # Read from subscriber
        msg = await pubsub.get_message(timeout=2.0)
        
        if msg and msg.get("data") == "ping_from_crowdshield":
            print("[SUCCESS] [2/2] Pub/Sub Engine: WORKING (Real-time events confirmed)")
        else:
            print("[FAILED] [2/2] Pub/Sub Engine: FAILED")
            return
            
        print("\n>>> ALL REDIS SYSTEMS ARE 100% HEALTHY AND WORKING PROPERLY! <<<\n")
        
    except Exception as e:
        print(f"[ERROR] Redis Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_redis_health())
