"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Users, CalendarCheck, ArrowRight } from "lucide-react";

const portals = [
  {
    id: "authority",
    title: "Authority Command",
    description: "City officials, emergency dispatchers, and high-level command operations.",
    icon: ShieldAlert,
    href: "/login/authority",
    gradient: "from-cyan-500/20 to-emerald-500/0",
    borderHover: "hover:border-cyan-500/50",
    iconColor: "text-cyan-400",
  },
  {
    id: "police",
    title: "Police Tactical",
    description: "On-ground officers, tactical units, and crowd control response.",
    icon: Shield,
    href: "/login/police",
    gradient: "from-blue-600/20 to-indigo-600/0",
    borderHover: "hover:border-blue-500/50",
    iconColor: "text-blue-500",
  },
  {
    id: "citizen",
    title: "Citizen Access",
    description: "Live crowd density, safe routing, and emergency public alerts.",
    icon: Users,
    href: "/login/citizen",
    gradient: "from-emerald-400/20 to-teal-500/0",
    borderHover: "hover:border-emerald-500/50",
    iconColor: "text-emerald-400",
  },
  {
    id: "owner",
    title: "Event Owner",
    description: "Venue managers, event organizers, and private security coordination.",
    icon: CalendarCheck,
    href: "/login/owner",
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
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      
      {/* Minimalistic Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      
      {/* Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full space-y-16 relative z-10"
      >
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-2xl backdrop-blur-xl mb-2"
          >
            <ShieldAlert className="w-8 h-8 text-white" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white">
            Crowd<span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Shield</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light tracking-wide">
            Select your secure portal to access the command infrastructure.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
        >
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div key={portal.id} variants={itemVariants} className="h-full">
                <Link 
                  href={portal.href} 
                  className={`group relative block h-full w-full outline-none rounded-3xl p-8 bg-white/[0.02] border border-white/[0.05] transition-all duration-500 ease-out hover:bg-white/[0.04] ${portal.borderHover} hover:shadow-2xl overflow-hidden`}
                >
                  {/* Hover Gradient Effect inside the card */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none`} />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="space-y-5">
                      <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:scale-110 group-hover:bg-white/[0.06] transition-all duration-500 ease-out">
                        <Icon className={`w-6 h-6 ${portal.iconColor}`} strokeWidth={1.5} />
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-2xl font-medium text-zinc-200 group-hover:text-white transition-colors duration-300">
                          {portal.title}
                        </h2>
                        <p className="text-zinc-500 text-sm leading-relaxed font-light group-hover:text-zinc-400 transition-colors duration-300">
                          {portal.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center text-sm font-medium text-zinc-500 group-hover:text-white transition-colors duration-300">
                      Access Portal 
                      <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
