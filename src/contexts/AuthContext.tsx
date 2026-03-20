import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { setStorageUserPrefix } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Migrate anonymous localStorage data to user-scoped keys
function migrateLocalStorage(uid: string) {
  const keys = [
    'wini-habits', 'wini-journal', 'wini-mood', 'wini-dopamine',
    'wini-routines', 'wini-user', 'wini-feedback', 'wini-urge-log',
    'wini-innerspace', 'wini-reinforcement',
  ];
  for (const key of keys) {
    const existing = localStorage.getItem(key);
    const userKey = `${uid}:${key}`;
    if (existing && !localStorage.getItem(userKey)) {
      localStorage.setItem(userKey, existing);
      localStorage.removeItem(key);
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result on load
    getRedirectResult(auth).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        migrateLocalStorage(firebaseUser.uid);
        setStorageUserPrefix(firebaseUser.uid);
      } else {
        setStorageUserPrefix('');
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: unknown) {
      const error = e as { code?: string };
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        await signInWithRedirect(auth, googleProvider);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
