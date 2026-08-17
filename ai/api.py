from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from pipelines.risk_pipeline import RiskPipeline
from pipelines.decision_engine import DecisionEngine
import uvicorn

app = FastAPI(title="CrowdShield AI Brain", version="1.0")

# Initialize Pipelines
risk_pipeline = RiskPipeline()
decision_engine = DecisionEngine()

class CrowdStateRequest(BaseModel):
    zone_id: str
    density: float
    density_growth_rate: float
    speed: float
    speed_decline_rate: float
    entry_exit_imbalance: float
    bottleneck_score: float

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": risk_pipeline.is_loaded}

@app.post("/api/predict-risk")
def predict_risk(request: CrowdStateRequest):
    features = {
        "density": request.density,
        "density_growth_rate": request.density_growth_rate,
        "speed": request.speed,
        "speed_decline_rate": request.speed_decline_rate,
        "entry_exit_imbalance": request.entry_exit_imbalance,
        "bottleneck_score": request.bottleneck_score
    }
    
    risk_data = risk_pipeline.predict_risk(features)
    if "error" in risk_data:
        raise HTTPException(status_code=500, detail=risk_data["error"])
        
    return {
        "zone_id": request.zone_id,
        "risk_data": risk_data
    }

@app.post("/api/recommend")
def get_recommendations(request: CrowdStateRequest):
    features = {
        "density": request.density,
        "density_growth_rate": request.density_growth_rate,
        "speed": request.speed,
        "speed_decline_rate": request.speed_decline_rate,
        "entry_exit_imbalance": request.entry_exit_imbalance,
        "bottleneck_score": request.bottleneck_score
    }
    
    # 1. Get Risk
    risk_data = risk_pipeline.predict_risk(features)
    if "error" in risk_data:
        raise HTTPException(status_code=500, detail=risk_data["error"])
        
    # 2. Get Recommendations
    recommendation = decision_engine.generate_recommendations(
        zone_id=request.zone_id,
        crowd_features=features,
        risk_data=risk_data
    )
    
    return recommendation

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
