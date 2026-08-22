"use client";

import React from "react";
import { Navbar } from "@/components/ui/3d-hero-section-boxes";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
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
                <p className="text-zinc-500">support@crowdshield.ai</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <Phone className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Call Us</h3>
                <p className="text-zinc-500">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Headquarters</h3>
                <p className="text-zinc-500">123 Security Blvd, Innovation City</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <form className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-2xl font-semibold text-white mb-6">Send a Message</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>
            </div>
            
            <button className="w-full bg-white text-black font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-colors">
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
