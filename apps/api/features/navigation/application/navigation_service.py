import uuid
from typing import List, Dict
from ..domain.entities.journey import RouteRequest, SafeRoute, GeoPoint
from ..domain.route_engine import RouteEngine

class NavigationService:
    def __init__(self, db):
        self.db = db
        self.engine = self._build_default_graph()

    def _build_default_graph(self) -> RouteEngine:
        """
        Builds a default graph representing the 'TechNova 2026' venue for the hackathon demo.
        In production, this would be constructed dynamically from PostGIS geometries.
        """
        engine = RouteEngine()
        # Add Nodes (Zones/Gates)
        engine.add_node("ENTRANCE_A", 40.7128, -74.0060)
        engine.add_node("MAIN_HALL", 40.7138, -74.0050)
        engine.add_node("FOOD_COURT", 40.7148, -74.0040)
        engine.add_node("VIP_LOUNGE", 40.7135, -74.0045)
        engine.add_node("EXIT_B", 40.7158, -74.0030)
        
        # Add Edges (Paths)
        # Main thoroughfare
        engine.add_edge("ENTRANCE_A", "MAIN_HALL", 100.0)
        engine.add_edge("MAIN_HALL", "FOOD_COURT", 150.0)
        engine.add_edge("FOOD_COURT", "EXIT_B", 120.0)
        
        # Alternate narrow route (shortcut)
        engine.add_edge("ENTRANCE_A", "VIP_LOUNGE", 80.0, is_narrow=True)
        engine.add_edge("VIP_LOUNGE", "EXIT_B", 100.0, is_narrow=True)
        
        return engine

    def _get_live_risk_scores(self) -> Dict[str, str]:
        """
        Mock fetching live risk scores from Redis or the Risk Engine.
        """
        # For demo purposes, let's pretend MAIN_HALL is highly congested
        return {
            "ENTRANCE_A": "NORMAL",
            "MAIN_HALL": "HIGH",
            "FOOD_COURT": "NORMAL",
            "VIP_LOUNGE": "NORMAL",
            "EXIT_B": "NORMAL"
        }

    def plan_safe_route(self, request: RouteRequest) -> SafeRoute:
        """
        Calculates the safest route using the A* routing engine.
        Weights are dynamically adjusted based on live risk scores.
        """
        live_risks = self._get_live_risk_scores()
        
        path = self.engine.find_safe_route(
            start_id=request.start_zone_id,
            goal_id=request.end_zone_id,
            group_size=request.group_size,
            zone_risk_scores=live_risks
        )
        
        warnings = []
        if not path:
            return SafeRoute(
                route_id=str(uuid.uuid4()),
                path=[],
                estimated_time_mins=0.0,
                status="FAILED",
                warnings=["No safe route could be found between the selected zones."]
            )
            
        if request.group_size > 5:
            warnings.append("Large group detected. Route adjusted to avoid narrow paths and bottlenecks.")
            
        # Basic time estimation: ~80 meters per minute walking speed
        total_distance_estimate = len(path) * 100  # Rough estimate
        estimated_time = total_distance_estimate / 80.0
            
        return SafeRoute(
            route_id=str(uuid.uuid4()),
            path=path,
            estimated_time_mins=round(estimated_time, 1),
            status="SAFE",
            warnings=warnings
        )
