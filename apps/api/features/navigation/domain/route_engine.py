import heapq
from typing import Dict, List, Optional, Set
import math
from .entities.journey import GeoPoint

class Edge:
    def __init__(self, target: str, base_distance: float, is_narrow: bool = False):
        self.target = target
        self.base_distance = base_distance
        self.is_narrow = is_narrow

class Node:
    def __init__(self, node_id: str, point: GeoPoint):
        self.node_id = node_id
        self.point = point
        self.edges: List[Edge] = []

    def add_edge(self, target: str, base_distance: float, is_narrow: bool = False):
        self.edges.append(Edge(target, base_distance, is_narrow))


class RouteEngine:
    def __init__(self):
        self.nodes: Dict[str, Node] = {}

    def add_node(self, node_id: str, lat: float, lng: float):
        self.nodes[node_id] = Node(node_id, GeoPoint(lat=lat, lng=lng))

    def add_edge(self, source: str, target: str, base_distance: float, is_narrow: bool = False, bidirectional: bool = True):
        if source in self.nodes and target in self.nodes:
            self.nodes[source].add_edge(target, base_distance, is_narrow)
            if bidirectional:
                self.nodes[target].add_edge(source, base_distance, is_narrow)

    def heuristic(self, node_a: str, node_b: str) -> float:
        """Calculate straight-line distance (Euclidean approx) for A* heuristic"""
        if node_a not in self.nodes or node_b not in self.nodes:
            return 0.0
        
        pa = self.nodes[node_a].point
        pb = self.nodes[node_b].point
        # Simple Euclidean distance for heuristic purposes
        return math.sqrt((pa.lat - pb.lat)**2 + (pa.lng - pb.lng)**2) * 111000 # Approx meters

    def find_safe_route(self, start_id: str, goal_id: str, group_size: int, zone_risk_scores: Dict[str, str]) -> Optional[List[GeoPoint]]:
        """
        A* algorithm with dynamic risk weighting.
        zone_risk_scores maps zone_id -> risk_level ("NORMAL", "HIGH", "CRITICAL")
        """
        if start_id not in self.nodes or goal_id not in self.nodes:
            return None

        # Risk penalty multipliers
        risk_penalties = {
            "NORMAL": 1.0,
            "HIGH": 3.0,
            "CRITICAL": 9999.0 # Effectively block the route
        }

        open_set = []
        heapq.heappush(open_set, (0, start_id))

        came_from: Dict[str, str] = {}
        g_score: Dict[str, float] = {node: float('inf') for node in self.nodes}
        g_score[start_id] = 0

        f_score: Dict[str, float] = {node: float('inf') for node in self.nodes}
        f_score[start_id] = self.heuristic(start_id, goal_id)

        while open_set:
            current_f, current = heapq.heappop(open_set)

            if current == goal_id:
                return self._reconstruct_path(came_from, current)

            for edge in self.nodes[current].edges:
                neighbor = edge.target
                
                # Dynamic constraints: Group size logic
                if group_size > 5 and edge.is_narrow:
                    continue # Large groups cannot take narrow paths
                
                # Dynamic constraints: Risk penalty
                neighbor_risk = zone_risk_scores.get(neighbor, "NORMAL")
                penalty = risk_penalties.get(neighbor_risk, 1.0)
                
                # Cost is base_distance * penalty
                cost = edge.base_distance * penalty
                tentative_g_score = g_score[current] + cost

                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + self.heuristic(neighbor, goal_id)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))

        return None # No path found

    def _reconstruct_path(self, came_from: Dict[str, str], current: str) -> List[GeoPoint]:
        path = [current]
        while current in came_from:
            current = came_from[current]
            path.append(current)
        path.reverse()
        return [self.nodes[node_id].point for node_id in path]
