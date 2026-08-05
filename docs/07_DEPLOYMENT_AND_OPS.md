# Production Deployment & Operational Playbook (OPS)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** Edge Deployment Architecture, Mesh Protocol & Reliability Specification  
**Document Version:** 1.0 (Production Release)  

---

## 1. Production Edge Deployment Topology
Unlike conventional web web apps that depend on continuous multi-gigabit cloud connections, public assembly venues (such as religious ghat melas or remote rural stadiums) frequently face network infrastructure deficits. CrowdShield operates under a **Hardware-Independent Hybrid Edge Topology**:

```mermaid
graph TB
    subgraph FIELD["On-Site Venue Perimeter"]
        CAM[Existing Municipal CCTV Cameras] -->|RTSP Video Feed| EDGE[Edge Computing Gateway Box / Municipal Laptop]
        WIFI[Public MAC Probe Detectors] -->|Count Stream| EDGE
    end

    subgraph CONTROL["Local Command Room & Operations"]
        EDGE -->|Local HTTP / WebSockets| DASH[CrowdShield Web Dashboard (No Internet Req)]
        OFFICER[District Police Magistrate] <-->|Interactive Controls| DASH
    end

    subgraph MESH["Citizen Ad-Hoc Mesh Network (Offline Tolerant)"]
        DASH -->|Radio Transmitter / BLE Gateway| NODE1[Pilgrim Smartphone 1]
        NODE1 -->|P2P Wi-Fi Direct Relay| NODE2[Pilgrim Smartphone 2]
        NODE2 -->|P2P Bluetooth Relay| NODE3[Pilgrim Smartphone N]
    end
```

### 1.1 Edge Hardware Minimum Specifications
To guarantee seamless deployment without dedicated cloud datacenter costs, local command-room execution hardware requires only standard commodity specifications:
* **Processor:** Any modern Quad-Core CPU (Intel i3/i5 or AMD Ryzen 3+, ARM Cortex-A72+ on embedded edge hubs).
* **Memory:** Minimum 4GB RAM (Core web application footprint sits under $<250\text{MB}$ in active browser DOM).
* **Storage:** Zero high-capacity database requirement; logs rotate inside lightweight circular ring buffers (`RiskPredictionEngine.historyLog`).

---

## 2. Offline Mesh Networking Architecture

### 2.1 Cellular Blackout Mitigation
During crowd convergences exceeding $50,000$ simultaneous attendees per square kilometer, cellular towers experience severe random-access memory channel collisions, rendering standard SMS and internet push notifications useless.

CrowdShield bypasses infrastructure dependency using **Mobile Peer-to-Peer (P2P) Ad-Hoc Mesh Relay**:
1. **Gateway Injection:** The Control Room dashboard emits a localized broadcast packet ($256\text{ bytes}$) via peripheral low-energy transmitters (or Wi-Fi access point beacon frames).
2. **Multi-Hop Relay:** Citizen companion smartphones running the CrowdShield mobile app automatically re-transmit verified alert payloads to adjacent devices within a $30\text{-meter}$ radius via **Bluetooth Low Energy (BLE) Advertisements** and **Wi-Fi Direct P2P Group Communications**.
3. **Loop Suppression:** Each transmitted broadcast packet contains a deterministic hash ID (`id: "em_8041"`). Once a citizen's device ingests and displays a packet, it discards duplicates, preventing infinite transmission loops and battery consumption.

---

## 3. Reliability & Fallback Protocols (Disaster Recovery)

### 3.1 Sensor Degradation & Partial Camera Failure
In the event that an incoming CCTV optical stream drops offline or wireless probe detectors encounter interference:
* **Degraded Graceful Operation:** The AI Risk Prediction Engine switches from multi-sensor fusion to single-source extrapolation.
* **Manual Override & Visual Simulation Tracking:** Control room officers can utilize the interactive Digital Twin scenario triggers (`digitalTwinEngine.triggerScenario`) to manually inject observed field conditions into the analytical loop, ensuring continued real-time decision advisories and citizen warning distribution.

### 3.2 False Alarm Suppression SLA (Service Level Agreement)
To prevent warning-induced panic (where an over-eager automatic alarm incites a stampede):
* **No Single-Point Alarm Triggering:** Automated high-priority citizen evacuation broadcast pushes are programmatically disabled unless **both** physical criteria are concurrently breached: Local density $d \ge 4.0\text{ p/m}^2$ **AND** average walking speed falls below $0.5\text{ m/s}$ for more than $3.0\text{ seconds}$.
* **Authority Interception Windows:** All emergency recommendations undergo an instant 5-second officer validation window within the Intelligent Recommendation Queue before automated public broadcast activation.

---

## 4. Maintenance & Continuous Quality Assurance
* **Modular Localization Auditing:** Regional translation files ([translations.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/data/translations.js)) can be patched independently of core simulation physics, allowing municipal authorities to easily introduce additional languages (e.g., Bengali, Telugu, Gujarati) simply by appending JSON key-value pairs without re-compiling executable bundles.
* **Automated Regression Playbooks:** Pre-event testing requires running local HTTP simulation suites via `npx serve .` and verifying simulated high-density stress test scenarios (`Gate 2 Blockage` and `Stage Rush`) to guarantee zero Javascript console exceptions prior to event gate opening.
