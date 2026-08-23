import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('@/components/map/GoogleEventMap', () => ({
  GoogleEventMap: () => <div data-testid="google-event-map" />,
}));
jest.mock('@/components/dashboard/owner/OwnerPropertiesPanel', () => ({
  OwnerPropertiesPanel: () => <div data-testid="owner-properties-panel" />,
}));
jest.mock('@/components/dashboard/owner/SimulationDock', () => ({
  SimulationDock: () => <div data-testid="simulation-dock" />,
}));
jest.mock('@/shared/hooks/useGpsTelemetry', () => ({
  useGpsTelemetry: () => ({}),
}));

import OwnerDashboard from '../src/app/(dashboard)/owner/page';

describe('Owner Dashboard', () => {
  it('renders map, properties panel, and simulation dock', () => {
    render(<OwnerDashboard />);
    expect(screen.getByTestId('google-event-map')).toBeInTheDocument();
    expect(screen.getByTestId('owner-properties-panel')).toBeInTheDocument();
    expect(screen.getByTestId('simulation-dock')).toBeInTheDocument();
  });
});
