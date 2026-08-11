import { create } from 'zustand';
import { VenuePreset, Gate, TelemetryFrame, RiskAssessment, SosIncident, Intervention } from '../types/models';
import { VENUE_PRESETS } from '../shared/lib/venue-presets';

interface CrowdStoreState {
  selectedVenueId: string;
  venue: VenuePreset;
  gates: Gate[];
  telemetry: TelemetryFrame;
  riskAssessment: RiskAssessment;
  sosIncidents: SosIncident[];
  interventions: Intervention[];
  rafPersonnelAdded: number;

  // Actions
  selectVenue: (venueId: string) => void;
  toggleGate: (gateId: string) => void;
  updateTelemetry: (data: Partial<TelemetryFrame>) => void;
  updateRiskAssessment: (assessment: RiskAssessment) => void;
  addSosIncident: (sos: Omit<SosIncident, 'id' | 'timestamp' | 'status'>) => void;
  resolveSosIncident: (id: string) => void;
  executeIntervention: (id: string) => void;
  deployRafPersonnel: (count: number) => void;
}

const DEFAULT_VENUE_ID = 'kumbh';
const initialVenue = VENUE_PRESETS[DEFAULT_VENUE_ID];

const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-1',
    title: 'Open Emergency Gate 4',
    description: 'Diverts congestion wave away from Nigam Ghat bottleneck into Sector B.',
    type: 'gate_open',
    targetGateId: 'g4',
    executed: false,
  },
  {
    id: 'int-2',
    title: 'Deploy Rapid Action Force (+40 Units)',
    description: 'Deploys riot control & crowd management personnel to clear choke point.',
    type: 'deploy_raf',
    personnelCount: 40,
    executed: false,
  },
  {
    id: 'int-3',
    title: 'Activate One-Way Flow Corridor',
    description: 'Restricts bi-directional foot traffic to prevent counter-flow collisions.',
    type: 'reroute_flow',
    executed: false,
  }
];

export const useCrowdStore = create<CrowdStoreState>((set) => ({
  selectedVenueId: DEFAULT_VENUE_ID,
  venue: initialVenue,
  gates: initialVenue.gates,
  telemetry: {
    timestamp: Date.now(),
    eventId: 'evt-kumbh-2026',
    venueId: DEFAULT_VENUE_ID,
    totalCrowdCount: initialVenue.defaultCrowdCount,
    avgDensity: 1.8,
    maxDensity: 3.2,
    avgVelocity: 1.1,
    stuckParticleCount: 12,
    riskLevel: 'NORMAL',
  },
  riskAssessment: {
    riskLevel: 'NORMAL',
    score: 28,
    compressionHazard: false,
    bottleneckGateIds: ['g2'],
    summaryText: 'Crowd density normal. Flow proceeding along designated pathways.',
  },
  sosIncidents: [
    {
      id: 'sos-101',
      category: 'stampede_risk',
      x: 440,
      y: 430,
      locationName: 'Nigam Ghat Stairwell Bottleneck',
      timestamp: Date.now() - 120000,
      status: 'active',
      reporterMobile: '+91 9876543210',
    }
  ],
  interventions: INITIAL_INTERVENTIONS,
  rafPersonnelAdded: 0,

  selectVenue: (venueId: string) => {
    const selected = VENUE_PRESETS[venueId] || VENUE_PRESETS[DEFAULT_VENUE_ID];
    set({
      selectedVenueId: venueId,
      venue: selected,
      gates: selected.gates,
      telemetry: {
        timestamp: Date.now(),
        eventId: `evt-${venueId}-2026`,
        venueId: venueId,
        totalCrowdCount: selected.defaultCrowdCount,
        avgDensity: 1.8,
        maxDensity: 3.2,
        avgVelocity: 1.1,
        stuckParticleCount: 10,
        riskLevel: 'NORMAL',
      },
      interventions: INITIAL_INTERVENTIONS.map((int) => ({ ...int, executed: false })),
      rafPersonnelAdded: 0,
    });
  },

  toggleGate: (gateId: string) => {
    set((state) => ({
      gates: state.gates.map((g) =>
        g.id === gateId ? { ...g, isOpen: !g.isOpen } : g
      ),
    }));
  },

  updateTelemetry: (data: Partial<TelemetryFrame>) => {
    set((state) => ({
      telemetry: { ...state.telemetry, ...data, timestamp: Date.now() },
    }));
  },

  updateRiskAssessment: (assessment: RiskAssessment) => {
    set({ riskAssessment: assessment });
  },

  addSosIncident: (sosData) => {
    const newSos: SosIncident = {
      ...sosData,
      id: `sos-${Date.now()}`,
      timestamp: Date.now(),
      status: 'active',
    };
    set((state) => ({
      sosIncidents: [newSos, ...state.sosIncidents],
    }));
  },

  resolveSosIncident: (id: string) => {
    set((state) => ({
      sosIncidents: state.sosIncidents.map((s) =>
        s.id === id ? { ...s, status: 'resolved' } : s
      ),
    }));
  },

  executeIntervention: (id: string) => {
    set((state) => {
      const targetInt = state.interventions.find((i) => i.id === id);
      let updatedGates = state.gates;
      let addedRaf = state.rafPersonnelAdded;

      if (targetInt?.type === 'gate_open' && targetInt.targetGateId) {
        updatedGates = state.gates.map((g) =>
          g.id === targetInt.targetGateId ? { ...g, isOpen: true } : g
        );
      }
      if (targetInt?.type === 'deploy_raf' && targetInt.personnelCount) {
        addedRaf += targetInt.personnelCount;
      }

      return {
        gates: updatedGates,
        rafPersonnelAdded: addedRaf,
        interventions: state.interventions.map((i) =>
          i.id === id ? { ...i, executed: true, timestamp: Date.now() } : i
        ),
      };
    });
  },

  deployRafPersonnel: (count: number) => {
    set((state) => ({
      rafPersonnelAdded: state.rafPersonnelAdded + count,
    }));
  },
}));
