import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('@/components/map/GoogleEventMap', () => ({
  GoogleEventMap: () => <div data-testid="google-event-map" />,
}));
jest.mock('@/components/dashboard/police/TaskCard', () => ({
  TaskCard: () => <div data-testid="task-card" />,
}));
jest.mock('@/shared/hooks/useWebSocket', () => ({
  useWebSocket: () => ({ subscribe: jest.fn(() => jest.fn()) }),
}));
jest.mock('@/shared/hooks/useGpsTelemetry', () => ({
  useGpsTelemetry: () => ({ isSharingLocation: false }),
}));
jest.mock('@/stores/map-store', () => ({
  useMapStore: () => ({
    addTask: jest.fn(),
  }),
}));

import PoliceDashboard from '../src/app/(dashboard)/police/page';

describe('Police Dashboard', () => {
  it('renders map and task card', () => {
    render(<PoliceDashboard />);
    expect(screen.getByTestId('google-event-map')).toBeInTheDocument();
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });

  it('shows status bar with PATROL text', () => {
    render(<PoliceDashboard />);
    expect(screen.getByText('PATROL')).toBeInTheDocument();
  });
});
