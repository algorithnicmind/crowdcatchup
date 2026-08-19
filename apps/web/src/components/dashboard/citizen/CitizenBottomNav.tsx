'use client';

import React, { useState } from 'react';
import { Home, Bell, User, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export function CitizenBottomNav() {
  const [active, setActive] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full z-[1000] px-4 pb-4 pt-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none md:hidden">
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative p-3 flex-1 flex flex-col items-center justify-center gap-1"
            >
              <item.icon 
                className={`w-6 h-6 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} 
              />
              <span className={`text-[10px] font-semibold tracking-wider transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
