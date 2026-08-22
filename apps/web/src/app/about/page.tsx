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

        <div className="max-w-3xl mx-auto space-y-12 mt-12 text-zinc-300 text-lg leading-relaxed font-light">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">The Problem</h2>
            <p>
              During large-scale events and mass gatherings, the individual is often the most vulnerable. Traditional event management relies heavily on static maps, delayed radio communication, and reactive emergency services. 
            </p>
            <p>
              When a crowd crush or sudden bottleneck occurs, these outdated systems fail to identify the escalating risk in real-time, leaving citizens trapped and authorities scrambling to respond without accurate situational awareness.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">The Solution</h2>
            <p>
              CrowdShield bridges this critical gap by acting as a state-of-the-art, multi-source early warning system. By actively monitoring venues using computer vision (YOLOv8) and predicting anomalies with machine learning (XGBoost), we detect potential risks before they turn into disasters.
            </p>
            <p>
              The system unifies all stakeholders into a single, real-time 3D command center, ensuring that police, event organizers, and emergency dispatchers have an identical, instantaneous view of the ground reality.
            </p>
          </div>

          <div className="space-y-4 border-t border-zinc-800/50 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Built for Citizens</h2>
            <p>
              At the heart of CrowdShield is the safety of the individual. We empower attendees with dynamic safe routing, live crowd density updates on their mobile devices, and an instant emergency SOS network.
            </p>
            <p>
              With CrowdShield, you aren't just a face in the crowd. You have a direct lifeline to safety and the intelligence you need to navigate massive gatherings securely.
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
