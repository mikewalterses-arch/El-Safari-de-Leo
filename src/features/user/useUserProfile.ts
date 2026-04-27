import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/features/auth/useAuth';
import type { User } from '@/types/models';

interface UpdateProfileChanges {
  displayName?: string;
  birthDate?: Date;
  avatarColor?: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setProfile(snap.data() as User);
        setLoading(false);
      },
      (err) => {
        console.error('useUserProfile failed', err);
        setLoading(false);
      },
    );
  }, [user]);

  const update = async (changes: UpdateProfileChanges) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, {
      ...(changes.displayName !== undefined && { displayName: changes.displayName }),
      ...(changes.birthDate !== undefined && {
        birthDate: Timestamp.fromDate(changes.birthDate),
      }),
      ...(changes.avatarColor !== undefined && { avatarColor: changes.avatarColor }),
    });
  };

  return { profile, loading, update };
}
