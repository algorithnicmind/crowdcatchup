"use client";

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

function HeroSplineBackground() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      pointerEvents: 'auto',
      overflow: 'hidden',
    }}>
      <Script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.7/build/spline-viewer.js" strategy="lazyOnload" />
      <style dangerouslySetInnerHTML={{ __html: `
        spline-viewer::part(logo) {
          display: none !important;
        }
      `}} />
      {/* @ts-ignore - custom web component */}
      <spline-viewer 
        url="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode" 
        style={{ width: '100%', height: '100vh' }}
      ></spline-viewer>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}


import { AvatarGroup } from './avatar-group';

function HeroContent() {
  const teamAvatars = [
    { src: '/team-ankit.jpg', alt: 'Ankit', label: 'Ankit' },
    { src: '/team-pragyan.jpg', alt: 'Pragyan', label: 'Pragyan' },
    { src: '/team-basudev.jpg', alt: 'Basudev', label: 'Basudev' },
  ];

  return (
    <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-16">

      <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-wide">
          CrowdShield<br />Command Center
        </h1>
        <div className="text-sm text-gray-300 opacity-90 mt-4">
          AI \ EVENT MANAGEMENT \ 3D \ REAL-TIME
        </div>
      </div>

      <div className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start">
         <p className="text-base sm:text-lg opacity-80 mb-6 max-w-md">
           Advanced Multi-Source Early Warning System. Monitor crowd density, detect anomalies, and secure your venues in real-time.
        </p>
        <div className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
            <Link href="/login?role=CITIZEN" className="relative group overflow-hidden rounded-2xl p-[2px] w-full sm:w-auto">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              <div className="relative bg-[#050505] text-white font-semibold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-2xl transition-all duration-300 group-hover:bg-transparent flex items-center justify-center gap-2">
                Citizen Login
              </div>
            </Link>

            <Link href="/register" className="bg-white text-black font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition duration-300 hover:scale-105 flex items-center justify-center w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
               Sign Up Free
            </Link>
        </div>
        
        <div className="flex items-center space-x-4 pointer-events-auto mt-4">
          <div className="text-sm text-gray-400 font-medium">Built by</div>
          <AvatarGroup avatars={teamAvatars} size={40} overlap={12} />
        </div>
      </div>

    </div>
  );
}

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20" style={{ backgroundColor: 'rgba(13, 13, 24, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '0 0 0.75rem 0.75rem' }}>
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="text-white flex items-center space-x-2 group">
            <ShieldAlert className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-lg tracking-wide hidden sm:block">CrowdShield</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white text-sm transition duration-150">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-white text-sm transition duration-150">About</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login?role=CITIZEN" className="text-gray-300 hover:text-white text-sm font-medium transition duration-300 hidden sm:block">
              Sign In
          </Link>
          <Link href="/register" className="border border-white text-white px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition duration-300">
              Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

const HeroSection = () => {
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
          const maxScroll = 400;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
          if (heroContentRef.current) {
             heroContentRef.current.style.opacity = opacity.toString();
          }
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <Navbar />

      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>

        <div ref={heroContentRef} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, pointerEvents: 'none'
        }}>
          <HeroContent />
        </div>
      </div>
    </div>
  );
};

export { HeroSection }
