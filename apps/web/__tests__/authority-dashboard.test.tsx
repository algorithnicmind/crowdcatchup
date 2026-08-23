import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('@/components/map/GoogleEventMap', () => ({
  GoogleEventMap: () => <div data-testid="google-event-map" />,
}));
jest.mock('@/components/dashboard/authority/AlertsPanel', () => ({
  AlertsPanel: () => <div data-testid="alerts-panel" />,
}));
jest.mock('@/components/dashboard/authority/CctvGrid', () => ({
  CctvGrid: () => <div data-testid="cctv-grid" />,
}));
jest.mock('@/components/dashboard/authority/SourceHealthPanel', () => ({
  SourceHealthPanel: () => <div data-testid="source-health-panel" />,
}));
jest.mock('@/components/dashboard/authority/SimulatorPanel', () => ({
  SimulatorPanel: () => <div data-testid="simulator-panel" />,
}));
jest.mock('@/shared/hooks/useWebSocket', () => ({
  useWebSocket: () => ({ subscribe: jest.fn(() => jest.fn()) }),
}));
jest.mock('@/shared/hooks/useGpsTelemetry', () => ({
  useGpsTelemetry: () => ({}),
}));
jest.mock('@/stores/map-store', () => ({
  useMapStore: () => ({
    updateCrowdState: jest.fn(),
    updateRisk: jest.fn(),
    addRecommendation: jest.fn(),
    updateSourceHealth: jest.fn(),
  }),
}));

import AuthorityDashboard from '../src/app/(dashboard)/authority/page';

describe('Authority Dashboard', () => {
  it('renders map, alerts, CCTV, source health, and simulator panels', () => {
    render(<AuthorityDashboard />);
    expect(screen.getByTestId('google-event-map')).toBeInTheDocument();
    expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
    expect(screen.getByTestId('cctv-grid')).toBeInTheDocument();
    expect(screen.getByTestId('source-health-panel')).toBeInTheDocument();
    expect(screen.getByTestId('simulator-panel')).toBeInTheDocument();
  });
});
