'use client';

import React from 'react';
import { Header } from '../shared/components/layout/Header';
import { RiskMetricsHUD } from '../features/crowd-monitoring/components/RiskMetricsHUD';
import { DigitalTwinCanvas } from '../features/map/components/DigitalTwinCanvas';
import { CountermeasuresPanel } from '../features/recommendations/components/CountermeasuresPanel';
import { CitizenAppEmulator } from '../features/citizen/components/CitizenAppEmulator';
import { VoiceCopilot } from '../features/crowd-monitoring/components/VoiceCopilot';
import { SitrepModal } from '../features/crowd-monitoring/components/SitrepModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Command Center Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Central Column: Telemetry, Canvas Digital Twin, Countermeasures */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Telemetry Dials HUD */}
          <RiskMetricsHUD />

          {/* Canvas Digital Twin Simulation Engine */}
          <div className="w-full glass-panel rounded-xl p-2 border border-slate-700/80">
            <DigitalTwinCanvas />
          </div>

          {/* Intelligent Countermeasures & Gate Overrides */}
          <CountermeasuresPanel />
        </section>

        {/* Right Column: Embedded Citizen Companion Smartphone Emulator */}
        <section className="lg:col-span-4 flex flex-col items-center justify-start sticky top-20">
          <div className="w-full text-center mb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              📱 CITIZEN COMPANION SMARTPHONE EMULATOR
            </span>
          </div>
          <CitizenAppEmulator />
        </section>
      </main>

      {/* Floating Modals & Assistants */}
      <VoiceCopilot />
      <SitrepModal />
    </div>
  );
}
