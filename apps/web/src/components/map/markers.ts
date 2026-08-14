import L from 'leaflet';

/**
 * Creates a beautiful glassmorphism-styled Leaflet divIcon.
 * Uses Tailwind classes injected into the HTML to match the CrowdShield aesthetic.
 */
export const createGlassMarker = ({
  icon,
  colorClass,
  pulse = false,
}: {
  icon: string;
  colorClass: string;
  pulse?: boolean;
}) => {
  const pulseHtml = pulse
    ? `<span class="absolute flex h-full w-full left-0 top-0">
         <span class="animate-ping absolute inline-flex h-full w-full rounded-xl opacity-75 ${colorClass}"></span>
       </span>`
    : '';

  return L.divIcon({
    className: 'bg-transparent border-0', // Leaflet container override
    html: `
      <div class="relative glass-marker w-10 h-10 rounded-xl flex items-center justify-center 
                  backdrop-blur-md bg-zinc-900/40 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                  ${colorClass} transition-all duration-300 hover:scale-110">
        ${pulseHtml}
        <div class="relative z-10 text-white flex items-center justify-center">
          ${icon}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// --- PREDEFINED MARKERS ---

const svgIconMedical = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>`;
export const MedicalMarker = createGlassMarker({
  icon: svgIconMedical,
  colorClass: 'shadow-pink-500/50 bg-pink-500/20',
});

const svgIconPolice = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
export const PoliceMarker = createGlassMarker({
  icon: svgIconPolice,
  colorClass: 'shadow-blue-500/50 bg-blue-500/20',
});

// Gate status marker generator
const svgIconGate = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`;
export const getSmartGateMarker = (status: 'NORMAL' | 'HIGH_FLOW' | 'CONGESTED' | 'CRITICAL') => {
  let color = 'shadow-emerald-500/50 bg-emerald-500/20'; // NORMAL
  let pulse = false;

  if (status === 'HIGH_FLOW') {
    color = 'shadow-amber-500/50 bg-amber-500/20';
    pulse = true;
  } else if (status === 'CONGESTED') {
    color = 'shadow-orange-500/50 bg-orange-500/20 text-orange-400';
  } else if (status === 'CRITICAL') {
    color = 'shadow-red-500/50 bg-red-500/20 text-red-500';
    pulse = true;
  }

  return createGlassMarker({ icon: svgIconGate, colorClass: color, pulse });
};
