"use client";

import React from "react";
import { Navbar } from "@/components/ui/3d-hero-section-boxes";
import { ShieldAlert, Shield, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center px-4 max-w-5xl mx-auto w-full pt-20">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            About <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">CrowdShield</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 space-y-6 hover:bg-white/[0.03] transition-colors">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Citizen First</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              During large-scale events and mass gatherings, the individual is often the most vulnerable. CrowdShield empowers citizens with real-time crowd density tracking, dynamic safe routing, and an instant emergency SOS network to prevent crowd crushes before they happen.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 space-y-6 hover:bg-white/[0.03] transition-colors">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI-Powered Security</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              By utilizing advanced XGBoost risk-scoring algorithms and YOLOv8 computer vision integrations, CrowdShield provides a direct line to authorities, guaranteeing that tactical response teams are deployed precisely where they are needed most.
            </p>
          </div>
        </div>

        <div className="text-center space-y-2 mt-auto pb-12">
          <p className="text-zinc-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} CrowdShield Inc. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs">
            Built for the citizens. Protecting communities.
          </p>
        </div>
      </div>
    </div>
  );
}
