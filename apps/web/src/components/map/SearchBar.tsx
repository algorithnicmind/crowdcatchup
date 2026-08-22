'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useMapStore } from '@/stores/map-store';

export function SearchBar() {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { citizenLocation } = useMapStore();

  // Initialize Google Places services
  useEffect(() => {
    if (typeof window === 'undefined' || !window.google?.maps?.places) return;
    autocompleteService.current = new window.google.maps.places.AutocompleteService();
    // PlacesService needs a map div
    const div = document.createElement('div');
    placesService.current = new window.google.maps.places.PlacesService(div);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!value.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      if (!autocompleteService.current) return;
      setIsLoading(true);
      autocompleteService.current.getPlacePredictions(
        { input: value },
        (results, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results);
            setIsOpen(true);
          } else {
            setPredictions([]);
          }
        }
      );
    }, 300);
  };

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    setQuery(prediction.description);
    setIsOpen(false);
    setPredictions([]);

    if (!placesService.current) return;
    placesService.current.getDetails(
      { placeId: prediction.place_id, fields: ['geometry'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          map?.panTo({ lat, lng });
          map?.setZoom(17);
          useMapStore.getState().setSearchResultPin({ lat, lng });
        }
      }
    );
  };

  const handleGoToMyLocation = () => {
    if (citizenLocation && map) {
      map.panTo(citizenLocation);
      map.setZoom(18);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        useMapStore.getState().setCitizenLocation(loc);
        map?.panTo(loc);
        map?.setZoom(18);
      });
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] pointer-events-auto" ref={wrapperRef}>
      <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-zinc-200 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.22)] transition-shadow">
        {isLoading
          ? <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
          : <Search className="h-5 w-5 text-zinc-400 shrink-0" />
        }
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (predictions.length > 0) setIsOpen(true); }}
          placeholder="Search Google Maps"
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500 min-w-0"
        />
        <button
          onClick={handleGoToMyLocation}
          title="Go to my location"
          className="text-white bg-[#0f8b8d] hover:bg-[#0d787a] rounded-full flex items-center justify-center w-8 h-8 transition-colors shrink-0 shadow-sm"
        >
          <Navigation className="h-4 w-4 fill-current" />
        </button>
      </div>

      {isOpen && predictions.length > 0 && (
        <div className="mt-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
          {predictions.map((pred) => (
            <button
              key={pred.place_id}
              onClick={() => handleSelect(pred)}
              className="w-full text-left px-4 py-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 flex items-start gap-3 transition-colors"
            >
              <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-sm font-medium text-zinc-800 block truncate">{pred.structured_formatting.main_text}</span>
                <span className="text-xs text-zinc-500 block truncate">{pred.structured_formatting.secondary_text}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
