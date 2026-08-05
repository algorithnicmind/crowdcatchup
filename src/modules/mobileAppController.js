/**
 * CrowdShield AI - Citizen Companion Mobile Application Controller
 * Manages the embedded simulated mobile interface, multilingual translations, live push broadcast feeds,
 * safe escape routing guidance, and crowd-sourced SOS early warning incident reports.
 */

import { getTranslation } from '../data/translations.js';

export class MobileAppController {
    constructor(onSosReported) {
        this.onSosReported = onSosReported || (() => {});
        this.currentLang = 'en';
        this.activeBroadcasts = []; // List of received broadcast keys
        this.currentStatusLevel = 'safe';

        // DOM Elements
        this.langSelect = document.getElementById('mobile-lang-select');
        this.bannerEl = document.getElementById('mobile-safety-banner');
        this.bannerTitle = document.getElementById('banner-status-title');
        this.bannerSub = document.getElementById('banner-status-sub');
        this.bannerIcon = document.getElementById('banner-icon');

        this.feedContainer = document.getElementById('mobile-alerts-feed');
        this.badgeCount = document.getElementById('alert-count-badge');
        this.navTargetGate = document.getElementById('nav-target-gate');
        this.btnAudioGuide = document.getElementById('btn-play-audio-guide');
        this.sosForm = document.getElementById('sos-report-form');

        this.init();
    }

