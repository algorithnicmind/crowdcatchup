'use client';

import React, { useState } from 'react';
import { useUiStore } from '../../../stores/ui-store';
import { useCrowdStore } from '../../../stores/crowd-store';
import { TRANSLATIONS, LanguageCode } from '../../../shared/lib/translations';
import { Smartphone, Radio, Navigation, AlertOctagon, Globe, CheckCircle, ShieldCheck } from 'lucide-react';

export const CitizenAppEmulator: React.FC = () => {
  const { language, setLanguage, activeMobileTab, setActiveMobileTab } = useUiStore();
  const { addSosIncident } = useCrowdStore();

  const [sosSuccessMessage, setSosSuccessMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'stampede_risk' | 'medical' | 'lost_child'>('stampede_risk');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSendSos = () => {
    // Generate simulated coordinates on canvas map
    const x = Math.floor(Math.random() * 400 + 150);
    const y = Math.floor(Math.random() * 300 + 100);

    addSosIncident({
      category: selectedCategory,
      x,
      y,
      locationName: 'Citizen GPS Location (Near Gate 2)',
      reporterMobile: '+91 9988776655',
    });

    setSosSuccessMessage(t.sosSuccess);
    setTimeout(() => setSosSuccessMessage(null), 4000);
  };

  return (
    <div className="w-full max-w-[360px] mx-auto bg-slate-950 rounded-[40px] p-4 border-[6px] border-slate-800 shadow-2xl relative flex flex-col min-h-[580px]">
      {/* Smartphone Notch & Speaker Bar */}
      <div className="w-32 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
        <div className="w-8 h-1.5 rounded-full bg-slate-800" />
      </div>

      {/* App Header & Language Switcher */}
      <div className="flex items-center justify-between bg-slate-900/90 rounded-2xl p-3 mb-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold font-mono text-slate-100">CROWDSHIELD APP</span>
        </div>

        {/* 4-Language Dropdown Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
          <Globe className="w-3 h-3 text-cyan-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-[11px] font-mono text-slate-200 outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900 text-slate-200">English</option>
            <option value="hi" className="bg-slate-900 text-slate-200">हिंदी (Hindi)</option>
            <option value="mr" className="bg-slate-900 text-slate-200">मराठी (Marathi)</option>
            <option value="ta" className="bg-slate-900 text-slate-200">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>

      {/* Main App Content Viewport */}
      <div className="flex-1 bg-slate-900 rounded-2xl p-3 border border-slate-800/80 flex flex-col justify-between overflow-y-auto">
        {activeMobileTab === 'live' && (
          <div className="flex flex-col gap-3 animate-in fade-in">
            {/* Status Card */}
            <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-xl p-3 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono mb-1">
                <ShieldCheck className="w-4 h-4" /> {t.safeStatusTitle}
              </div>
              <p className="text-xs text-slate-300 leading-snug">{t.safeStatusSub}</p>
            </div>

            {/* BLE Mesh Peer-to-Peer Push Notification */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-left">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold block mb-1 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> BLE MESH BROADCAST (OFFLINE READY)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{t.broadcasts.gateClosed}</p>
            </div>
          </div>
        )}

        {activeMobileTab === 'nav' && (
          <div className="flex flex-col gap-3 animate-in fade-in">
            <div className="bg-cyan-950/40 border border-cyan-700/60 rounded-xl p-3 text-left">
              <span className="text-xs font-bold font-mono text-cyan-400 block mb-1">GREEN ROUTE NAVIGATION</span>
              <p className="text-xs text-slate-300">{t.navGuideText}</p>
            </div>

            {/* Simulated Safe Path Graphic */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center gap-2">
              <div className="w-full h-24 bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 animate-pulse" />
                <Navigation className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Green Safe Exit Route Active</span>
            </div>
          </div>
        )}

        {activeMobileTab === 'sos' && (
          <div className="flex flex-col gap-3 animate-in fade-in">
            <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-3 text-left">
              <span className="text-xs font-bold font-mono text-rose-400 block mb-1">CROWDSOURCED EMERGENCY REPORT</span>
              <p className="text-[11px] text-slate-300">Tap below to instantly alert Command Control Room.</p>
            </div>

            {/* Category Selector */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-mono text-slate-400">SELECT INCIDENT CATEGORY:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 p-2 rounded-lg outline-none"
              >
                <option value="stampede_risk">High Compression / Surge Risk</option>
                <option value="medical">Medical Assistance Required</option>
                <option value="lost_child">Lost Person / Child</option>
              </select>
            </div>

            {/* SOS Dispatch Button */}
            <button
              onClick={handleSendSos}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" /> DISPATCH SOS BEACON
            </button>

            {sosSuccessMessage && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-600 rounded-lg text-emerald-400 text-xs flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{sosSuccessMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Tabs */}
      <div className="flex items-center justify-around bg-slate-900 rounded-2xl p-2 mt-3 border border-slate-800">
        <button
          onClick={() => setActiveMobileTab('live')}
          className={`p-2 rounded-xl text-xs font-mono flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeMobileTab === 'live' ? 'text-cyan-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span className="text-[10px]">ALERTS</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('nav')}
          className={`p-2 rounded-xl text-xs font-mono flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeMobileTab === 'nav' ? 'text-cyan-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span className="text-[10px]">NAV</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('sos')}
          className={`p-2 rounded-xl text-xs font-mono flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeMobileTab === 'sos' ? 'text-rose-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span className="text-[10px]">SOS</span>
        </button>
      </div>
    </div>
  );
};
