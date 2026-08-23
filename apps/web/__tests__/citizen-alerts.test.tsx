import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('@/stores/map-store', () => ({
  useMapStore: (selector: any) => selector({
    activeRecommendations: [],
  }),
}));

import CitizenAlertsPage from '../src/app/(dashboard)/citizen/alerts/page';

describe('Citizen Alerts Page', () => {
  it('renders the safety alerts heading', () => {
    render(<CitizenAlertsPage />);
    expect(screen.getByText('Safety Alerts')).toBeInTheDocument();
  });

  it('shows the default safe route alert', () => {
    render(<CitizenAlertsPage />);
    expect(screen.getByText('Safe Route Updated')).toBeInTheDocument();
  });

  it('shows the event announcement', () => {
    render(<CitizenAlertsPage />);
    expect(screen.getByText('Event Announcement')).toBeInTheDocument();
  });
});
