'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Search, MapPin, Navigation } from 'lucide-react';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export function SearchBar() {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      const t = setTimeout(() => {
        setResults([]);
        setIsOpen(false);
      }, 0);
      return () => clearTimeout(t);
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (result: NominatimResult) => {
    setQuery(result.display_name);
    setIsOpen(false);
    
    if (map) {
      map.panTo({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
      map.setZoom(17);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] pointer-events-auto" ref={wrapperRef}>
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow border border-zinc-200 focus-within:ring-2 focus-within:ring-[#0f8b8d]/50">
        <Search className={`h-5 w-5 ${isLoading ? 'text-blue-500 animate-pulse' : 'text-zinc-500'}`} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          placeholder="Search Google Maps"
          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-zinc-800 w-full placeholder:text-zinc-600"
        />
        <div className="flex items-center gap-2 pl-2">
          <button className="text-white bg-[#0f8b8d] hover:bg-[#0d787a] rounded-md flex items-center justify-center p-1.5 transition-colors transform rotate-45 w-7 h-7 shadow-sm shrink-0">
            <div className="-rotate-45">
              <Navigation className="h-4 w-4 fill-current" />
            </div>
          </button>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-zinc-800 border-b border-zinc-800/50 last:border-0 flex items-start gap-3 transition-colors"
            >
              <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300 line-clamp-2">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
