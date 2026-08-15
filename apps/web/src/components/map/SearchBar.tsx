'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Search, MapPin } from 'lucide-react';

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
      setResults([]);
      setIsOpen(false);
      return;
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
    <div className="absolute top-4 md:top-6 left-4 md:left-6 z-50 w-[calc(100vw-140px)] md:w-80 pointer-events-auto" ref={wrapperRef}>
      <div className="flex items-center bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full px-4 py-3 shadow-lg shadow-black/50 transition-all focus-within:ring-2 focus-within:ring-blue-500">
        <Search className={`h-5 w-5 mr-3 ${isLoading ? 'text-blue-500 animate-pulse' : 'text-zinc-400'}`} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          placeholder="Search venue, gates, zones..."
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-500"
        />
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
