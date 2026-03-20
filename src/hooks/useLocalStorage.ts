import { useState, useEffect, useCallback } from 'react';

// Global user ID prefix, set by AuthContext when user signs in
let _userPrefix = '';

export function setStorageUserPrefix(uid: string) {
  _userPrefix = uid;
}

export function getStorageUserPrefix() {
  return _userPrefix;
}

function getScopedKey(key: string): string {
  return _userPrefix ? `${_userPrefix}:${key}` : key;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const scopedKey = getScopedKey(key);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(scopedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(scopedKey, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [scopedKey, storedValue]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
  }, []);

  return [storedValue, setValue] as const;
}
