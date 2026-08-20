'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Car, Bike, Train, Footprints, ArrowLeft, ArrowDownUp, MapPin } from 'lucide-react';
import { useMapStore } from '@/stores/map-store';
import { useMap } from '@vis.gl/react-google-maps';

type TravelMode = 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

function NominatimInput({ 
  placeholder, 
  value, 
  onSelect 
}: { 
  placeholder: string; 
  value: NominatimResult | null; 
  onSelect: (result: NominatimResult | null) => void 
}) {
  const [query, setQuery] = useState(value ? value.display_name : '');
  const [prevValue, setPrevValue] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync state with props during render to avoid cascading updates
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value ? value.display_name : '');
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || (value && query === value.display_name)) {
      // Defer state update to avoid synchronous React warning
      const t = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(t);
    }

    const delayFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Error fetching places:', err);
      }
    }, 500);

    return () => clearTimeout(delayFn);
  }, [query, value]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onSelect(null); // clear selection if they type
        }}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[60] bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.place_id}
              onClick={() => {
                onSelect(r);
                setQuery(r.display_name);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 border-b border-zinc-800/50 last:border-0 truncate"
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function RoutingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TravelMode>('DRIVING');
  const { setRouteCoordinates } = useMapStore();
  const map = useMap();
  
  const [origin, setOrigin] = useState<NominatimResult | null>(null);
  const [destination, setDestination] = useState<NominatimResult | null>(null);

  useEffect(() => {
    const calculateRoute = async () => {
      if (!origin || !destination) {
        setRouteCoordinates(null);
        return;
      }

      // Map Google modes to OSRM profiles
      let osrmProfile = 'driving';
      if (mode === 'BICYCLING') osrmProfile = 'cycling';
      if (mode === 'WALKING' || mode === 'TRANSIT') osrmProfile = 'foot'; // OSRM doesn't have public transit out of the box

      try {
        // OSRM requires longitude,latitude
        const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Convert GeoJSON coords [lng, lat] to Google LatLngLiteral { lat, lng }
          const coords = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0]
          }));
          setRouteCoordinates(coords);

          // Fit bounds
          if (map) {
            const bounds = new google.maps.LatLngBounds();
            coords.forEach((c: { lat: number, lng: number }) => bounds.extend(c));
            map.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });
          }
        } else {
          setRouteCoordinates(null);
        }
      } catch (err) {
        console.error("OSRM Routing Error:", err);
      }
    };

    calculateRoute();
  }, [origin, destination, mode, map, setRouteCoordinates]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-20 md:top-16 right-4 md:right-auto md:left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-full shadow-lg transition-colors flex items-center gap-2 pointer-events-auto"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" /> 
        <span className="hidden md:inline">Get Directions</span>
        <span className="md:hidden">Route</span>
      </button>
    );
  }

  return (
    <div className="absolute top-16 left-6 z-50 w-80 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300 pointer-events-auto">
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => { setIsOpen(false); setRouteCoordinates(null); }} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1 space-y-2 relative">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border-2 border-zinc-500 bg-transparent flex-shrink-0" />
              <NominatimInput 
                placeholder="Choose start location"
                value={origin}
                onSelect={setOrigin}
              />
            </div>
            
            <div className="absolute left-[3px] top-4 bottom-4 w-0.5 border-l-2 border-dotted border-zinc-600" />
            
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-red-500 flex-shrink-0 -ml-[2px]" />
              <NominatimInput 
                placeholder="Choose destination"
                value={destination}
                onSelect={setDestination}
              />
            </div>
          </div>
          
          <button 
            className="text-zinc-400 hover:text-white mt-1 flex-shrink-0"
            onClick={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
          >
            <ArrowDownUp className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-between items-center px-4 mt-2">
          <button onClick={() => setMode('DRIVING')} className={`p-2 rounded-full ${mode === 'DRIVING' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <Car className="h-5 w-5" />
          </button>
          <button onClick={() => setMode('BICYCLING')} className={`p-2 rounded-full ${mode === 'BICYCLING' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <Bike className="h-5 w-5" />
          </button>
          <button onClick={() => setMode('TRANSIT')} className={`p-2 rounded-full ${mode === 'TRANSIT' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <Train className="h-5 w-5" />
          </button>
          <button onClick={() => setMode('WALKING')} className={`p-2 rounded-full ${mode === 'WALKING' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <Footprints className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
