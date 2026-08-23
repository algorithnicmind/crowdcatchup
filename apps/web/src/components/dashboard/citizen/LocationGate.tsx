'use client';

import React, { useEffect, useState } from 'react';
import { useMapStore } from '@/stores/map-store';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { citizenLocation, setCitizenLocation } = useMapStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSkipped, setIsSkipped] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const requestLocation = React.useCallback(() => {
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
        setCountdown(null);
        toast.success('Location acquired successfully!');
      },
      (err) => {
        console.warn('Location error:', err);
        toast.warning('GPS failed. Using default event location for demo.');
        setCitizenLocation({
          lat: 20.4789,
          lng: 85.8741,
        });
        setIsLoading(false);
        setCountdown(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [setCitizenLocation]);

  // Auto-request GPS on mount
  useEffect(() => {
    requestLocation();
    // Start countdown to auto-skip after 12 seconds
    let count = 12;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsSkipped(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (citizenLocation || isSkipped) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        
        <button 
          onClick={() => setIsSkipped(true)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
          {isLoading && (
            <span className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          )}
          <MapPin className={`w-9 h-9 ${isLoading ? 'text-emerald-400 animate-pulse' : 'text-emerald-500'}`} />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          {isLoading ? 'Finding Your Location…' : 'Enable Location'}
        </h2>
        <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
          {isLoading
            ? 'Allow location access in the browser prompt to get started.'
            : 'CrowdShield needs your location for safe routing and emergency alerts.'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2 mb-4 text-sm text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={requestLocation} 
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold tracking-wide"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Share My Location'}
          </Button>
          <Button
            onClick={() => setIsSkipped(true)}
            variant="ghost"
            className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800 h-10 text-sm"
          >
            {countdown !== null && countdown > 0
              ? `Skip (auto in ${countdown}s)`
              : 'Continue without location'}
          </Button>
        </div>
      </div>
    </div>
  );
}

