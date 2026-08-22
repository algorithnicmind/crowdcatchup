# 🎥 CrowdShield Demo Video Guide

This guide will help you record a professional, high-impact demonstration video of the CrowdShield platform for your hackathon submission. It explains how the system works, what each role does, and provides a step-by-step "script" to show off the best features.

---

## 🌟 The Core Concept (What you are pitching)
**CrowdShield** is an AI-Powered, Multi-Source Early Warning and Decision Support System for large public events. It doesn't just show data; it uses AI (simulated YOLOv8 vision & XGBoost risk engines) to *predict* crowd crushes before they happen, and automatically coordinates the response between the Command Center, Police on the ground, and Citizens.

---

## 🎭 The 4 User Roles & Their Dashboards

Before recording, understand that CrowdShield is a **multi-tenant** platform. You will want to show all four perspectives to prove how interconnected the system is.

### 1. 👑 Authority Command Center (`/authority`)
*   **The Brain:** This is the central hub for event commanders.
*   **Key Features to Show:**
    *   **Live Simulator Controls:** This panel lets you inject fake data (like a "Crowd Surge") to test the system.
    *   **AI Recommendations:** When a risk is detected, the AI generates a plan. Show how it explains *why* it made the decision (Source Agreement, Confidence %).
    *   **CCTV & Source Health:** Show the panels that monitor the health of the hardware.

### 2. 👮 Police / Security Staff (`/police`)
*   **The Muscle:** The on-the-ground responders.
*   **Key Features to Show:**
    *   **Task Card (Priority Alert):** When the Authority approves an AI plan, it instantly appears here telling the police exactly where to go.
    *   **Live Telemetry:** Shows that the officer's GPS is syncing with the command center.

### 3. 🧍 Citizen / Attendee (`/citizen`)
*   **The Public:** This is the PWA (Progressive Web App) interface for people attending the event.
*   **Key Features to Show:**
    *   **Emergency SOS:** The big red button that alerts police.
    *   **Safe Route Planner:** A navigation system that calculates routes *around* congested areas.
    *   **Emergency Broadcasts:** Real-time push notifications when danger occurs.

### 4. 🏗️ Event Owner / Organizer (`/owner`)
*   **The Architect:** The setup phase.
*   **Key Features to Show:**
    *   **Properties Panel:** How an organizer clicks on the map to define zones, set max capacities, and define risk thresholds before the event even starts.

---

## 🎬 Step-by-Step Demo Script (The "Golden Flow")

To make a killer demo video, we recommend following this exact sequence. **Pro Tip:** Open 3 or 4 different browser windows (or tabs) side-by-side, each logged into a different role, so the judges can see the real-time syncing!

### **Step 1: The Setup (Owner)**
1.  Open the **Owner Dashboard**.
2.  *Voiceover:* "Before the event begins, organizers use CrowdShield to map out the venue."
3.  Click on a zone on the map, and show the **Properties Panel** on the right. 
4.  Show how you can define the "Max Capacity" and "Risk Threshold". (Click the X to close it when done).

### **Step 2: The Incident (Authority)**
1.  Switch to the **Authority Dashboard**.
2.  *Voiceover:* "During the event, the Authority dashboard monitors everything. Let's see what happens when our AI detects a sudden crowd surge using CCTV cameras."
3.  Open the **Live Simulator Controls** and click **"🚨 Extreme Crowd Surge (Zone B)"**.
4.  *Wait a few seconds.*

### **Step 3: AI Decision Support (Authority)**
1.  The **AI Recommendation** panel will pop up automatically.
2.  *Voiceover:* "Instantly, our Fusion Engine processes the data and generates an Action Plan. Notice the Explainable AI—it tells us *why* it's recommending this (e.g., 88% prediction confidence)."
3.  Click the red **"Approve Plan"** button.

### **Step 4: The Response (Police & Citizen)**
1.  **Immediately switch to the Police Dashboard.**
2.  *Voiceover:* "The moment the plan is approved, ground units receive a Priority Alert."
3.  Show the orange **Task Card** that just popped up, instructing them to navigate to the zone.
4.  **Immediately switch to the Citizen Dashboard.**
5.  *Voiceover:* "Simultaneously, citizens in the danger zone receive an Emergency Broadcast."
6.  Show the Red Warning Toast at the top.
7.  Open the **Plan Safe Journey** panel, type in a destination, and click "Find Safe Route". 
8.  *Voiceover:* "Citizens can use the app to dynamically route *away* from the congestion."

### **Step 5: Bidirectional SOS (Citizen)**
1.  While still on the Citizen dashboard, click the big red **SOS (Shield)** button.
2.  *Voiceover:* "If a citizen is trapped, they can trigger an SOS, which instantly pings their exact GPS coordinates back to the Command Center."

### **Step 6: Wrap up (UI/UX)**
1.  Spend the last 15 seconds showing off the smooth UI. Open the **CCTV Grid** and close it using the 'X' button. Open the **Data Source Health** panel and close it. 
2.  *Voiceover:* "Everything is built as a PWA, meaning it installs natively on phones and works flawlessly in high-stress environments with real-time WebSockets."

---

## 💡 Tips for Recording
*   **Hide your bookmarks bar** to make the browser look clean.
*   Use a screen recorder like **OBS Studio** or **Loom**.
*   Don't worry if you mess up a click; just keep talking confidently. The UI is designed to look very premium and "hackathon-ready," so let the visuals do the heavy lifting!
*   If the OTP email doesn't arrive when you are logging in on camera, remember that we added the **Mock OTP Popup**. Just point out, *"For demo purposes, the OTP is displayed on screen."* and type it in.
