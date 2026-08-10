'use client';

import React from 'react';
import { useCrowdStore } from '../../../stores/crowd-store';
import { CheckCircle2, ShieldAlert, DoorOpen, ShieldPlus, ArrowRightLeft } from 'lucide-react';

export const CountermeasuresPanel: React.FC = () => {
  const { interventions, executeIntervention, gates, toggleGate } = useCrowdStore();

  return (
    <div className="w-full glass-panel rounded-xl p-4 flex flex-col gap-4 border border-slate-700/80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
            Intelligent Countermeasure Queue
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">1-Click Execution</span>
      </div>

      {/* AI Recommendation Cards */}
      <div className="flex flex-col gap-3">
        {interventions.map((int) => {
          const isExecuted = int.executed;

          return (
            <div
              key={int.id}
              className={`p-3 rounded-lg border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                isExecuted
                  ? 'bg-slate-900/60 border-slate-800 opacity-75'
                  : 'bg-slate-800/80 border-slate-700 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    int.type === 'gate_open'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : int.type === 'deploy_raf'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-amber-500/20 text-amber-400'
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
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> EXECUTED
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5">{int.description}</span>
                </div>
              </div>

              {/* Execution Button */}
              <button
                disabled={isExecuted}
                onClick={() => executeIntervention(int.id)}
                className={`w-full md:w-auto px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isExecuted
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95'
                }`}
              >
                {isExecuted ? 'ACTION ACTIVE' : 'EXECUTE NOW'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual Gate Control Controls */}
      <div className="pt-2 border-t border-slate-700/60">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
          Manual Gate Override Switches
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {gates.map((g) => (
            <button
              key={g.id}
              onClick={() => toggleGate(g.id)}
              className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                g.isOpen
                  ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-rose-950/40 border-rose-700 text-rose-300 hover:bg-rose-900/50'
              }`}
            >
              <span className="truncate">{g.name || g.id.toUpperCase()}</span>
              <span className="font-extrabold ml-1">{g.isOpen ? 'OPEN' : 'LOCKED'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
