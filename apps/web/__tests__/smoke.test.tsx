import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock components to test isolated logic
jest.mock('@/components/map/GoogleEventMap', () => {
  return { GoogleEventMap: () => <div data-testid="google-event-map" /> };
});
jest.mock('@/components/dashboard/citizen/SafeRoutePanel', () => {
  return { SafeRoutePanel: () => <div data-testid="safe-route-panel" /> };
});
jest.mock('@/shared/hooks/useWebSocket', () => ({
  useWebSocket: () => ({ subscribe: jest.fn(() => jest.fn()) }),
}));

// We can smoke test if the CitizenDashboard renders without crashing
import CitizenDashboard from '../src/app/(dashboard)/citizen/page';

describe('Citizen Dashboard Smoke Test', () => {
  it('renders the map and safe route panel', () => {
    render(<CitizenDashboard />);
    expect(screen.getByTestId('google-event-map')).toBeInTheDocument();
    expect(screen.getByTestId('safe-route-panel')).toBeInTheDocument();
  });
});
