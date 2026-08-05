/**
 * CrowdShield AI - Intelligent Recommendation & Actionable Intervention Engine
 * Dynamically composes countermeasures and connects executive command choices directly to active simulation states and mobile citizen alerts.
 */

export class RecommendationSystem {
    constructor(onExecuteIntervention, onBroadcastMessage) {
        this.onExecuteIntervention = onExecuteIntervention || (() => {});
        this.onBroadcastMessage = onBroadcastMessage || (() => {});
        this.queueContainer = document.getElementById('recommendations-queue');
        this.activeRecommendations = [];
    }

    /**
     * Recompute advisable countermeasures based on active telemetry & scenario state
     */
    evaluateSituation(statusLevel, telemetry) {
        this.activeRecommendations = [];

        if (telemetry.scenario === 'bottleneck' || statusLevel === 'danger') {
            this.activeRecommendations.push({
                id: 'rec_gate4_emer',
                title: '🚪 Open Emergency Gate 4 & Divert Flow',
                priority: 'high',
                isCritical: true,
                description: `Severe bottlenecking at Gate 2 ($d=${telemetry.peakDensity}\text{ p/m}^2$). Opening Gate 4 emergency ramp will instantly shed ~50% of incoming pressure and clear congestion within 180 seconds.`,
                actionType: 'open_emergency_exit',
                broadcastKey: 'gateClosed'
            });

            this.activeRecommendations.push({
                id: 'rec_deploy_raf',
                title: '👮 Dispatch Rapid Action Force (+40 Units)',
                priority: 'high',
                isCritical: true,
                description: 'Deploy physical cordon units to form a dividing wedge in the central concourse, preventing pedestrian crush compression.',
                actionType: 'deploy_security',
                broadcastKey: 'emergencyEvac'
            });
        } 
        else if (telemetry.scenario === 'surge' || telemetry.scenario === 'reverse' || statusLevel === 'warning') {
            this.activeRecommendations.push({
                id: 'rec_oneway_flow',
                title: '🔄 Enforce One-Way Pedestrian Routing',
                priority: 'med',
                isCritical: false,
                description: 'Counter-flow collision detected. Transitioning central promenade to unidirectional movement will restore avg velocity above 1.2 m/s.',
                actionType: 'one_way_flow',
                broadcastKey: 'oneWayFlow'
            });

            if (telemetry.scenario === 'surge') {
                this.activeRecommendations.push({
                    id: 'rec_weather_shelter',
                    title: '📢 Trigger Weather & Canopy Broadcast',
                    priority: 'med',
                    isCritical: false,
                    description: 'Prevent sudden rushing under fragile canvas tents. Guide crowd toward hard-roof pavilions and Gate 5 dispersal exits.',
                    actionType: 'one_way_flow',
                    broadcastKey: 'downpourSurge'
                });
            }
        } 
        else if (telemetry.scenario === 'stage') {
            this.activeRecommendations.push({
                id: 'rec_stage_buffer',
                title: '🎤 Erect VIP Pit Buffer & Open Perimeter Gate',
                priority: 'high',
                isCritical: true,
                description: 'Headline crowd surge compressing against front barricades! Re-route surrounding tiers immediately to perimeter exit portals.',
                actionType: 'open_emergency_exit',
                broadcastKey: 'emergencyEvac'
            });
        }

        this.renderQueue();
    }

    renderQueue() {
        if (!this.queueContainer) return;

        if (this.activeRecommendations.length === 0) {
            this.queueContainer.innerHTML = `
                <div class="rec-placeholder-empty">
                    <span>✅ Venue is operating within nominal parameters. AI standby for automatic intervention synthesis.</span>
                </div>
            `;
            return;
        }

        this.queueContainer.innerHTML = '';
        this.activeRecommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = `advisory-card ${rec.isCritical ? 'critical' : ''}`;
            card.setAttribute('data-id', rec.id);

            const priClass = rec.priority === 'high' ? 'high' : (rec.priority === 'med' ? 'med' : 'info');
            const priLabel = rec.priority === 'high' ? 'CRITICAL ACTION' : 'ADVISORY';

            card.innerHTML = `
                <div class="advisory-header">
                    <div class="advisory-title-wrap">
                        <strong>${rec.title}</strong>
                    </div>
                    <span class="priority-tag ${priClass}">${priLabel}</span>
                </div>
                <div class="advisory-body">
                    <p>${rec.description}</p>
                </div>
                <div class="advisory-actions">
                    <button type="button" class="btn-broadcast" data-broadcast="${rec.broadcastKey}">
                        📢 Broadcast Multilingual Alert
                    </button>
                    <button type="button" class="btn-execute-advisory" data-action="${rec.actionType}" title="Directly modifies the active Digital Twin arena simulation!">
                        ⚡ Accept & Execute Advisory
                    </button>
                </div>
            `;

            // Bind click events
            const btnExec = card.querySelector('.btn-execute-advisory');
            const btnBroad = card.querySelector('.btn-broadcast');

            if (btnExec) {
                btnExec.addEventListener('click', () => {
                    btnExec.textContent = "✔ EXECUTED IN SIMULATION";
                    btnExec.style.background = '#059669';
                    btnExec.style.color = '#fff';
                    btnExec.disabled = true;
                    this.onExecuteIntervention(rec.actionType);

                    // Simultaneously emit emergency broadcast to mobile app
                    if (rec.broadcastKey) {
                        this.onBroadcastMessage(rec.broadcastKey);
                    }
                });
            }

            if (btnBroad) {
                btnBroad.addEventListener('click', () => {
                    btnBroad.textContent = "📶 SENT TO CITIZEN MESH";
                    btnBroad.style.background = '#2563eb';
                    btnBroad.style.color = '#fff';
                    this.onBroadcastMessage(rec.broadcastKey);
                });
            }

            this.queueContainer.appendChild(card);
        });
    }

    reset() {
        this.activeRecommendations = [];
        this.renderQueue();
    }
}
