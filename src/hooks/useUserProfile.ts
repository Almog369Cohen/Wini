import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  painPoints?: string[];
  selectedQuitHabits?: string[];  // template IDs
  selectedBuildHabits?: string[]; // template IDs
  selectedGoals?: string[];       // goal template IDs
  selectedBarriers?: string[];    // barrier IDs
  motivationLevel?: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('wini-user', null);

  const createProfile = useCallback((data: {
    name: string;
    painPoints?: string[];
    quitHabits?: string[];
    buildHabits?: string[];
    goals?: string[];
    barriers?: string[];
    motivationLevel?: string;
  }) => {
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: data.name,
      createdAt: new Date().toISOString(),
      painPoints: data.painPoints,
      selectedQuitHabits: data.quitHabits,
      selectedBuildHabits: data.buildHabits,
      selectedGoals: data.goals,
      selectedBarriers: data.barriers,
      motivationLevel: data.motivationLevel,
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
