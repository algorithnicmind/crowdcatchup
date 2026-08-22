import pytest
from features.navigation.domain.route_engine import RouteEngine
from features.navigation.application.navigation_service import NavigationService
from features.navigation.domain.entities.journey import RouteRequest

@pytest.fixture
def default_engine():
    engine = RouteEngine()
    # 0.001 degrees is approx 111 meters
    engine.add_node("A", 0.0, 0.0)
    engine.add_node("B", 0.0, 0.001)
    engine.add_node("C", 0.0, 0.002)
    engine.add_node("D", 0.001, 0.001)
    
    # Path A -> B -> C (distance 200, B is narrow)
    engine.add_edge("A", "B", 100.0, is_narrow=True)
    engine.add_edge("B", "C", 100.0, is_narrow=True)
    
    # Path A -> D -> C (distance 250, wide paths)
    engine.add_edge("A", "D", 125.0)
    engine.add_edge("D", "C", 125.0)
    
    return engine

def test_astar_finds_shortest_path(default_engine):
    # For a small group, it should take the shortest path A -> B -> C
    path = default_engine.find_safe_route("A", "C", group_size=2, zone_risk_scores={})
    assert path is not None
    assert len(path) == 3
    # Check if the points match A, B, C (we didn't store the IDs in the returned GeoPoints, but length is 3)

def test_astar_avoids_narrow_paths_for_large_groups(default_engine):
    # Group size 6 should avoid A->B->C because it's narrow. It must take A->D->C
    path = default_engine.find_safe_route("A", "C", group_size=6, zone_risk_scores={})
    assert path is not None
    assert len(path) == 3
    # Point at index 1 should be D (0.001, 0.001)
    assert path[1].lat == 0.001

def test_astar_avoids_high_risk_zones(default_engine):
    # Group size 2. Normally takes A->B->C. If B is HIGH risk, it should take A->D->C.
    risk_scores = {"B": "HIGH"}
    path = default_engine.find_safe_route("A", "C", group_size=2, zone_risk_scores=risk_scores)
    assert path is not None
    assert path[1].lat == 0.001 # Took node D instead

def test_astar_returns_none_if_no_path():
    engine = RouteEngine()
    engine.add_node("A", 0.0, 0.0)
    engine.add_node("B", 1.0, 1.0)
    # No edges added
    path = engine.find_safe_route("A", "B", group_size=1, zone_risk_scores={})
    assert path is None

def test_navigation_service_integration():
    service = NavigationService(db=None) # DB not used in mock
    
    # Entrance to Exit, small group
    req = RouteRequest(event_id="e1", start_zone_id="ENTRANCE_A", end_zone_id="EXIT_B", group_size=2)
    route = service.plan_safe_route(req)
    
    assert route.status == "SAFE"
    # Live risks mock has MAIN_HALL = HIGH.
    # ENTRANCE_A -> MAIN_HALL is 100. MAIN_HALL -> FOOD_COURT is 150. FOOD_COURT -> EXIT_B is 120. (Total 370).
    # But MAIN_HALL is HIGH risk (penalty x3). So cost is much higher.
    # Alternate is ENTRANCE_A -> VIP_LOUNGE (80, narrow) -> EXIT_B (100, narrow). Total 180.
    # It should take the alternate route (length 3: ENTRANCE, VIP, EXIT).
    assert len(route.path) == 3
    assert len(route.warnings) == 0

def test_navigation_service_large_group():
    service = NavigationService(db=None)
    
    # Entrance to Exit, LARGE group (size 10)
    req = RouteRequest(event_id="e1", start_zone_id="ENTRANCE_A", end_zone_id="EXIT_B", group_size=10)
    route = service.plan_safe_route(req)
    
    assert route.status == "SAFE"
    # Since VIP_LOUNGE route is narrow, large group CANNOT take it.
    # Must take MAIN_HALL, even though it's HIGH risk.
    # ENTRANCE -> MAIN_HALL -> FOOD_COURT -> EXIT_B (length 4)
    assert len(route.path) == 4
    assert len(route.warnings) == 1
    assert "Large group detected" in route.warnings[0]
