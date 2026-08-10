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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Navigation Header */}
      <Header />

      {/* Main Command Center Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left / Central Column */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Telemetry Dials HUD */}
          <RiskMetricsHUD />

          {/* Canvas Digital Twin Simulation Engine */}
          <div className="w-full glass-panel rounded-2xl p-3 border border-slate-800">
            <DigitalTwinCanvas />
          </div>

          {/* Intelligent Countermeasures & Gate Overrides */}
          <CountermeasuresPanel />
        </section>

        {/* Right Column: Embedded Citizen Companion Smartphone Emulator */}
        <section className="lg:col-span-4 flex flex-col items-center justify-start sticky top-24">
          <div className="w-full text-center mb-3">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              📱 CITIZEN COMPANION SMARTPHONE
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
