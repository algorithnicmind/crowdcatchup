'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/stores/map-store';
import { Navigation, Users, Car, HeartPulse, X, Route, ShieldCheck, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagicCard } from '@/components/ui/magic-card';
import { apiClient } from '@/lib/api-client';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useMap } from '@vis.gl/react-google-maps';

// Helper for demo distance
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI/180;
  const phi2 = lat2 * Math.PI/180;
  const deltaPhi = (lat2-lat1) * Math.PI/180;
  const deltaLambda = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

export function CitizenDirectionsSheet() {
  const map = useMap();
  const { 
    searchResultPin, 
    destinationName, 
    isDirectionsSheetOpen, 
    setIsDirectionsSheetOpen,
    setSearchResultPin,
    citizenLocation,
    setRouteCoordinates
  } = useMapStore();

  const [step, setStep] = useState<'IDLE' | 'CALCULATING' | 'ROUTE_FOUND' | 'CONTEXT_FORM' | 'NAVIGATING'>('IDLE');
  
  // Navigation States
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [navInstruction, setNavInstruction] = useState('Head towards destination');
  
  // Form States
  const [groupSize, setGroupSize] = useState<number | string>(1);
  const [vehicle, setVehicle] = useState('Walking');
  const [hasMobilityNeeds, setHasMobilityNeeds] = useState(false);

  const { subscribe } = useWebSocket('EVT-001');

  // Reset when a new pin is dropped
  useEffect(() => {
    if (searchResultPin && isDirectionsSheetOpen) {
      setStep('IDLE');
      if (citizenLocation) {
        setDistanceRemaining(getDistanceInMeters(citizenLocation.lat, citizenLocation.lng, searchResultPin.lat, searchResultPin.lng));
      }
    }
  }, [searchResultPin, citizenLocation, isDirectionsSheetOpen]);

  // Mock navigation interval for demo
  useEffect(() => {
    let mockInterval: ReturnType<typeof setInterval>;
    if (step === 'NAVIGATING') {
      mockInterval = setInterval(() => {
        setDistanceRemaining(prev => {
          if (prev <= 5) {
            setNavInstruction("You have safely arrived!");
            clearInterval(mockInterval);
            return 0;
          }
          if (prev === Math.floor(distanceRemaining / 2)) setNavInstruction("Turn right ahead");
          if (prev === 100) setNavInstruction("Approaching destination...");
          return prev - 5;
        });
      }, 1000);
    }
    return () => clearInterval(mockInterval);
  }, [step, distanceRemaining]);

  const handleClose = () => {
    setIsDirectionsSheetOpen(false);
    setSearchResultPin(null);
    setRouteCoordinates(null);
    setStep('IDLE');
  };

  const handleFindRoute = async () => {
    setStep('CALCULATING');
    try {
      // Simulate API call for safe routing
      await new Promise(r => setTimeout(r, 800));
      
      if (citizenLocation && searchResultPin) {
        setRouteCoordinates([
          citizenLocation,
          { lat: (citizenLocation.lat + searchResultPin.lat) / 2, lng: (citizenLocation.lng + searchResultPin.lng) / 2 },
          searchResultPin
        ]);
      }
      setStep('ROUTE_FOUND');
    } catch {
      setStep('ROUTE_FOUND');
    }
  };

  const handleStartClicked = () => {
    setStep('CONTEXT_FORM');
  };

  const handleSubmitContext = async () => {
    // Fire to backend with context
    const isDemoMode = true;
    if (!isDemoMode) {
      await apiClient('/navigation/start', { 
        method: 'POST',
        body: JSON.stringify({
          groupSize,
          vehicle,
          hasMobilityNeeds,
          destination: searchResultPin
        })
      }).catch(() => null);
    }
    
    // Smooth Google Maps-like 3D navigation camera
    if (map && citizenLocation) {
      map.panTo(citizenLocation);
      map.setZoom(19);
      map.setHeading(0);
      map.setTilt(60); // Tilt for 3D navigation feel
    }
    
    setStep('NAVIGATING');
    setNavInstruction(`Head towards ${destinationName || 'Destination'}`);
  };

  if (!isDirectionsSheetOpen || !searchResultPin) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-[60] pointer-events-none">
      <AnimatePresence mode="wait">
        {step === 'IDLE' && (
          <motion.div
            key="idle"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="pointer-events-auto"
          >
            <MagicCard className="bg-black/90 backdrop-blur-xl border border-zinc-800 shadow-2xl p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{destinationName || 'Selected Location'}</h3>
                    {distanceRemaining > 0 && (
                      <p className="text-zinc-400 text-sm">{Math.round(distanceRemaining)}m away from you</p>
                    )}
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 -mr-2 -mt-2 text-zinc-500 hover:text-white bg-transparent outline-none cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Button onClick={handleFindRoute} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Route className="w-4 h-4 mr-2" /> Directions
              </Button>
            </MagicCard>
          </motion.div>
        )}

        {step === 'CALCULATING' && (
          <motion.div
            key="calc"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pointer-events-auto"
          >
            <MagicCard className="bg-black/90 backdrop-blur-xl border border-emerald-500/30 shadow-2xl p-6 text-center">
              <span className="w-8 h-8 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto mb-4 block" />
              <h3 className="text-white font-bold">Calculating Safe Route...</h3>
              <p className="text-zinc-400 text-sm mt-1">Analyzing real-time crowd density.</p>
            </MagicCard>
          </motion.div>
        )}

        {step === 'ROUTE_FOUND' && (
          <motion.div
            key="route_found"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pointer-events-auto"
          >
            <MagicCard className="bg-black/90 backdrop-blur-xl border border-emerald-500/50 shadow-2xl overflow-hidden" gradientColor="rgba(16, 185, 129, 0.15)">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-white font-bold text-lg">Safe Route Found</h2>
                  </div>
                  <div className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {Math.ceil(distanceRemaining / 80)} MIN
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg flex gap-2 items-start mb-4">
                  <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-200">
                    Avoiding congested areas based on live crowd data.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleStartClicked} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 font-semibold">
                    START
                  </Button>
                  <Button variant="outline" onClick={handleClose} className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                </div>
              </div>
            </MagicCard>
          </motion.div>
        )}

        {step === 'CONTEXT_FORM' && (
          <motion.div
            key="context"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pointer-events-auto"
          >
            <MagicCard className="bg-black/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl p-5">
              <h3 className="text-white font-bold text-lg mb-1">Trip Details</h3>
              <p className="text-zinc-400 text-xs mb-4">Help us personalize your safe route.</p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">How many people?</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, '5+'].map(num => (
                      <button 
                        key={num}
                        onClick={() => setGroupSize(num)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${groupSize === num ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Walking', 'Bike', 'Car'].map(v => (
                      <button 
                        key={v}
                        onClick={() => setVehicle(v)}
                        className={`py-2 rounded-lg text-sm font-semibold border flex flex-col items-center gap-1 ${vehicle === v ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer'}`}
                      >
                        {v === 'Walking' ? <Users className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                 <Button onClick={handleSubmitContext} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 h-12 text-lg">
                   BEGIN
                 </Button>
                 <Button variant="outline" onClick={handleClose} className="bg-transparent border-white/20 text-white hover:bg-white/10 h-12">
                    Cancel
                 </Button>
              </div>
            </MagicCard>
          </motion.div>
        )}

        {step === 'NAVIGATING' && (
          <motion.div
            key="nav"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="pointer-events-auto"
          >
            <MagicCard className="bg-black/95 backdrop-blur-xl border border-blue-500/50 shadow-2xl overflow-hidden" gradientColor="rgba(59, 130, 246, 0.15)">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Navigating</span>
                    <span className="text-white text-3xl font-black">{distanceRemaining}m</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleClose} className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                    END
                  </Button>
                </div>

                <div className="flex items-center gap-4 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="bg-blue-500/20 p-2 rounded-full flex shrink-0">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-white text-lg font-medium leading-tight">
                    {navInstruction}
                  </p>
                </div>
              </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
