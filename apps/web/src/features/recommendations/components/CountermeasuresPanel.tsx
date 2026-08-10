'use client';

import React from 'react';
import { useCrowdStore } from '../../../stores/crowd-store';
import { CheckCircle2, ShieldAlert, DoorOpen, ShieldPlus, ArrowRightLeft } from 'lucide-react';

export const CountermeasuresPanel: React.FC = () => {
  const { interventions, executeIntervention, gates, toggleGate } = useCrowdStore();

  return (
    <div className="w-full glass-panel rounded-2xl p-4 md:p-5 flex flex-col gap-4 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono">
            INTELLIGENT COUNTERMEASURE ADVISORY QUEUE
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          1-CLICK EXECUTION
        </span>
      </div>

      {/* AI Recommendation Cards */}
      <div className="flex flex-col gap-3">
        {interventions.map((int) => {
          const isExecuted = int.executed;

          return (
            <div
              key={int.id}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isExecuted
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    int.type === 'gate_open'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : int.type === 'deploy_raf'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {int.type === 'gate_open' ? (
                    <DoorOpen className="w-5 h-5" />
                  ) : int.type === 'deploy_raf' ? (
                    <ShieldPlus className="w-5 h-5" />
                  ) : (
                    <ArrowRightLeft className="w-5 h-5" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-100 font-mono flex items-center gap-2">
                    {int.title}
                    {isExecuted && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> EXECUTED
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 leading-relaxed">{int.description}</span>
                </div>
              </div>

              {/* Execution Button */}
              <button
                disabled={isExecuted}
                onClick={() => executeIntervention(int.id)}
                className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isExecuted
                    ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 glow-cyan active:scale-95'
                }`}
              >
                {isExecuted ? 'ACTION ACTIVE' : 'EXECUTE NOW'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual Override Controls */}
      <div className="pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5 block">
          Manual Gate Override Switches
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {gates.map((g) => (
            <button
              key={g.id}
              onClick={() => toggleGate(g.id)}
              className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                g.isOpen
                  ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-rose-950/30 border-rose-700/50 text-rose-300 hover:bg-rose-900/40'
              }`}
            >
              <span className="truncate">{g.name || g.id.toUpperCase()}</span>
              <span className="font-extrabold ml-1.5 px-2 py-0.5 rounded-md bg-slate-900/60">{g.isOpen ? 'OPEN' : 'LOCKED'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
