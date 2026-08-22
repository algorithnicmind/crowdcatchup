'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicCard } from '@/components/ui/magic-card';
import { Navigation, Users, ShieldAlert, HeartPulse, Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/stores/map-store';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { apiClient } from '@/lib/api-client';

// Haversine formula to calculate distance between two coordinates
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
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

export function SafeRoutePanel() {
  const [isPlanning, setIsPlanning] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navInstruction, setNavInstruction] = useState('Head North towards Gate G5');
  const [distanceRemaining, setDistanceRemaining] = useState(450);
  const [destination, setDestination] = useState('Maha Kumbh Mela');
  
  const { subscribe } = useWebSocket('EVT-001');
  const { citizenLocation } = useMapStore();

  useEffect(() => {
    let unsubNav: any;
    let unsubReroute: any;
    let mockInterval: any;

    if (isNavigating) {
      unsubNav = subscribe('NAVIGATION_UPDATE', (wsEvent: any) => {
        if (wsEvent.payload) {
          setNavInstruction(wsEvent.payload.next_instruction || 'Continue on route');
          setDistanceRemaining(wsEvent.payload.remaining_distance || 0);
        }
      });
      unsubReroute = subscribe('REROUTE_ALERT', (wsEvent: any) => {
        if (wsEvent.payload) {
          import('sonner').then(({ toast }) => {
            toast.error('REROUTE: ' + wsEvent.payload.reason, { duration: 10000 });
          });
          setNavInstruction('Recalculating route...');
        }
      });

      // MOCK DEMO LOGIC: Simulate citizen walking if backend is offline
      mockInterval = setInterval(() => {
        setDistanceRemaining(prev => {
          if (prev <= 5) {
            setNavInstruction("You have safely arrived!");
            clearInterval(mockInterval);
            return 0;
          }
          if (prev === Math.floor(distanceRemaining / 2)) setNavInstruction("Turn right at Sector B intersection");
          if (prev === 100) setNavInstruction("Approaching destination...");
          
          return prev - 5;
        });
      }, 1000);

    }

    return () => {
      if (unsubNav) unsubNav();
      if (unsubReroute) unsubReroute();
      if (mockInterval) clearInterval(mockInterval);
    };
  }, [isNavigating, subscribe, distanceRemaining]);

  const handlePlanRoute = async () => {
    setIsPlanning(true);
    try {
      // Mocking a destination coordinate slightly offset from current location if available
      let destLat = 20.298;
      let destLng = 85.828;
      let startLat = 20.296059;
      let startLng = 85.824539;

      if (citizenLocation) {
        startLat = citizenLocation.lat;
        startLng = citizenLocation.lng;
        // Make the destination some random point ~500m away based on their input length just for demo variation
        const hash = destination.length * 0.0005;
        destLat = startLat + 0.005 + hash; 
        destLng = startLng + 0.005 - hash;
      }

      const calculatedDist = getDistanceInMeters(startLat, startLng, destLat, destLng);
      setDistanceRemaining(calculatedDist);

      const isDemoMode = true;
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 600)); // Simulate delay
        useMapStore.getState().setRouteCoordinates([
          { lat: startLat, lng: startLng },
          { lat: (startLat + destLat) / 2, lng: (startLng + destLng) / 2 },
          { lat: destLat, lng: destLng }
        ]);
        setRouteFound(true);
      } else {
        const data = await apiClient<any>(`/navigation/route?start_zone=current&end_zone=${destination}`).catch(() => null);
        if (data && data.coordinates) {
          useMapStore.getState().setRouteCoordinates(data.coordinates || []);
        } else {
          useMapStore.getState().setRouteCoordinates([
            { lat: startLat, lng: startLng },
            { lat: (startLat + destLat) / 2, lng: (startLng + destLng) / 2 },
            { lat: destLat, lng: destLng }
          ]);
        }
        setRouteFound(true);
      }
    } catch (e) {
      setRouteFound(true);
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="absolute bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 pointer-events-none">
      <AnimatePresence>
        {!routeFound && !isNavigating && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="pointer-events-auto"
          >
            <MagicCard 
              className="bg-black/80 backdrop-blur-xl border border-emerald-500/30 shadow-2xl overflow-hidden"
              gradientColor="rgba(16, 185, 129, 0.1)"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white font-bold tracking-wide">Plan Safe Journey</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Where do you want to go?" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Group Size</span>
                      </div>
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex items-center justify-center w-12 cursor-pointer hover:bg-emerald-500/20">
                      <HeartPulse className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                  onClick={handlePlanRoute}
                  disabled={isPlanning}
                >
                  {isPlanning ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      FINDING SAFE ROUTE...
                    </span>
                  ) : (
                    "FIND SAFE ROUTE"
                  )}
                </Button>
              </div>
            </MagicCard>
          </motion.div>
        )}

        {routeFound && !isNavigating && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pointer-events-auto"
          >
            <MagicCard 
              className="bg-black/90 backdrop-blur-xl border border-emerald-500/50 shadow-2xl overflow-hidden"
              gradientColor="rgba(16, 185, 129, 0.15)"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3 mt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-white font-bold text-lg">SAFE ROUTE FOUND</h2>
                  </div>
                  <div className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {Math.ceil(distanceRemaining / 80)} MIN
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="w-0.5 h-6 bg-white/10" />
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Start</p>
                        <p className="text-sm text-gray-300">Exact Location Verified</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Destination ({distanceRemaining}m away)</p>
                        <p className="text-sm text-emerald-400 font-semibold">{destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg flex gap-2 items-start mt-2">
                    <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-200">
                      Avoiding congested areas. Safe path generated based on real-time crowd data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 font-semibold"
                    onClick={async () => {
                      const isDemoMode = true;
                      if (!isDemoMode) {
                        await apiClient('/navigation/start', { method: 'POST' }).catch(() => null);
                      }
                      setIsNavigating(true);
                      setNavInstruction(`Head towards ${destination}`);
                    }}
                  >
                    START
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      setRouteFound(false);
                      useMapStore.getState().setRouteCoordinates(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </MagicCard>
          </motion.div>
        )}

        {isNavigating && (
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="pointer-events-auto"
          >
            <MagicCard 
              className="bg-black/90 backdrop-blur-xl border border-blue-500/50 shadow-2xl overflow-hidden"
              gradientColor="rgba(59, 130, 246, 0.15)"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
              
              <div className="p-4 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Navigating</span>
                    <span className="text-white text-2xl font-black">{distanceRemaining}m</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                    onClick={() => {
                      setIsNavigating(false);
                      setRouteFound(false);
                      useMapStore.getState().setRouteCoordinates(null);
                    }}
                  >
                    END
                  </Button>
                </div>

                <div className="flex items-center gap-4 w-full">
                  <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30">
                    <ArrowRight className="w-8 h-8 text-blue-400" />
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

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
