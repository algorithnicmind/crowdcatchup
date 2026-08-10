'use client';

import React from 'react';
import { useCrowdStore } from '../../../stores/crowd-store';
import { ShieldAlert, Users, Gauge, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskMetricsHUD: React.FC = () => {
  const { telemetry, riskAssessment, rafPersonnelAdded, venue } = useCrowdStore();

  const isCritical = telemetry.riskLevel === 'CRITICAL';
  const isElevated = telemetry.riskLevel === 'ELEVATED';

  const totalSecurity =
    venue.securityOutposts.reduce((acc, sp) => acc + sp.personnel, 0) + rafPersonnelAdded;

  return (
    <div className="w-full bg-neutral-950 rounded-2xl p-4 md:p-5 flex flex-col gap-4 border border-neutral-800 shadow-2xl">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-xs font-bold tracking-widest text-neutral-300 uppercase font-mono">
            LIVE TELEMETRY COMMAND HUD
          </h2>
        </div>

        {/* Dynamic Risk Badge */}
        <div
          className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-widest uppercase flex items-center gap-2 transition-all ${
            isCritical
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/50 glow-rose'
              : isElevated
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/50 glow-amber'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 glow-emerald'
          }`}
        >
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          ) : isElevated ? (
            <ShieldAlert className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          {telemetry.riskLevel} STATUS
        </div>
      </div>

      {/* Grid of Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Crowd Count */}
        <div className="bg-neutral-900 glass-card-hover rounded-xl p-3.5 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 font-semibold">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> CROWD COUNT
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400/60" />
          </div>
          <span className="text-2xl font-black text-white font-mono tracking-tight mt-2">
            {telemetry.totalCrowdCount.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-neutral-500 mt-1">Particles Tracked</span>
        </div>

        {/* Flow Velocity */}
        <div className="bg-neutral-900 glass-card-hover rounded-xl p-3.5 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 font-semibold">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" /> FLOW SPEED
            </span>
            <span className={`w-2 h-2 rounded-full ${telemetry.avgVelocity < 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </div>
          <span
            className={`text-2xl font-black font-mono tracking-tight mt-2 ${
              telemetry.avgVelocity < 0.5 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {telemetry.avgVelocity} <span className="text-xs font-medium text-neutral-400">m/s</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-500 mt-1">
            {telemetry.avgVelocity < 0.5 ? '⚠️ Movement Stall' : 'Optimal Speed'}
          </span>
        </div>

        {/* AI Risk Score */}
        <div className="bg-neutral-900 glass-card-hover rounded-xl p-3.5 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> AI RISK SCORE
            </span>
            <span className="text-[10px] font-mono text-cyan-400">XGBoost</span>
          </div>
          <span className="text-2xl font-black text-cyan-400 font-mono tracking-tight mt-2">
            {riskAssessment.score} <span className="text-xs font-medium text-neutral-500">/ 100</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-500 mt-1">Confidence Index</span>
        </div>

        {/* Security Personnel */}
        <div className="bg-neutral-900 glass-card-hover rounded-xl p-3.5 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> SECURITY UNITS
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
          </div>
          <span className="text-2xl font-black text-white font-mono tracking-tight mt-2">
            {totalSecurity} <span className="text-xs font-medium text-neutral-500">Units</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-500 mt-1">
            +{rafPersonnelAdded} RAF Deployed
          </span>
        </div>
      </div>

      {/* Advisory Banner */}
      <div
        className={`p-3.5 rounded-xl text-xs font-medium border flex items-center gap-2.5 transition-all ${
          isCritical
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            : isElevated
            ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            : 'bg-neutral-900 border-neutral-800 text-neutral-300'
        }`}
      >
        <span className="font-bold font-mono uppercase shrink-0 text-cyan-400">AI Advisory:</span>
        <span className="leading-snug">{riskAssessment.summaryText}</span>
      </div>
    </div>
  );
};
