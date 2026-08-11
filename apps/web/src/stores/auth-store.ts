import { create } from 'zustand';

export type UserRole = 'AUTHORITY' | 'POLICE' | 'CITIZEN' | 'EVENT_OWNER';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: (token, user) => set({ token, user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ token: null, user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
