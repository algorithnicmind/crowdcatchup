import { create } from 'zustand';

export type UserRole = 'AUTHORITY' | 'POLICE' | 'CITIZEN' | 'EVENT_OWNER';

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'AUTHORITY', // Default to Authority for the demo
  setRole: (role) => set({ role }),
}));
