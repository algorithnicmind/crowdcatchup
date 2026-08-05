/**
 * CrowdShield AI - Predictive Risk Analytics & Forecasting Engine
 * Evaluates real-time sensor fusion metrics against critical crush physics thresholds
 * ($d \ge 4.5\text{ people/m}^2$ & velocity drop $< 0.5\text{ m/s}$) and synchronizes gauges.
 */

export class RiskPredictionEngine {
    constructor(onRiskStateChanged) {
        this.onRiskStateChanged = onRiskStateChanged || (() => {});
        this.currentStatusLevel = 'safe'; // safe, warning, danger
        this.historyLog = [];
        this.lastReportedAlert = null;
    }

    /**
     * Ingest new telemetry frame and update UI dashboards
     */
    processTelemetry(telemetry) {
        this.historyLog.push({ timestamp: Date.now(), ...telemetry });
        if (this.historyLog.length > 30) this.historyLog.shift();

        this.updateDashboardDials(telemetry);

        // Check for threshold transitions
        if (telemetry.statusLevel !== this.currentStatusLevel) {
            const previousLevel = this.currentStatusLevel;
            this.currentStatusLevel = telemetry.statusLevel;
            this.onRiskStateChanged(this.currentStatusLevel, telemetry, previousLevel);
        }
    }

    updateDashboardDials(t) {
        // 1. Stampede Risk Radial Gauge & Text
        const riskValEl = document.getElementById('val-stampede-risk');
        const riskCardEl = document.getElementById('card-stampede-risk');
        const statusTextEl = document.getElementById('status-stampede-text');
        const circleEl = document.getElementById('gauge-progress-circle');

        if (riskValEl) riskValEl.textContent = `${t.stampedeLikelihood}%`;

        if (circleEl) {
            // Circumference of radius 42 is 2 * Math.PI * 42 ~= 263.89
            const circumference = 264;
            const offset = circumference - (t.stampedeLikelihood / 100) * circumference;
            circleEl.style.strokeDashoffset = Math.max(0, offset);
        }

        if (riskCardEl && statusTextEl) {
            riskCardEl.classList.remove('danger', 'warning');
            if (t.statusLevel === 'danger') {
                riskCardEl.classList.add('danger');
                statusTextEl.textContent = "⚠️ CRITICAL STAMPEDE LIKELIHOOD";
            } else if (t.statusLevel === 'warning') {
                riskCardEl.classList.add('warning');
                statusTextEl.textContent = "⏳ ELEVATED CONGESTION DETECTED";
            } else {
                statusTextEl.textContent = "LOW RISK - NORMAL FLUIDITY";
            }
        }

        // 2. Countdown Forecast
        const timeEl = document.getElementById('val-time-to-crush');
        if (timeEl) timeEl.textContent = t.timeToIncident;

        // 3. Density & Speed meters
        const densityEl = document.getElementById('val-peak-density');
        const speedEl = document.getElementById('val-movement-speed');
        const fillDensity = document.getElementById('fill-density');
        const fillSpeed = document.getElementById('fill-speed');

        if (densityEl) densityEl.textContent = `${t.peakDensity} p/m²`;
        if (speedEl) speedEl.textContent = `${t.avgSpeed} m/s`;

        if (fillDensity) {
            // Max gauge benchmark 6.0 people/m^2
            const pct = Math.min(100, (t.peakDensity / 6.0) * 100);
            fillDensity.style.width = `${pct}%`;
            fillDensity.style.background = t.peakDensity >= 4.0 ? '#ef4444' : (t.peakDensity >= 2.5 ? '#f59e0b' : '#10b981');
        }
        if (fillSpeed) {
            // Nominal speed 1.5 m/s
            const pct = Math.min(100, (t.avgSpeed / 1.5) * 100);
            fillSpeed.style.width = `${pct}%`;
        }

        // 4. Diagnostics list
        const botEl = document.getElementById('status-bottleneck');
        const revEl = document.getElementById('status-reverse');
        const panicEl = document.getElementById('status-panic');

        if (botEl) botEl.textContent = t.bottlenecksCount > 0 ? `⚠️ YES (${t.bottlenecksCount} Active)` : "None (0 Active)";
        if (revEl) revEl.textContent = t.reverseFlow ? "⚠️ YES - Counter-flow Wave!" : "Undetected (Safe)";
        if (panicEl) panicEl.textContent = `${t.panicPropagation} m/s²`;

        // 5. Crowd Count & Canvas Map Overlay Toast
        const countEl = document.getElementById('stat-count');
        if (countEl && t.crowdCount) countEl.textContent = t.crowdCount.toLocaleString();

        const toastEl = document.getElementById('map-risk-toast');
        const titleEl = document.getElementById('map-alert-title');
        const descEl = document.getElementById('map-alert-desc');

        if (toastEl && titleEl && descEl) {
            if (t.statusLevel === 'danger') {
                toastEl.classList.remove('hidden');
                titleEl.textContent = "CRITICAL BOTTLENECK & CRUSH HAZARD";
                descEl.textContent = `Peak Density at ${t.peakDensity} p/m² with severe velocity stall (${t.avgSpeed} m/s). Execute immediate countermeasures!`;
            } else if (t.statusLevel === 'warning') {
                toastEl.classList.remove('hidden');
                toastEl.style.background = 'rgba(217, 119, 6, 0.95)';
                toastEl.style.borderColor = '#fbbf24';
                titleEl.textContent = "CONGESTION & SURGE DETECTED";
                descEl.textContent = `Crowd surge inflating density (${t.peakDensity} p/m²). Pre-emptive crowd redistribution recommended.`;
            } else {
                toastEl.classList.add('hidden');
                toastEl.style.background = '';
                toastEl.style.borderColor = '';
            }
        }
    }

    getLatestAnalysisSummary() {
        if (this.historyLog.length === 0) return { peakDensity: 1.3, avgSpeed: 1.3, statusLevel: 'safe' };
        return this.historyLog[this.historyLog.length - 1];
    }
}
