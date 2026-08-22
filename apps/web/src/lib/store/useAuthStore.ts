import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: "AUTHORITY" | "POLICE" | "CITIZEN" | "EVENT_OWNER";
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false, // Will be properly set after initial /me check
  isLoading: true,
  
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
  
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
