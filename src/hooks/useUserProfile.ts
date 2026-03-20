import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('wini-user', null);

  const createProfile = useCallback((name: string) => {
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    return newProfile;
  }, [setProfile]);

  const updateName = useCallback((name: string) => {
    setProfile(prev => prev ? { ...prev, name } : null);
  }, [setProfile]);

  return {
    profile,
    hasProfile: !!profile,
    createProfile,
    updateName,
  };
}
