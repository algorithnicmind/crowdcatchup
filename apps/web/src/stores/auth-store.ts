import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export type UserRole = 'AUTHORITY' | 'POLICE' | 'CITIZEN' | 'EVENT_OWNER';

interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  role: UserRole | null;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, role: UserRole, token: string) => void;
  setRole: (role: UserRole) => void;
  updateProfile: (name: string, phone: string, avatar?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, role, token) => {
        Cookies.set('auth_token', token, { expires: 7 }); // Set cookie for middleware
        set({ user, role, token, isAuthenticated: true });
      },
      setRole: (role) => set({ role }),
      updateProfile: (name, phone, avatar) => set((state) => ({
        user: state.user ? { ...state.user, name, phone, ...(avatar !== undefined ? { avatar } : {}) } : null
      })),
      logout: () => {
        Cookies.remove('auth_token');
        set({ user: null, role: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'crowdshield-auth-storage',
    }
  )
);
