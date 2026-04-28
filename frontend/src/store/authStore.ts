import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserProfile {
  id: number;
  userId: number;
  nama: string;
  lokasi?: string;
  pendidikanTerakhir?: string;
  waktuBelajarJam?: number;
  levelKemampuan?: string;
  targetCareerId?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setProfile: (profile: UserProfile | null) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  checkOnboarding: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setProfile: (profile) => set({ profile }),
      logout: () => {
        set({ user: null, profile: null, token: null, isAuthenticated: false });
        window.location.href = '/';
      },
      checkOnboarding: async () => {
        try {
          // get user profile based on ID
          const { data } = await api.get('/user-profiles');
          // API returns { profiles: [...] }
          if (data?.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
            set({ profile: data.profiles[0] });
            return true; // Already onboarded
          }
          set({ profile: null });
          return false; // Not onboarded
        } catch (error) {
          set({ profile: null });
          return false;
        }
      },
      fetchProfile: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data });
          await get().checkOnboarding();
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
