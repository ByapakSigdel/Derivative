"use client";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  email?: string;
  setAuthenticated: (email?: string) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  email: undefined,
  setAuthenticated(email) {
    set({ isAuthenticated: true, email });
  },
  reset() {
    set({ isAuthenticated: false, email: undefined });
  },
}));
