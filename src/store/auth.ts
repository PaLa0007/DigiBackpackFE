import { create } from 'zustand';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;

  schoolId?: number; 
  school?: {
    id: number;
  };
};


type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));


