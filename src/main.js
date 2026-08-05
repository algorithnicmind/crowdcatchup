/**
 * CrowdShield AI - Main Platform Bootstrapper & Integration Controller
 * Ties together the Digital Twin Simulation, AI Predictive Risk Engine, Recommendation System,
 * Voice Copilot, GenAI SITREP generator, and Citizen Mobile Application Emulator.
 */

import { DigitalTwinEngine } from './simulation/digitalTwinEngine.js';
import { RiskPredictionEngine } from './ai/riskPredictionEngine.js';
import { RecommendationSystem } from './ai/recommendationSystem.js';
import { VoiceAssistant } from './modules/voiceAssistant.js';
import { GenAiSummary } from './modules/genAiSummary.js';
import { MobileAppController } from './modules/mobileAppController.js';

class CrowdShieldApp {
    constructor() {
        this.twinEngine = null;
        this.riskEngine = null;
        this.recSystem = null;
        this.voiceAssistant = null;
        this.genAiSummary = null;
        this.mobileApp = null;
    }

    init() {
        console.log("🛡️ Initializing CrowdShield AI Early Warning Platform...");

        // 1. Initialize Citizen Companion Mobile Emulator
        this.mobileApp = new MobileAppController((sosData) => {
            this.handleUserSosReport(sosData);
        });

        // 2. Initialize Recommendation System with Executive Execution hooks
        this.recSystem = new RecommendationSystem(
            (actionType) => {
                console.log(`⚡ Executing AI Countermeasure Intervention: ${actionType}`);
                if (this.twinEngine) this.twinEngine.executeIntervention(actionType);
            },
            (broadcastKey) => {
                console.log(`📢 Broadcasting Multilingual Alert: ${broadcastKey}`);
                if (this.mobileApp) this.mobileApp.pushBroadcast(broadcastKey);
            }
        );

        // 3. Initialize Risk Analytics Engine
        this.riskEngine = new RiskPredictionEngine((statusLevel, telemetry, prevLevel) => {
            console.log(`⚠️ Risk Status transitioned from [${prevLevel}] -> [${statusLevel}]`);
            if (this.recSystem) this.recSystem.evaluateSituation(statusLevel, telemetry);
            if (this.mobileApp) this.mobileApp.setSafetyState(statusLevel);
        });

        // 4. Initialize Digital Twin Simulation Canvas
        this.twinEngine = new DigitalTwinEngine('digital-twin-canvas', (telemetry) => {
            if (this.riskEngine) this.riskEngine.processTelemetry(telemetry);
        });

        // 5. Initialize Voice Copilot
        this.voiceAssistant = new VoiceAssistant(
            () => this.riskEngine ? this.riskEngine.getLatestAnalysisSummary() : {},
            (command) => {
                if (this.twinEngine) this.twinEngine.executeIntervention(command);
            }
        );

        // 6. Initialize GenAI Situation Report (SITREP) Modal Engine
        this.genAiSummary = new GenAiSummary(() => {
            return this.riskEngine ? this.riskEngine.getLatestAnalysisSummary() : {};
        });

        this.setupUIControls();
        this.startSystemClock();
    }

    setupUIControls() {
        // Venue selector dropdown
        const venueSelect = document.getElementById('venue-select');
        if (venueSelect) {
            venueSelect.addEventListener('change', (e) => {
                const venueId = e.target.value;
                if (this.twinEngine) {
                    this.twinEngine.loadVenue(venueId);
                    if (this.recSystem) this.recSystem.reset();
                    if (this.mobileApp) this.mobileApp.setSafetyState('safe');
                }
            });
        }

        // Scenario stress simulation triggers
        const scenarioBtns = document.querySelectorAll('.scenario-btn');
        scenarioBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                scenarioBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const scenarioType = btn.getAttribute('data-scenario') || 'normal';
                console.log(`⚡ Triggering stress scenario: ${scenarioType}`);
                if (this.twinEngine) {
                    this.twinEngine.triggerScenario(scenarioType);
                }
            });
        });
    }

    handleUserSosReport(sosData) {
        console.warn("🚨 Urgent SOS Received from Citizen App:", sosData);
        // Add a visual security response marker on the Digital Twin arena
        if (this.twinEngine) {
            this.twinEngine.addSecurityPatrol(380, 260, `🚨 SOS: ${sosData.type.toUpperCase()}`);
        }

        // Pop up an immediate advisory item on the Command Room Dashboard
        if (this.recSystem && this.recSystem.activeRecommendations.length === 0) {
            this.recSystem.activeRecommendations.push({
                id: 'sos_' + Date.now(),
                title: `🚨 CROWDSOURCED SOS: ${sosData.type.toUpperCase()}`,
                priority: 'high',
                isCritical: true,
                description: `Attendee reported critical situation near ${sosData.zone}: "${sosData.details || 'Overcrowding warning'}". Dispatch emergency medical team and Rapid Action Force immediately.`,
                actionType: 'deploy_security',
                broadcastKey: 'emergencyEvac'
            });
            this.recSystem.renderQueue();
        }
    }

    startSystemClock() {
        const clockEl = document.getElementById('system-clock');
        setInterval(() => {
            if (clockEl) {
                const now = new Date();
                clockEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
            }
        }, 1000);
    }
}

// Bootstrap application once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CrowdShieldApp();
    app.init();
});
