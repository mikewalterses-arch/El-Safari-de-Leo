import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'leo' | 'papa';

interface UserTypeState {
  userType: UserType | null;
  setUserType: (t: UserType) => void;
  clear: () => void;
}

export const useUserTypeStore = create<UserTypeState>()(
  persist(
    (set) => ({
      userType: null,
      setUserType: (t) => set({ userType: t }),
      clear: () => set({ userType: null }),
    }),
    { name: 'safarideleo:userType' },
  ),
);
