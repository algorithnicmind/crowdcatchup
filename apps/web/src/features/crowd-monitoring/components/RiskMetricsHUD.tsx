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
    <div className="w-full glass-panel rounded-xl p-4 flex flex-col gap-4 border border-slate-700/80">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
            Live Crowd Telemetry HUD
          </h2>
        </div>

        {/* Risk Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-widest uppercase flex items-center gap-1.5 ${
            isCritical
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500 glow-critical'
              : isElevated
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500 glow-warning'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 glow-normal'
          }`}
        >
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          ) : isElevated ? (
            <ShieldAlert className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          {telemetry.riskLevel} RISK
        </div>
      </div>

      {/* Grid of Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Crowd Count */}
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> CROWD COUNT
          </span>
          <span className="text-2xl font-bold text-slate-100 font-mono mt-1">
            {telemetry.totalCrowdCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Particles Tracked</span>
        </div>

        {/* Average Movement Speed */}
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" /> FLOW VELOCITY
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 ${
              telemetry.avgVelocity < 0.5 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {telemetry.avgVelocity} <span className="text-xs font-normal">m/s</span>
          </span>
          <span className="text-[10px] text-slate-500 mt-1">
            {telemetry.avgVelocity < 0.5 ? '⚠️ Movement Stall' : 'Optimal Speed'}
          </span>
        </div>

        {/* Risk Score Index */}
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> RISK SCORE
          </span>
          <span className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            {riskAssessment.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </span>
          <span className="text-[10px] text-slate-500 mt-1">AI XGBoost Engine</span>
        </div>

        {/* Security & RAF Personnel */}
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> SECURITY FORCES
          </span>
          <span className="text-2xl font-bold text-slate-100 font-mono mt-1">
            {totalSecurity} <span className="text-xs font-normal text-slate-400">Units</span>
          </span>
          <span className="text-[10px] text-slate-500 mt-1">
            +{rafPersonnelAdded} RAF Deployed
          </span>
        </div>
      </div>

      {/* Summary Advisory Banner */}
      <div
        className={`p-3 rounded-lg text-xs font-medium border flex items-center gap-2 ${
          isCritical
            ? 'bg-rose-950/40 border-rose-700 text-rose-300'
            : isElevated
            ? 'bg-amber-950/40 border-amber-700 text-amber-300'
            : 'bg-slate-800/50 border-slate-700 text-slate-300'
        }`}
      >
        <span className="font-bold font-mono uppercase">AI Advisory:</span>
        <span>{riskAssessment.summaryText}</span>
      </div>
    </div>
  );
};
