"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      
      {/* Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="p-8 bg-white/[0.02] border border-red-500/20 shadow-2xl backdrop-blur-xl rounded-3xl flex flex-col items-center text-center">
          
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-3xl font-semibold text-white mb-3">
            Access Denied
          </h1>
          
          <p className="text-zinc-400 font-light mb-8 leading-relaxed">
            Your current account credentials do not have the required authorization clearance to access this command portal. 
          </p>

          <div className="flex flex-col w-full gap-3">
            <Link 
              href="/" 
              className="group flex items-center justify-center w-full py-3 px-4 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return to Gateway
            </Link>

            <button 
              onClick={() => signOut({ redirectUrl: '/' })}
              className="flex items-center justify-center w-full py-3 px-4 bg-transparent border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out & Switch Account
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
