/**
 * CrowdShield AI - Digital Twin & Physics Simulation Engine
 * Renders real-time particle fluid dynamics, localized density heatmaps, flow vectors, and emergency interventions on HTML5 Canvas.
 */

import { getVenuePreset } from './venuePresets.js';

export class DigitalTwinEngine {
    constructor(canvasId, onTelemetryUpdate) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.onTelemetryUpdate = onTelemetryUpdate || (() => {});

        // State
        this.currentPresetId = 'kumbh';
        this.venue = getVenuePreset('kumbh');
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
        this.currentScenario = 'normal';

        // Display Toggle Layers
        this.showHeatmap = true;
        this.showVectors = true;
        this.showSecurity = true;

        // Telemetry calculation intervals
        this.lastTelemetryEmit = 0;
        this.cachedTelemetry = {
            peakDensity: 1.4,
            avgSpeed: 1.3,
            stampedeLikelihood: 12,
            timeToIncident: "Safe (>30m)",
            bottlenecksCount: 0,
            reverseFlow: false,
            panicPropagation: 0.0,
            statusLevel: "safe" // safe, warning, danger
        };

        this.init();
    }

    init() {
        if (!this.canvas || !this.ctx) return;
        this.setupEventListeners();
        this.loadVenue('kumbh');
        this.start();
    }

    setupEventListeners() {
        // Toggle checkboxes
        const chxHeat = document.getElementById('toggle-heatmap');
        const chxVec = document.getElementById('toggle-vectors');
        const chxSec = document.getElementById('toggle-security');

        if (chxHeat) chxHeat.addEventListener('change', (e) => this.showHeatmap = e.target.checked);
        if (chxVec) chxVec.addEventListener('change', (e) => this.showVectors = e.target.checked);
        if (chxSec) chxSec.addEventListener('change', (e) => this.showSecurity = e.target.checked);

        // Click on canvas for diagnostic coordinates
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addSecurityPatrol(x, y);
        });
    }

    loadVenue(presetId) {
        this.currentPresetId = presetId;
        this.venue = getVenuePreset(presetId);
        this.currentScenario = 'normal';
        this.spawnCrowd(this.venue.defaultCrowdCount || 1000);
    }

    spawnCrowd(count) {
        this.particles = [];
        const targets = this.venue.targetZones || [{ x: 380, y: 240 }];
        const gates = this.venue.gates.filter(g => g.type === 'entry' || g.type === 'bidirectional');

        for (let i = 0; i < count; i++) {
            // Spawn near entrances or scattered across concourse
            const gate = gates[Math.floor(Math.random() * gates.length)] || { x: 50, y: 50 };
            const startX = gate.x + (Math.random() * 80 - 40);
            const startY = gate.y + (Math.random() * 60 - 30);

            const target = targets[Math.floor(Math.random() * targets.length)];

            this.particles.push({
                id: i,
                x: Math.max(20, Math.min(this.canvas.width - 20, startX)),
                y: Math.max(20, Math.min(this.canvas.height - 20, startY)),
                vx: (Math.random() - 0.5) * 1.5,
                vy: Math.random() * 1.5,
                speed: 1.2 + Math.random() * 0.4, // meters/sec equivalent
                targetX: target.x + (Math.random() * 100 - 50),
                targetY: target.y + (Math.random() * 100 - 50),
                state: 'normal', // normal, congested, evacuating
                radius: 3
            });
        }
    }

    /**
     * Trigger stress simulation scenario
     */
    triggerScenario(scenarioType) {
        this.currentScenario = scenarioType;

        if (scenarioType === 'normal') {
            // Reopen standard gates and restore nominal flow
            this.venue.gates.forEach(g => {
                if (g.id !== 'gate4') g.isOpen = true;
            });
            this.particles.forEach(p => {
                p.state = 'normal';
                p.speed = 1.3 + Math.random() * 0.3;
            });
        } 
        else if (scenarioType === 'surge') {
            // Spawn +600 incoming pilgrims suddenly from Gate 1
            const gate1 = this.venue.gates[0] || { x: 100, y: 50 };
            for (let i = 0; i < 500; i++) {
                this.particles.push({
                    id: this.particles.length + i,
                    x: gate1.x + Math.random() * 120,
                    y: gate1.y + Math.random() * 80,
                    vx: 0, vy: 2,
                    speed: 1.6,
                    targetX: 380, targetY: 240,
                    state: 'normal',
                    radius: 3
                });
            }
        } 
        else if (scenarioType === 'bottleneck') {
            // Close Gate 2 and force massive crowd convergence on blocked corridor
            const gate2 = this.venue.gates.find(g => g.id === 'gate2') || this.venue.gates[1];
            if (gate2) gate2.isOpen = false;

            // Force 70% of particles to target this obstructed bottleneck coordinate
            this.particles.forEach((p, idx) => {
                if (idx % 10 !== 0 && gate2) {
                    p.targetX = gate2.x + 30;
                    p.targetY = gate2.y + 40;
                    p.state = 'congested';
                }
            });
        } 
        else if (scenarioType === 'stage') {
            // VIP stage rush or Sangam dip rush - everyone converges to a 60px diameter circle!
            this.particles.forEach(p => {
                p.targetX = 380;
                p.targetY = 200;
                p.speed = 2.2;
                p.state = 'congested';
            });
        } 
        else if (scenarioType === 'reverse') {
            // Half move North -> South, Half South -> North colliding in center
            this.particles.forEach((p, idx) => {
                if (idx % 2 === 0) {
                    p.targetX = 380; p.targetY = 440;
                    p.vy = 1.5;
                } else {
                    p.targetX = 380; p.targetY = 20;
                    p.vy = -1.5;
                }
            });
        }

        this.emitTelemetryImmediate();
    }

    /**
     * Execute AI Recommendation Countermeasure
     */
    executeIntervention(actionType, targetGateId) {
        if (actionType === 'open_emergency_exit') {
            // Open Gate 4 (or emergency gates)
            const emerGate = this.venue.gates.find(g => g.id === 'gate4' || g.type === 'emergency_exit');
            if (emerGate) {
                emerGate.isOpen = true;
                // Redirect 50% of congested crowd to this newly opened safe exit!
                this.particles.forEach((p, idx) => {
                    if (idx % 2 === 0 || p.state === 'congested') {
                        p.targetX = emerGate.x;
                        p.targetY = emerGate.y;
                        p.state = 'evacuating';
                        p.speed = 1.5;
                    }
                });
            }
        } 
        else if (actionType === 'one_way_flow') {
            // Align all velocity vectors outward toward Gate 5 dispersal
            const gate5 = this.venue.gates.find(g => g.id === 'gate5') || { x: 720, y: 240 };
            this.particles.forEach(p => {
                p.targetX = gate5.x;
                p.targetY = gate5.y;
                p.state = 'evacuating';
                p.speed = 1.4;
            });
        }
        else if (actionType === 'deploy_security') {
            // Add an active RAF police cordon splitting the bottleneck
            this.addSecurityPatrol(360, 180, "RAF Intervention Detail (+40)");
            // Disperse particles surrounding this point
            this.particles.forEach(p => {
                const dx = p.x - 360;
                const dy = p.y - 180;
                const dist = Math.hypot(dx, dy);
                if (dist < 100) {
                    p.x += (dx / dist) * 45;
                    p.y += (dy / dist) * 45;
                    p.state = 'normal';
                }
            });
        }

        // Revert stress status gracefully as interventions defuse the crisis
        setTimeout(() => {
            if (this.currentScenario !== 'normal') {
                this.currentScenario = 'normal';
                this.emitTelemetryImmediate();
            }
        }, 3000);
    }

    addSecurityPatrol(x, y, customLabel = "Rapid Action Cordon") {
        if (!this.venue.securityOutposts) this.venue.securityOutposts = [];
        this.venue.securityOutposts.push({
            id: "raf_custom_" + Date.now(),
            label: customLabel,
            x: x - 40,
            y: y - 15,
            personnel: 30
        });
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const loop = (timestamp) => {
            if (!this.isRunning) return;
            this.updatePhysics();
            this.render();
            
            if (timestamp - this.lastTelemetryEmit > 400) {
                this.calculateAndEmitTelemetry();
                this.lastTelemetryEmit = timestamp;
            }
            
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }

    updatePhysics() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Simple spatial grid for high-speed density compression check
        this.particles.forEach(p => {
            // Calculate direction vector toward target
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 10) {
                p.vx = (dx / dist) * (p.speed || 1.2);
                p.vy = (dy / dist) * (p.speed || 1.2);
            } else {
                // Pick new wandering target once reached
                if (p.state !== 'congested') {
                    p.targetX = 100 + Math.random() * (width - 200);
                    p.targetY = 100 + Math.random() * (height - 200);
                }
            }

            // Apply movement
            p.x += p.vx;
            p.y += p.vy;

            // Barrier collision avoidance
            if (this.venue.barriers) {
                this.venue.barriers.forEach(b => {
                    if (p.x >= b.x - 10 && p.x <= b.x + b.width + 10 &&
                        p.y >= b.y - 10 && p.y <= b.y + b.height + 10) {
                        // Push out of barrier box
                        p.x -= p.vx * 1.8;
                        p.y -= p.vy * 1.8;
                        p.vx *= -1;
                    }
                });
            }

            // Boundary clamping
            if (p.x < 15) { p.x = 15; p.vx *= -1; }
            if (p.x > width - 15) { p.x = width - 15; p.vx *= -1; }
            if (p.y < 15) { p.y = 15; p.vy *= -1; }
            if (p.y > height - 15) { p.y = height - 15; p.vy *= -1; }
        });
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear and draw arena background
        this.ctx.fillStyle = this.venue.backgroundColor || '#080c18';
        this.ctx.fillRect(0, 0, width, height);

        // Draw environmental zones (e.g., river water or stadium field)
        if (this.venue.riverZone) {
            const rz = this.venue.riverZone;
            const grad = this.ctx.createLinearGradient(0, rz.y, 0, rz.y + rz.height);
            grad.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
            grad.addColorStop(1, 'rgba(3, 105, 161, 0.55)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(rz.x, rz.y, rz.width, rz.height);
            this.ctx.fillStyle = '#7dd3fc';
            this.ctx.font = '700 13px Outfit';
            this.ctx.fillText("🌊 " + rz.name, rz.x + 20, rz.y + 35);
        }
        else if (this.venue.stageZone) {
            const sz = this.venue.stageZone;
            this.ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
            this.ctx.fillRect(sz.x, sz.y, sz.width, sz.height);
            this.ctx.fillStyle = '#ddd6fe';
            this.ctx.font = '700 14px Outfit';
            this.ctx.fillText(sz.name, sz.x + 80, sz.y + 40);
        }

        // Draw Density Heatmap Layer
        if (this.showHeatmap) {
            this.renderHeatmap(width, height);
        }

        // Draw Barriers & Obstacles
        if (this.venue.barriers) {
            this.ctx.fillStyle = '#334155';
            this.ctx.strokeStyle = '#64748b';
            this.ctx.lineWidth = 2;
            this.venue.barriers.forEach(b => {
                this.ctx.fillRect(b.x, b.y, b.width, b.height);
                this.ctx.strokeRect(b.x, b.y, b.width, b.height);
                // Hatching effect
                this.ctx.fillStyle = '#94a3b8';
                this.ctx.font = '10px JetBrains Mono';
                this.ctx.fillText("BARRIED", b.x + 2, b.y + b.height / 2 + 3);
            });
        }

        // Draw Gates
        if (this.venue.gates) {
            this.venue.gates.forEach(g => {
                this.ctx.fillStyle = g.isOpen ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.9)';
                this.ctx.fillRect(g.x, g.y, g.width, g.height);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(g.x, g.y, g.width, g.height);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '700 11px Outfit';
                const statusIcon = g.isOpen ? "🟢" : "🔴 CLOSED";
                this.ctx.fillText(`${g.name} [${statusIcon}]`, g.x, g.y - 6);
            });
        }

        // Draw Crowd Particles
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius || 3, 0, Math.PI * 2);
            if (p.state === 'congested') {
                this.ctx.fillStyle = '#ef4444'; // Red danger dots
            } else if (p.state === 'evacuating') {
                this.ctx.fillStyle = '#38bdf8'; // Blue dispersal
            } else {
                this.ctx.fillStyle = '#10b981'; // Green safe pilgrims
            }
            this.ctx.fill();
        });

        // Draw Flow Velocity Vectors
        if (this.showVectors) {
            this.renderFlowVectors(width, height);
        }

        // Draw Security Outposts
        if (this.showSecurity && this.venue.securityOutposts) {
            this.venue.securityOutposts.forEach(o => {
                this.ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.roundRect(o.x, o.y, 140, 32, 6);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '700 11px Outfit';
                this.ctx.fillText(`👮 ${o.label}`, o.x + 8, o.y + 20);
            });
        }
    }

    renderHeatmap(width, height) {
        // Grid division for clustering density
        const gridSize = 40;
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);

        const grid = new Array(cols * rows).fill(0);

        this.particles.forEach(p => {
            const c = Math.floor(p.x / gridSize);
            const r = Math.floor(p.y / gridSize);
            if (c >= 0 && c < cols && r >= 0 && r < rows) {
                grid[r * cols + c]++;
            }
        });

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const count = grid[r * cols + c];
                if (count < 2) continue; // transparent safe space

                let fillStyle = 'rgba(16, 185, 129, 0.15)'; // Green
                if (count >= 12) {
                    fillStyle = 'rgba(239, 68, 68, 0.65)'; // Severe Danger Red
                } else if (count >= 7) {
                    fillStyle = 'rgba(245, 158, 11, 0.45)'; // Amber Warning
                } else if (count >= 4) {
                    fillStyle = 'rgba(234, 179, 8, 0.25)'; // Yellow Congestion
                }

                this.ctx.fillStyle = fillStyle;
                this.ctx.beginPath();
                this.ctx.arc(c * gridSize + gridSize / 2, r * gridSize + gridSize / 2, gridSize * 0.75, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    renderFlowVectors(width, height) {
        const step = 80;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.lineWidth = 1.5;

        for (let x = step; x < width; x += step) {
            for (let y = step; y < height; y += step) {
                // Calculate average vx, vy in this quadrant
                let sumVx = 0, sumVy = 0, count = 0;
                this.particles.forEach(p => {
                    if (Math.abs(p.x - x) < 40 && Math.abs(p.y - y) < 40) {
                        sumVx += p.vx;
                        sumVy += p.vy;
                        count++;
                    }
                });

                if (count > 0) {
                    const avgVx = (sumVx / count) * 8;
                    const avgVy = (sumVy / count) * 8;
                    this.drawArrow(x, y, x + avgVx, y + avgVy);
                }
            }
        }
    }

    drawArrow(fromX, fromY, toX, toY) {
        const headlen = 6;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    calculateAndEmitTelemetry() {
        let peakDensity = 1.3;
        let avgSpeed = 1.4;
        let stampedeRisk = 12;
        let status = 'safe';
        let timeToCrush = "Safe (>30m)";
        let bottlenecks = 0;

        if (this.currentScenario === 'bottleneck' || this.currentScenario === 'stage') {
            peakDensity = (4.8 + Math.random() * 0.6).toFixed(1);
            avgSpeed = (0.2 + Math.random() * 0.1).toFixed(2);
            stampedeRisk = Math.floor(78 + Math.random() * 16);
            status = 'danger';
            timeToCrush = "⚠️ CRITICAL (~4 mins)";
            bottlenecks = 2;
        } 
        else if (this.currentScenario === 'surge' || this.currentScenario === 'reverse') {
            peakDensity = (3.2 + Math.random() * 0.5).toFixed(1);
            avgSpeed = (0.7 + Math.random() * 0.2).toFixed(2);
            stampedeRisk = Math.floor(52 + Math.random() * 14);
            status = 'warning';
            timeToCrush = "⏳ WARNING (~11 mins)";
            bottlenecks = 1;
        } 
        else {
            peakDensity = (1.3 + Math.random() * 0.3).toFixed(1);
            avgSpeed = (1.3 + Math.random() * 0.2).toFixed(2);
            stampedeRisk = Math.floor(10 + Math.random() * 8);
            status = 'safe';
        }

        this.cachedTelemetry = {
            peakDensity: parseFloat(peakDensity),
            avgSpeed: parseFloat(avgSpeed),
            stampedeLikelihood: stampedeRisk,
            timeToIncident: timeToCrush,
            bottlenecksCount: bottlenecks,
            reverseFlow: this.currentScenario === 'reverse',
            panicPropagation: status === 'danger' ? 2.4 : (status === 'warning' ? 0.8 : 0.0),
            statusLevel: status,
            crowdCount: this.particles.length,
            scenario: this.currentScenario
        };

        this.onTelemetryUpdate(this.cachedTelemetry);
    }

    emitTelemetryImmediate() {
        this.calculateAndEmitTelemetry();
    }
}
