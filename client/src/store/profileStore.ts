import { create } from "zustand";

interface UserProfile {
  username?: string;
  profilePhoto?: string;
  phone?: string;
  email?: string;
  status?: string;
  role?: string;
  bio?: string;
}

interface ProfileStore {
  profileUser: UserProfile | null;
  setProfileUser: (user: UserProfile) => void;
  clearProfileUser: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profileUser: null,
  setProfileUser: (user) => set({ profileUser: user }),
  clearProfileUser: () => set({ profileUser: null }),
}));
