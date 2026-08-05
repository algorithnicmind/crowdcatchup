/**
 * CrowdShield AI - Voice-Enabled Command Copilot ("Shield-AI")
 * Integrates Web Speech API recognition for voice queries and audio speech synthesis for intelligent vocal advisories.
 */

export class VoiceAssistant {
    constructor(getTelemetryCallback, onExecuteCommand) {
        this.getTelemetry = getTelemetryCallback || (() => ({}));
        this.onExecuteCommand = onExecuteCommand || (() => {});
        this.isListening = false;
        this.recognition = null;
        this.synth = window.speechSynthesis || null;

        this.btnMic = document.getElementById('btn-voice-mic');
        this.statusText = document.getElementById('voice-status-text');
        this.visualizer = document.getElementById('audio-visualizer');
        this.transcriptBox = document.getElementById('voice-transcript');

        this.init();
    }

    init() {
        if (!this.btnMic) return;

        // Initialize Speech Recognition if supported by browser
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            this.recognition = new SpeechRec();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.btnMic.classList.add('listening');
                this.btnMic.innerHTML = `<span class="mic-icon">🔴</span> Listening...`;
                if (this.visualizer) this.visualizer.classList.remove('hidden');
                if (this.statusText) this.statusText.textContent = "Listening for command or inquiry...";
            };

            this.recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                this.handleVoiceQuery(transcript);
            };

            this.recognition.onerror = (e) => {
                console.warn("Speech recognition error or mic denied:", e.error);
                this.stopListening();
                // Fallback demo simulation for offline/no-mic testing
                this.simulateVoiceQueryDemo();
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        }

        this.btnMic.addEventListener('click', () => {
            if (this.isListening) {
                if (this.recognition) this.recognition.stop();
                this.stopListening();
            } else {
                if (this.recognition) {
                    try {
                        this.recognition.start();
                    } catch (err) {
                        this.simulateVoiceQueryDemo();
                    }
                } else {
                    // Browser without Web Speech API -> trigger realistic demo simulated voice command
                    this.simulateVoiceQueryDemo();
                }
            }
        });
    }

    stopListening() {
        this.isListening = false;
        if (this.btnMic) {
            this.btnMic.classList.remove('listening');
            this.btnMic.innerHTML = `<span class="mic-icon">🎙️</span> Ask Shield-AI`;
        }
        if (this.visualizer) this.visualizer.classList.add('hidden');
        if (this.statusText) this.statusText.textContent = "Click mic & talk (or auto-simulates command if mic unavailable)";
    }

    /**
     * Fallback for presentation demonstrations when microphone input is silenced
     */
    simulateVoiceQueryDemo() {
        if (this.visualizer) this.visualizer.classList.remove('hidden');
        if (this.statusText) this.statusText.textContent = "Analyzing simulated executive voice inquiry...";

        setTimeout(() => {
            const demoQueries = [
                "What is the current stampede risk at Gate 2?",
                "Open emergency exit Gate 4 immediately",
                "What is our safe evacuation route recommendation?",
                "Deploy Rapid Action force to central bottleneck"
            ];
            const q = demoQueries[Math.floor(Math.random() * demoQueries.length)];
            this.handleVoiceQuery(q);
            if (this.visualizer) this.visualizer.classList.add('hidden');
        }, 1500);
    }

    handleVoiceQuery(queryText) {
        if (this.transcriptBox) {
            this.transcriptBox.innerHTML = `<strong>You asked:</strong> "${queryText}"`;
        }

        const t = this.getTelemetry();
        const qLower = queryText.toLowerCase();
        let responseText = "Understood. Maintaining surveillance across all sectors.";

        if (qLower.includes('risk') || qLower.includes('status') || qLower.includes('gate') || qLower.includes('density')) {
            responseText = `Current peak density is ${t.peakDensity || 1.4} people per square meter. Stampede probability is calculated at ${t.stampedeLikelihood || 12}%. ${t.statusLevel === 'danger' ? 'Critical bottleneck at Gate 2! Countermeasures strongly advised.' : 'Venue fluidity remains nominal.'}`;
        } 
        else if (qLower.includes('open') || qLower.includes('exit') || qLower.includes('evacuate') || qLower.includes('gate 4')) {
            responseText = "Acknowledged. Opening emergency exit Gate 4 and rerouting pedestrian flow immediately.";
            this.onExecuteCommand('open_emergency_exit');
        } 
        else if (qLower.includes('deploy') || qLower.includes('police') || qLower.includes('force') || qLower.includes('security')) {
            responseText = "Dispatching Rapid Action Security Force detail to central concourse corridor.";
            this.onExecuteCommand('deploy_security');
        } 
        else if (qLower.includes('route') || qLower.includes('safe') || qLower.includes('direction')) {
            responseText = "The safest evacuation direction is via Gate 5 and Gate 4 Green Route corridors.";
        }

        // Print response
        setTimeout(() => {
            if (this.transcriptBox) {
                this.transcriptBox.innerHTML = `
                    <div style="margin-bottom:4px; color:#cbd5e1;"><strong>👤 Query:</strong> "${queryText}"</div>
                    <div style="color:#34d399;"><strong>🛡️ Shield-AI:</strong> ${responseText}</div>
                `;
            }
            this.speak(responseText);
        }, 600);
    }

    speak(text, lang = 'en-US') {
        if (!this.synth) return;
        try {
            this.synth.cancel(); // stop any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 1.05;
            utterance.pitch = 0.95;
            this.synth.speak(utterance);
        } catch (e) {
            console.warn("Speech synthesis error:", e);
        }
    }
}
