import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { LocationGate } from '@/components/dashboard/citizen/LocationGate';

export default function LayoutGuard({ children }: { children: React.ReactNode }) {
  // Authentication is now strictly handled by middleware.ts (auth_token cookie).
  // Zustand state manages client side session state.
  return (
    <LocationGate>
      {children}
    </LocationGate>
  );
}
