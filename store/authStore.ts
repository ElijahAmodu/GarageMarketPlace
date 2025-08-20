import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: true,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // I simulated an API for future updates
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const user: User = {
        id: "1",
        name: "John Doe",
        email: email,
        createdAt: new Date().toISOString(),
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      // same as here I simulated an API for future updates
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: Math.random().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  initialize: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
}));
