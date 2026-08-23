import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('@/components/map/GoogleEventMap', () => ({
  GoogleEventMap: () => <div data-testid="google-event-map" />,
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock('@/lib/api-client', () => ({
  apiClient: jest.fn(),
}));
jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}));

import CitizenPlannerPage from '../src/app/(dashboard)/citizen/planner/page';

describe('Citizen Planner Page', () => {
  it('renders the journey planner heading', () => {
    render(<CitizenPlannerPage />);
    expect(screen.getByText('Journey Planner')).toBeInTheDocument();
  });

  it('renders the find safe route button', () => {
    render(<CitizenPlannerPage />);
    expect(screen.getByText('FIND SAFE ROUTE')).toBeInTheDocument();
  });

  it('renders the destination input', () => {
    render(<CitizenPlannerPage />);
    expect(screen.getByDisplayValue('Maha Kumbh Mela - Main Ghat')).toBeInTheDocument();
  });

  it('renders the map', () => {
    render(<CitizenPlannerPage />);
    expect(screen.getByTestId('google-event-map')).toBeInTheDocument();
  });
});
