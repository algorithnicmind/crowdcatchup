/**
 * CrowdShield AI - Venue Topology Presets for Digital Twin Simulation
 * Defines gate coordinates, barrier geometry, spawn zones, and emergency exit routes.
 */

export const VENUE_PRESETS = {
    kumbh: {
        id: "kumbh",
        name: "Maha Kumbh Mela - Ghat Sector 4",
        description: "High-density pilgrimage gathering near sacred river ghats with converging walking paths.",
        defaultCrowdCount: 1200,
        backgroundColor: "#080c18",
        riverZone: { x: 0, y: 390, width: 760, height: 90, name: "Holy Sangam Ghat Waters" },
        gates: [
            { id: "gate1", name: "Gate 1 (North Entry)", x: 60, y: 20, width: 90, height: 25, isOpen: true, type: "entry" },
            { id: "gate2", name: "Gate 2 (Central Corridor)", x: 320, y: 20, width: 80, height: 25, isOpen: true, type: "bidirectional", canBottleneck: true },
            { id: "gate3", name: "Gate 3 (East Approach)", x: 580, y: 20, width: 90, height: 25, isOpen: true, type: "entry" },
            { id: "gate4", name: "Gate 4 (West Emergency Ramp)", x: 20, y: 240, width: 25, height: 100, isOpen: false, type: "emergency_exit" },
            { id: "gate5", name: "Gate 5 (East Dispersal Exit)", x: 715, y: 240, width: 25, height: 100, isOpen: true, type: "exit" }
        ],
        barriers: [
            // Central crowd guiding barricades
            { x: 180, y: 120, width: 30, height: 140, type: "steel_barricade" },
            { x: 540, y: 120, width: 30, height: 140, type: "steel_barricade" },
            { x: 340, y: 240, width: 80, height: 20, type: "temporary_fence" }
        ],
        securityOutposts: [
            { id: "raf_1", label: "RAF Unit Alpha", x: 230, y: 70, personnel: 25 },
            { id: "raf_2", label: "Police Post Beta", x: 490, y: 70, personnel: 30 },
            { id: "raf_3", label: "Ghat Rescue Squad", x: 360, y: 350, personnel: 20 }
        ],
        targetZones: [
            { x: 380, y: 320, weight: 1.0, label: "Sacred Dip Sector" },
            { x: 150, y: 310, weight: 0.6, label: "West Ghat Tier" },
            { x: 610, y: 310, weight: 0.6, label: "East Ghat Tier" }
        ]
    },

    stadium: {
        id: "stadium",
        name: "Metro City Sports & Cricket Stadium",
        description: "Enclosed sports arena concourse during post-match exiting and high street fan convergence.",
        defaultCrowdCount: 1400,
        backgroundColor: "#0a101d",
        fieldZone: { x: 180, y: 320, width: 400, height: 150, name: "Stadium Playfield Area" },
        gates: [
            { id: "gate1", name: "North Grand concourse (Gate A)", x: 280, y: 15, width: 200, height: 30, isOpen: true, type: "bidirectional" },
            { id: "gate2", name: "East Turnstile Tunnel (Gate B)", x: 690, y: 120, width: 40, height: 90, isOpen: true, type: "exit", canBottleneck: true },
            { id: "gate3", name: "West Turnstile Tunnel (Gate C)", x: 30, y: 120, width: 40, height: 90, isOpen: true, type: "exit" },
            { id: "gate4", name: "South VIP Service Exit", x: 300, y: 440, width: 160, height: 25, isOpen: false, type: "emergency_exit" }
        ],
        barriers: [
            // Structural pillars and concession stands
            { x: 150, y: 140, width: 60, height: 60, type: "concrete_pillar" },
            { x: 550, y: 140, width: 60, height: 60, type: "concrete_pillar" },
            { x: 350, y: 160, width: 60, height: 40, type: "kiosk" }
        ],
        securityOutposts: [
            { id: "stewards_north", label: "Steward Post North", x: 240, y: 60, personnel: 15 },
            { id: "police_east", label: "Crowd Squad East", x: 610, y: 80, personnel: 20 }
        ],
        targetZones: [
            { x: 380, y: 70, weight: 1.2, label: "Main Exit Concourse" },
            { x: 80, y: 160, weight: 0.8, label: "West Metro Station Walk" }
        ]
    },

    concert: {
        id: "concert",
        name: "Musical Festival Open Amphitheatre",
        description: "Massive outdoor music festival amphitheatre with stage rush risks and acoustic speaker towers.",
        defaultCrowdCount: 1100,
        backgroundColor: "#0d0b1a",
        stageZone: { x: 180, y: 15, width: 400, height: 75, name: "🌟 Main Headline Stage & VIP Pit" },
        gates: [
            { id: "gate1", name: "Main Ticket Scan Portal", x: 300, y: 430, width: 160, height: 30, isOpen: true, type: "entry" },
            { id: "gate2", name: "Left Stage Barrier Access", x: 60, y: 100, width: 50, height: 80, isOpen: true, type: "bidirectional", canBottleneck: true },
            { id: "gate3", name: "Right Food Plaza Entrance", x: 650, y: 100, width: 50, height: 80, isOpen: true, type: "entry" },
            { id: "gate4", name: "Perimeter Emergency Gate 4", x: 20, y: 280, width: 30, height: 100, isOpen: false, type: "emergency_exit" }
        ],
        barriers: [
            // Speaker towers and VIP barrier fence
            { x: 240, y: 120, width: 280, height: 15, type: "steel_barricade" },
            { x: 120, y: 240, width: 50, height: 50, type: "speaker_tower" },
            { x: 590, y: 240, width: 50, height: 50, type: "speaker_tower" }
        ],
        securityOutposts: [
            { id: "sec_stage", label: "Bouncer Detail & Stage Sec", x: 360, y: 95, personnel: 35 },
            { id: "sec_medical", label: "First Aid & EMS Team", x: 110, y: 370, personnel: 15 }
        ],
        targetZones: [
            { x: 380, y: 150, weight: 1.5, label: "Front Stage Pit" },
            { x: 380, y: 290, weight: 0.8, label: "Mid Lawn Section" }
        ]
    }
};

/**
 * Helper to fetch preset config by key
 */
export function getVenuePreset(presetId = "kumbh") {
    // Clone object so live modifications don't alter base defaults permanently
    return JSON.parse(JSON.stringify(VENUE_PRESETS[presetId] || VENUE_PRESETS.kumbh));
}
