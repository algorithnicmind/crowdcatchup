import { VenuePreset } from '../../types/models';

export const VENUE_PRESETS: Record<string, VenuePreset> = {
  kumbh: {
    id: 'kumbh',
    name: 'Kumbh Ghat Sector 4 (Ganges Corridor)',
    description: 'High-density riverbank gathering area with narrow ghat staircases and pontoon bridge exits.',
    defaultCrowdCount: 1400,
    gates: [
      { id: 'g1', name: 'Gate 1 (Main Entrance)', x: 50, y: 220, width: 25, height: 70, isOpen: true, type: 'entrance', canBottleneck: false },
      { id: 'g2', name: 'Gate 2 (Nigam Ghat Exit)', x: 450, y: 460, width: 70, height: 25, isOpen: true, type: 'exit', canBottleneck: true },
      { id: 'g3', name: 'Gate 3 (Pontoon Bridge 1)', x: 700, y: 150, width: 25, height: 70, isOpen: true, type: 'exit', canBottleneck: true },
      { id: 'g4', name: 'Gate 4 (Emergency Bypass)', x: 600, y: 460, width: 70, height: 25, isOpen: false, type: 'emergency', canBottleneck: false }
    ],
    barriers: [
      { id: 'b1', x: 200, y: 120, width: 320, height: 35, type: 'wall' }, // Sacred Bathing Ramp Boundary
      { id: 'b2', x: 200, y: 320, width: 180, height: 35, type: 'water' }, // River Embankment Barricade
      { id: 'b3', x: 500, y: 280, width: 120, height: 35, type: 'vip' }   // VIP Akhada Enclosure
    ],
    securityOutposts: [
      { id: 'sp1', label: 'Post Alpha (Command Tower)', x: 100, y: 80, personnel: 15 },
      { id: 'sp2', label: 'Post Bravo (River Patrol)', x: 400, y: 400, personnel: 20 }
    ]
  },
  stadium: {
    id: 'stadium',
    name: 'Metro Sports Stadium (Finals Gateways)',
    description: 'Enclosed multi-tier stadium precinct with concourse choke points and turnstile barriers.',
    defaultCrowdCount: 1250,
    gates: [
      { id: 'g1', name: 'Gate A (North Turnstiles)', x: 340, y: 40, width: 80, height: 25, isOpen: true, type: 'entrance', canBottleneck: true },
      { id: 'g2', name: 'Gate B (East Ramp Exit)', x: 700, y: 220, width: 25, height: 80, isOpen: true, type: 'exit', canBottleneck: true },
      { id: 'g3', name: 'Gate C (South Plaza)', x: 340, y: 440, width: 80, height: 25, isOpen: true, type: 'exit', canBottleneck: false },
      { id: 'g4', name: 'Gate D (Emergency Tunnel)', x: 50, y: 220, width: 25, height: 80, isOpen: false, type: 'emergency', canBottleneck: false }
    ],
    barriers: [
      { id: 'b1', x: 180, y: 150, width: 400, height: 200, type: 'stage' }, // Central Field Pitch
      { id: 'b2', x: 100, y: 350, width: 70, height: 70, type: 'wall' }
    ],
    securityOutposts: [
      { id: 'sp1', label: 'Security Control 1', x: 80, y: 60, personnel: 12 },
      { id: 'sp2', label: 'Rapid Action Base', x: 650, y: 400, personnel: 25 }
    ]
  },
  amphitheatre: {
    id: 'amphitheatre',
    name: 'Open Amphitheatre Arena (Music Festival)',
    description: 'Open air festival venue with main stage crowd compression and perimeter entry gates.',
    defaultCrowdCount: 1100,
    gates: [
      { id: 'g1', name: 'Main Gate East', x: 50, y: 150, width: 25, height: 80, isOpen: true, type: 'entrance', canBottleneck: false },
      { id: 'g2', name: 'Exit Corridor 1', x: 700, y: 350, width: 25, height: 80, isOpen: true, type: 'exit', canBottleneck: true },
      { id: 'g3', name: 'Emergency Gate 4', x: 400, y: 460, width: 80, height: 25, isOpen: false, type: 'emergency', canBottleneck: false }
    ],
    barriers: [
      { id: 'b1', x: 250, y: 40, width: 260, height: 100, type: 'stage' }, // Main Performance Stage
      { id: 'b2', x: 100, y: 380, width: 200, height: 25, type: 'fence' }
    ],
    securityOutposts: [
      { id: 'sp1', label: 'Medical Tent 1', x: 80, y: 400, personnel: 10 },
      { id: 'sp2', label: 'Stage Safety Outpost', x: 550, y: 80, personnel: 18 }
    ]
  }
};
