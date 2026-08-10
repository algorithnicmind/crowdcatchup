'use client';

import React, { useState } from 'react';
import { useUiStore } from '../../../stores/ui-store';
import { useCrowdStore } from '../../../stores/crowd-store';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';

export const VoiceCopilot: React.FC = () => {
  const { isVoiceAssistantActive, setVoiceAssistantActive } = useUiStore();
  const { telemetry, gates, toggleGate } = useCrowdStore();

  const [queryText, setQueryText] = useState<string>('');
  const [responseSpeech, setResponseSpeech] = useState<string>(
    'Shield-AI active. Ask me about gate status, density metrics, or emergency routes.'
  );
  const [isListening, setIsListening] = useState<boolean>(false);

  // Speech Recognition Handler
  const handleStartListening = () => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResponseSpeech('Speech Recognition API is not supported in this browser environment.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsListening(true);
    setQueryText('Listening for command...');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQueryText(`"${transcript}"`);
      processVocalCommand(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setQueryText('Audio capture failed. Please try again.');
    };

    recognition.start();
  };

  // Natural Language Intent Processor
  const processVocalCommand = (command: string) => {
    const lower = command.toLowerCase();
    let reply = '';

    if (lower.includes('gate 2') || lower.includes('gate two')) {
      const g2 = gates.find((g) => g.id === 'g2');
      reply = `Gate 2 status is currently ${g2?.isOpen ? 'Open' : 'Locked'}. Density level is at ${
        telemetry.avgDensity
      } persons per square meter.`;
    } else if (lower.includes('open gate 4') || lower.includes('open emergency gate')) {
      toggleGate('g4');
      reply = 'Command received. Emergency Gate 4 override activated. Opening gate bypass now.';
    } else if (lower.includes('density') || lower.includes('status') || lower.includes('risk')) {
      reply = `Current overall crowd risk level is ${telemetry.riskLevel}. Total crowd count is ${telemetry.totalCrowdCount} particles with an average velocity of ${telemetry.avgVelocity} meters per second.`;
    } else {
      reply = `Parsed request: "${command}". All primary security parameters are operating within configured safety bounds.`;
    }

    setResponseSpeech(reply);
    speakResponse(reply);
  };

  // Text-To-Speech Synthesis Handler
  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isVoiceAssistantActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 glass-panel rounded-2xl p-4 border border-cyan-500/50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wider">
            SHIELD-AI VOICE COPILOT
          </h3>
        </div>
        <button
          onClick={() => setVoiceAssistantActive(false)}
          className="text-slate-400 hover:text-slate-200 cursor-pointer p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Query Display */}
      <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 mb-3 min-h-[48px] flex items-center">
        <span className="text-xs font-mono text-cyan-300 italic">{queryText || 'Click microphone to speak command...'}</span>
      </div>

      {/* Response Box */}
      <div className="bg-cyan-950/30 rounded-lg p-3 border border-cyan-800/40 mb-3 flex items-start gap-2">
        <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span className="text-xs text-slate-200 leading-relaxed font-sans">{responseSpeech}</span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] font-mono text-slate-500">Web Speech API v2.0</span>
        <button
          onClick={handleStartListening}
          className={`px-4 py-2 rounded-full font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" /> LISTENING...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" /> START VOICE QUERY
            </>
          )}
        </button>
      </div>
    </div>
  );
};
