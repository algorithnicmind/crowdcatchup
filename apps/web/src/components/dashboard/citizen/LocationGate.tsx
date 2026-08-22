'use client';

import React, { useEffect, useState } from 'react';
import { useMapStore } from '@/stores/map-store';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { citizenLocation, setCitizenLocation } = useMapStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const requestLocation = () => {
    setIsLoading(true);
    setError('');

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCitizenLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
        toast.success('Location acquired successfully!');
      },
      (err) => {
        setError(err.message || 'Failed to acquire location. Please enable location permissions.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (citizenLocation) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Location Required</h2>
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          For your safety and to navigate the event effectively, CrowdShield requires your exact location. Without this, we cannot provide emergency routing or distance estimates.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2 mb-6 text-sm text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <Button 
          onClick={requestLocation} 
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold tracking-wide"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Share Location'}
        </Button>
      </div>
    </div>
  );
}
