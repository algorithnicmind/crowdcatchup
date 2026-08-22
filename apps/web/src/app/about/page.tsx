"use client";

import React from "react";
import { Navbar } from "@/components/ui/3d-hero-section-boxes";
import { ShieldAlert, Shield, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-2xl backdrop-blur-xl mb-4">
            <ShieldAlert className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white">
            About <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">CrowdShield</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            A state-of-the-art Multi-Source Early Warning System designed exclusively for the safety and security of citizens.
          </p>
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

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center space-y-8 flex flex-col items-center">
          <h3 className="text-3xl font-semibold text-white">Ready to join the network?</h3>
          <Link href="/#portals" className="bg-white text-black font-semibold py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2">
            Access Citizen Portal <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-24 pt-8 border-t border-zinc-800/50 text-center space-y-2">
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
