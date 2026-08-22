"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Users, CalendarCheck, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/ui/3d-hero-section-boxes";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const portals = [
  {
    id: "citizen",
    title: "Citizen Access",
    description: "Live crowd density, safe routing, and emergency public alerts.",
    icon: Users,
    actions: [
      { label: "Login", href: "/login?role=CITIZEN" },
      { label: "Sign Up", href: "/register" }
    ],
    gradient: "from-emerald-400/20 to-teal-500/0",
    borderHover: "hover:border-emerald-500/50",
    iconColor: "text-emerald-400",
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

          <HoverEffect items={portals.map(p => ({ title: p.title, description: p.description, link: p.id, actions: p.actions }))} />
        </motion.div>
      </div>

      <ContactSection />
    </div>
  );
}

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { sendContactEmail } from "@/app/actions/contact";

function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await sendContactEmail(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    
    setIsSubmitting(false);
  }

  return (
    <div id="about" className="bg-[#050505] text-slate-200 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-900/10 pointer-events-none" />
      <div className="px-4 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 relative z-10">
        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Get in Touch</h1>
            <p className="text-zinc-400 text-lg">
              Have questions about CrowdShield? Reach out to our team for support, enterprise inquiries, or general information.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Email Us</h3>
                <p className="text-zinc-500">basudevmuna111@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <Phone className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Call Us</h3>
                <p className="text-zinc-500">+91-8093360300</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Headquarters</h3>
                <p className="text-zinc-500">Cuttack, Odisha, India</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <form className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-white mb-6">Send a Message</h2>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                <textarea 
                  rows={4}
                  name="message"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Your message"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-black font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


