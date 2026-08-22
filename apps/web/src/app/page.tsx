"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Users, CalendarCheck, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/ui/3d-hero-section-boxes";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const portals = [
  {
    id: "authority",
    title: "Authority Command",
    description: "City officials, emergency dispatchers, and high-level command operations.",
    icon: ShieldAlert,
    href: "/login?role=AUTHORITY",
    gradient: "from-cyan-500/20 to-emerald-500/0",
    borderHover: "hover:border-cyan-500/50",
    iconColor: "text-cyan-400",
  },
  {
    id: "police",
    title: "Police Tactical",
    description: "On-ground officers, tactical units, and crowd control response.",
    icon: Shield,
    href: "/login?role=POLICE",
    gradient: "from-blue-600/20 to-indigo-600/0",
    borderHover: "hover:border-blue-500/50",
    iconColor: "text-blue-500",
  },
  {
    id: "citizen",
    title: "Citizen Access",
    description: "Live crowd density, safe routing, and emergency public alerts.",
    icon: Users,
    href: "/login?role=CITIZEN",
    gradient: "from-emerald-400/20 to-teal-500/0",
    borderHover: "hover:border-emerald-500/50",
    iconColor: "text-emerald-400",
  },
  {
    id: "owner",
    title: "Event Owner",
    description: "Venue managers, event organizers, and private security coordination.",
    icon: CalendarCheck,
    href: "/login?role=OWNER",
    gradient: "from-purple-500/20 to-fuchsia-500/0",
    borderHover: "hover:border-purple-500/50",
    iconColor: "text-purple-400",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function Home() {
  return (
    <div className="flex flex-col bg-[#050505]">
      <HeroSection />

      <div id="portals" className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Minimalistic Grid Background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
        
        {/* Subtle Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl w-full space-y-16 relative z-10"
        >
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-2xl backdrop-blur-xl mb-2"
            >
              <ShieldAlert className="w-8 h-8 text-white" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white">
              Command<span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Infrastructure</span>
            </h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light tracking-wide">
              Select your secure portal to access the command infrastructure.
            </p>
          </div>

          <HoverEffect items={portals.map(p => ({ title: p.title, description: p.description, link: p.href }))} />
        </motion.div>
      </div>
    </div>
  );
}


