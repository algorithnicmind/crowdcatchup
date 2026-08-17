# Simulation Engine

This directory contains the synthetic data generators and scenario simulators for CrowdShield.

**Built in Phase 3 (Data Hub)** — Step 3.3 of the Master TODO.

Scenarios:
- Normal inflow
- Sudden surge
- Gate blockage
- Route blocked
- Crowd surge

All synthetic data is labeled `SIMULATED` and flows through the same pipeline as real data.

## Running the Simulator

1. **Install Requirements**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Interactive Simulator**
   ```bash
   python synthetic_simulator.py
   ```
   By default, it will push observations to `http://localhost:8000/api/v1/ingest`. To override this, use `--url <URL>`.

3. **Interactive Control**
   Once running, you can type the following commands to instantly switch the simulated crowd state:
   - `normal`: Normal inflow
   - `sudden_surge`: Sudden surge at Gate A
   - `gate_blockage`: Gate B blocked, exit rate drops
   - `route_blocked`: Route R1 blocked, speed drops
   - `crowd_surge`: Extreme crowd surge in Zone B
   - `quit`: Stop the simulator
