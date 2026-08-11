'use client';

import React from 'react';
import { useUiStore } from '../../../stores/ui-store';
import { useCrowdStore } from '../../../stores/crowd-store';
import { Printer, FileText, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SitrepModal: React.FC = () => {
  const { isSitrepModalOpen, setSitrepModalOpen } = useUiStore();
  const { telemetry, riskAssessment, venue, interventions, rafPersonnelAdded } = useCrowdStore();

  if (!isSitrepModalOpen) return null;

  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/60 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 font-mono tracking-wider">
              GENAI EXECUTIVE SITREP DISASTER BRIEFING
            </h2>
          </div>
          <button
            onClick={() => setSitrepModalOpen(false)}
            className="text-slate-400 hover:text-slate-200 cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div id="printable-sitrep" className="p-6 text-slate-200 flex flex-col gap-6 font-sans">
          {/* Header Metadata */}
          <div className="border-b border-slate-700 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-cyan-400 font-mono">
                CROWDSHIELD EMERGENCY SITUATION REPORT
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                District Administration & Disaster Management Authority Briefing
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              <div>TIMESTAMP: {currentDate}</div>
              <div>VENUE: {venue.name}</div>
              <div className="text-emerald-400 font-bold mt-0.5">STATUS: SYSTEM OPERATIONAL</div>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              1. Executive Risk Overview
            </h3>
            <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">ASSESSED RISK LEVEL</span>
                <div className="text-lg font-bold font-mono text-rose-400">{telemetry.riskLevel}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-sans">TOTAL CROWD COUNT</span>
                <div className="text-lg font-bold font-mono text-slate-100">{telemetry.totalCrowdCount}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono">AVG FLOW VELOCITY</span>
                <div className="text-lg font-bold font-mono text-cyan-400">{telemetry.avgVelocity} m/s</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono">RAF DEPLOYED</span>
                <div className="text-lg font-bold font-mono text-emerald-400">+{rafPersonnelAdded} Units</div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Physics Synthesis */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              2. Mathematical Simulation & Bottleneck Synthesis
            </h3>
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700 text-xs leading-relaxed text-slate-300">
              <p className="mb-2">{riskAssessment.summaryText}</p>
              <p>
                Spatial grid telemetry indicates a peak crowd density of{' '}
                <strong className="text-cyan-400">{telemetry.maxDensity} p/m²</strong> across high-traffic access corridors. Fluid dynamics simulation confirms velocity recovery algorithms are active.
              </p>
            </div>
          </div>

          {/* Section 3: Executed Mitigation Interventions */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              3. Countermeasure Actions Log
            </h3>
            <div className="flex flex-col gap-2">
              {interventions.map((int) => (
                <div
                  key={int.id}
                  className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" /> {int.title}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      int.executed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {int.executed ? <CheckCircle2 className="w-3 h-3" /> : null}
                    {int.executed ? 'EXECUTED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff */}
          <div className="border-t border-slate-700 pt-4 flex justify-between text-[10px] font-mono text-slate-500">
            <span>CONFIDENTIAL — DISASTER MANAGEMENT USE ONLY</span>
            <span>POWERED BY CROWDSHIELD AI</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/60 flex items-center justify-between">
          <button
            onClick={() => setSitrepModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            CLOSE
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-lg text-xs font-bold font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" /> PRINT / EXPORT PDF
          </button>
        </div>
      </div>
    </div>
  );
};
