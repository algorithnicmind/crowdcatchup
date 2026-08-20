import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from './auth-store';

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  generatedId?: string;
  createdAt: number;
}

interface UserState {
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'createdAt' | 'id'>) => UserAccount;
  getUserByGeneratedId: (generatedId: string, role: UserRole) => UserAccount | undefined;
  getUserByEmailOrPhone: (identifier: string, role: UserRole) => UserAccount | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (userData) => {
        const newUser: UserAccount = {
          ...userData,
          id: `usr_${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return newUser;
      },
      getUserByGeneratedId: (generatedId, role) => {
        return get().users.find(u => u.generatedId === generatedId && u.role === role);
      },
      getUserByEmailOrPhone: (identifier, role) => {
        return get().users.find(u => 
          u.role === role && 
          (u.email === identifier || u.phone === identifier)
        );
      }
    }),
    {
      name: 'crowdshield-users-storage',
    }
  )
);
