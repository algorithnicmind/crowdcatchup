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

        <div className="max-w-3xl mx-auto space-y-8 mt-12 text-zinc-300 text-lg leading-relaxed font-light">
          <p>
            CrowdShield is a state-of-the-art Multi-Source Early Warning System designed exclusively for the safety and security of citizens during large-scale events and mass gatherings.
          </p>
          <p>
            During massive gatherings, the individual is often the most vulnerable. We recognized that static maps and traditional event management tools fail to account for temporary crowd crushes and sudden bottlenecks. CrowdShield bridges this gap by actively monitoring venues in real-time.
          </p>
          <p>
            By utilizing advanced AI algorithms like XGBoost for risk-scoring and YOLOv8 for crowd density tracking, CrowdShield empowers individuals with dynamic safe routing, instant emergency SOS alerts, and a direct line to authorities to prevent crowd crushes before they ever happen.
          </p>
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
