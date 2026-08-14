
import asyncio
import websockets
import time
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def ws_client(client_id: int):
    uri = "ws://localhost:8000/ws"
    try:
        async with websockets.connect(uri) as websocket:
            # Keep connection open and listen for messages
            while True:
                msg = await websocket.recv()
                # print(f"Client {client_id} received a message")
    except Exception as e:
        logger.error(f"Client {client_id} failed: {e}")

async def main():
    logger.info("Starting WebSocket Load Test (Simulating 1,000 concurrent clients)...")
    clients = []
    
    # Ramp up 1000 connections
    for i in range(1000):
        clients.append(ws_client(i))
        if i % 100 == 0:
            logger.info(f"Spawned {i} clients...")
            await asyncio.sleep(0.5) # Gentle ramp-up
            
    logger.info("All clients spawned. Listening for broadcast traffic...")
    await asyncio.gather(*clients)

if __name__ == "__main__":
    asyncio.run(main())
