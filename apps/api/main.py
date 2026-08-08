from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="CrowdShield API Gateway", version="2.0.0")

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"status": "operational", "service": "CrowdShield API Gateway"}

@app.post("/ingest")
async def ingest_telemetry(data: dict):
    # This is where the AI Data Hub (YOLO) will POST the numbers
    # For now, just broadcast the received data to all connected WebSockets
    await manager.broadcast({"type": "RISK_UPDATE", "data": data})
    return {"status": "success"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket commands from Next.js (like APPROVE_PLAN)
            print(f"Received from WS: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
