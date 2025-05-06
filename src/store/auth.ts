import { create } from 'zustand';

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
};

export const useAuth = create<AuthState>((set) => ({
  token: null,
  setToken: (token: string) => set({ token }),
}));