    init() {
        // 1. Language switcher
        if (this.langSelect) {
            this.langSelect.addEventListener('change', (e) => {
                this.currentLang = e.target.value;
                this.updateInterfaceLanguage();
            });
        }

        // 2. Tab switcher
        const tabs = document.querySelectorAll('.mobile-tabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetId = tab.getAttribute('data-target');
                document.querySelectorAll('.phone-tab-content .screen-view').forEach(screen => {
                    screen.classList.add('hidden');
                });
                const targetScreen = document.getElementById(targetId);
                if (targetScreen) targetScreen.classList.remove('hidden');
            });
        });

        // 3. Audio Navigation Guide
        if (this.btnAudioGuide) {
            this.btnAudioGuide.addEventListener('click', () => {
                const guideText = getTranslation(this.currentLang, 'voiceGuide');
                this.speak(guideText, this.getLangCode(this.currentLang));
                this.btnAudioGuide.textContent = "🔊 Playing Navigation Guide...";
                setTimeout(() => {
                    this.btnAudioGuide.textContent = "🔊 Play Audio Guidance";
                }, 4000);
            });
        }

        // 4. SOS Report Form Submission
        if (this.sosForm) {
            this.sosForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const typeEl = document.getElementById('sos-type');
                const zoneEl = document.getElementById('sos-zone');
                const descEl = document.getElementById('sos-desc');

                const reportData = {
                    type: typeEl ? typeEl.value : 'overcrowding',
                    zone: zoneEl ? zoneEl.value : 'Sector B / Ghat Central',
                    details: descEl ? descEl.value : '',
                    timestamp: Date.now()
                };

                // Trigger callback to control room
                this.onSosReported(reportData);

                // Show success alert in form
                const successMsg = getTranslation(this.currentLang, 'sosSuccess');
                const alertDiv = document.createElement('div');
                alertDiv.style.cssText = 'background:rgba(16,185,129,0.2); border:1px solid #10b981; color:#34d399; padding:0.75rem; border-radius:8px; font-size:0.8rem; margin-top:0.5rem; text-align:center; font-weight:700;';
                alertDiv.textContent = successMsg;

                this.sosForm.appendChild(alertDiv);
                if (descEl) descEl.value = '';

                setTimeout(() => {
                    if (alertDiv && alertDiv.parentElement) alertDiv.remove();
                }, 5000);
            });
        }

        // Initialize clock loop for phone status bar
        setInterval(() => {
            const clockEl = document.getElementById('phone-clock');
            if (clockEl) {
                const now = new Date();
                clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        }, 1000);
    }

    updateInterfaceLanguage() {
        // Update safety banner
        if (this.currentStatusLevel === 'danger') {
            this.bannerTitle.textContent = getTranslation(this.currentLang, 'dangerStatusTitle');
            this.bannerSub.textContent = getTranslation(this.currentLang, 'dangerStatusSub');
        } else {
            this.bannerTitle.textContent = getTranslation(this.currentLang, 'safeStatusTitle');
            this.bannerSub.textContent = getTranslation(this.currentLang, 'safeStatusSub');
        }

        // Update nav text
        if (this.navTargetGate) {
            this.navTargetGate.textContent = getTranslation(this.currentLang, 'navGuideText');
        }

        // Re-render broadcasts in selected language
        this.renderBroadcasts();
    }

    setSafetyState(statusLevel) {
        this.currentStatusLevel = statusLevel;
        if (!this.bannerEl || !this.bannerTitle || !this.bannerSub || !this.bannerIcon) return;

        if (statusLevel === 'danger' || statusLevel === 'warning') {
            this.bannerEl.className = 'mobile-safety-banner hazard-banner';
            this.bannerIcon.textContent = '⚠️';
            this.bannerTitle.textContent = getTranslation(this.currentLang, 'dangerStatusTitle');
            this.bannerSub.textContent = getTranslation(this.currentLang, 'dangerStatusSub');
            
            // If danger just hit, automatically pop up an emergency evacuation broadcast!
            if (statusLevel === 'danger' && !this.activeBroadcasts.includes('emergencyEvac')) {
                this.pushBroadcast('emergencyEvac');
            }
        } else {
            this.bannerEl.className = 'mobile-safety-banner green-banner';
            this.bannerIcon.textContent = '🛡️';
            this.bannerTitle.textContent = getTranslation(this.currentLang, 'safeStatusTitle');
            this.bannerSub.textContent = getTranslation(this.currentLang, 'safeStatusSub');
        }
    }

    /**
     * Push a live alert broadcast from Command Room into the citizen feed
     */
    pushBroadcast(broadcastKey) {
        if (!this.activeBroadcasts.includes(broadcastKey)) {
            this.activeBroadcasts.unshift(broadcastKey);
        }
        this.renderBroadcasts();

        // Ensure user sees the notification by vibrating/switching to alert badge
        if (this.badgeCount) {
            this.badgeCount.textContent = this.activeBroadcasts.length;
            this.badgeCount.style.animation = 'beacon-pulse 1s infinite';
        }
    }

    renderBroadcasts() {
        if (!this.feedContainer) return;

        if (this.activeBroadcasts.length === 0) {
            this.feedContainer.innerHTML = `
                <div class="empty-alert-state">
                    <span>📨 No urgent safety warnings broadcasted. Enjoy your peaceful gathering!</span>
                </div>
            `;
            return;
        }

        this.feedContainer.innerHTML = '';
        this.activeBroadcasts.forEach(key => {
            const itemData = getTranslation(this.currentLang, `broadcasts.${key}`);
            if (!itemData || typeof itemData === 'string') return;

            const card = document.createElement('div');
            card.className = `mobile-alert-card ${key === 'emergencyEvac' ? 'emergency' : ''}`;
            card.innerHTML = `
                <h6>${itemData.title} <span style="font-size:0.65rem; background:#1e293b; padding:2px 5px; border-radius:4px;">LIVE</span></h6>
                <p>${itemData.desc}</p>
                <span class="alert-meta">📣 ${itemData.meta}</span>
            `;
            this.feedContainer.appendChild(card);
        });
    }

    speak(text, langCode) {
        const synth = window.speechSynthesis;
        if (!synth) return;
        try {
            synth.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langCode;
            utterance.rate = 1.0;
            synth.speak(utterance);
        } catch (e) {
            console.warn("Speech error:", e);
        }
    }

    getLangCode(lang) {
        switch (lang) {
            case 'hi': return 'hi-IN';
            case 'mr': return 'mr-IN';
            case 'ta': return 'ta-IN';
            default: return 'en-IN';
        }
    }
}
