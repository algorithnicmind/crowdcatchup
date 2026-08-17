import time
import requests
import argparse
import random
import threading
from datetime import datetime, timezone
from rich.console import Console
from rich.table import Table
from rich.live import Live

console = Console()

API_URL = "http://localhost:8000/api/v1/ingest"
EVENT_ID = "EVT-001"
ZONE_A = "ZONE-A"
ZONE_B = "ZONE-B"

# Global state for current scenario
current_scenario = "normal"
is_running = True

SCENARIOS = {
    "normal": "Normal inflow",
    "sudden_surge": "Sudden surge at Gate A",
    "gate_blockage": "Gate B blocked, exit rate drops",
    "route_blocked": "Route R1 blocked, speed drops",
    "crowd_surge": "Extreme crowd surge in Zone B"
}

def generate_timestamp():
    return datetime.now(timezone.utc).isoformat()

def push_observation(obs):
    try:
        response = requests.post(API_URL, json=obs, timeout=2)
        return response.status_code == 200
    except Exception:
        return False

def get_base_metrics(scenario):
    """Generate metrics based on the active scenario."""
    metrics = {
        "ZONE-A": {"people_count": 500, "avg_speed": 1.2, "entry_rate": 20, "exit_rate": 20},
        "ZONE-B": {"people_count": 800, "avg_speed": 1.1, "entry_rate": 30, "exit_rate": 30}
    }
    
    if scenario == "sudden_surge":
        metrics["ZONE-A"]["entry_rate"] = 150
        metrics["ZONE-A"]["people_count"] = 1200
        metrics["ZONE-A"]["avg_speed"] = 0.8
    elif scenario == "gate_blockage":
        metrics["ZONE-B"]["exit_rate"] = 2  # almost 0
        metrics["ZONE-B"]["people_count"] = 1500
        metrics["ZONE-B"]["avg_speed"] = 0.5
    elif scenario == "route_blocked":
        metrics["ZONE-A"]["avg_speed"] = 0.2
        metrics["ZONE-B"]["avg_speed"] = 0.2
        metrics["ZONE-A"]["people_count"] = 1000
    elif scenario == "crowd_surge":
        metrics["ZONE-B"]["people_count"] = 2500
        metrics["ZONE-B"]["entry_rate"] = 200
        metrics["ZONE-B"]["exit_rate"] = 50
        metrics["ZONE-B"]["avg_speed"] = 0.1
        
    # Add some random noise
    for zone in metrics:
        for metric, val in metrics[zone].items():
            noise = random.uniform(-0.1, 0.1) * val
            metrics[zone][metric] = max(0, val + noise)
            
    return metrics

def create_observations(metrics):
    """Convert metrics to StandardObservation packets."""
    observations = []
    timestamp = generate_timestamp()
    
    # CCTV Observations
    for zone, m in metrics.items():
        observations.append({
            "event_id": EVENT_ID,
            "source_id": f"SIM-CCTV-{zone}",
            "source_type": "SYNTHETIC",
            "zone_id": zone,
            "timestamp": timestamp,
            "metric": "people_count",
            "value": m["people_count"],
            "confidence": 0.95,
            "latency_ms": 100,
            "health": "SIMULATED"
        })
        observations.append({
            "event_id": EVENT_ID,
            "source_id": f"SIM-CCTV-{zone}",
            "source_type": "SYNTHETIC",
            "zone_id": zone,
            "timestamp": timestamp,
            "metric": "avg_speed",
            "value": m["avg_speed"],
            "confidence": 0.90,
            "latency_ms": 150,
            "health": "SIMULATED"
        })
        
    # Gate Observations
    observations.append({
        "event_id": EVENT_ID,
        "source_id": "SIM-GATE-01",
        "source_type": "SYNTHETIC",
        "zone_id": ZONE_A,
        "timestamp": timestamp,
        "metric": "entry_rate",
        "value": metrics[ZONE_A]["entry_rate"],
        "confidence": 0.98,
        "latency_ms": 50,
        "health": "SIMULATED"
    })
    
    # GPS Aggregated Observations
    observations.append({
        "event_id": EVENT_ID,
        "source_id": "SIM-GPS-AGG",
        "source_type": "SYNTHETIC",
        "zone_id": ZONE_B,
        "timestamp": timestamp,
        "metric": "zone_device_count",
        "value": metrics[ZONE_B]["people_count"] * 0.4, # Assume 40% participation
        "confidence": 0.85,
        "latency_ms": 1200,
        "health": "SIMULATED"
    })
    
    return observations

def simulation_loop(api_url):
    global current_scenario, is_running
    
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Timestamp", style="dim", width=25)
    table.add_column("Scenario")
    table.add_column("Zone A (Count/Speed)")
    table.add_column("Zone B (Count/Speed)")
    table.add_column("Status")
    
    with Live(table, refresh_per_second=2) as live:
        while is_running:
            metrics = get_base_metrics(current_scenario)
            obs_list = create_observations(metrics)
            
            success_count = 0
            for obs in obs_list:
                if push_observation(obs):
                    success_count += 1
                    
            status = f"[green]{success_count}/{len(obs_list)} Sent[/green]" if success_count == len(obs_list) else f"[red]{success_count}/{len(obs_list)} Failed[/red]"
            
            za_str = f"{int(metrics[ZONE_A]['people_count'])} / {metrics[ZONE_A]['avg_speed']:.2f} m/s"
            zb_str = f"{int(metrics[ZONE_B]['people_count'])} / {metrics[ZONE_B]['avg_speed']:.2f} m/s"
            
            table.add_row(
                datetime.now().strftime("%H:%M:%S"),
                SCENARIOS[current_scenario],
                za_str,
                zb_str,
                status
            )
            
            time.sleep(2)

def interactive_prompt():
    global current_scenario, is_running
    console.print("\n[bold cyan]Synthetic Simulator Interactive Control[/bold cyan]")
    console.print("Available scenarios:")
    for key, desc in SCENARIOS.items():
        console.print(f"  [yellow]{key}[/yellow] - {desc}")
    console.print("Type 'quit' or 'q' to exit.\n")
    
    while is_running:
        try:
            cmd = input().strip().lower()
            if cmd in ["quit", "q", "exit"]:
                is_running = False
                break
            elif cmd in SCENARIOS:
                current_scenario = cmd
                console.print(f"[bold green]Switched to scenario:[/bold green] {SCENARIOS[cmd]}")
            else:
                if cmd:
                    console.print("[red]Invalid scenario. Please try again.[/red]")
        except KeyboardInterrupt:
            is_running = False
            break

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CrowdShield Synthetic Simulator")
    parser.add_argument("--url", default=API_URL, help="Backend API Ingestion URL")
    parser.add_argument("--scenario", default="normal", choices=list(SCENARIOS.keys()), help="Initial scenario")
    
    args = parser.parse_args()
    API_URL = args.url
    current_scenario = args.scenario
    
    console.print(f"Starting simulation. Pushing to [bold blue]{API_URL}[/bold blue] every 2 seconds.")
    
    # Run simulation loop in a background thread
    sim_thread = threading.Thread(target=simulation_loop, args=(API_URL,))
    sim_thread.daemon = True
    sim_thread.start()
    
    # Run interactive prompt in main thread
    interactive_prompt()
    
    console.print("[bold yellow]Simulator stopped.[/bold yellow]")
