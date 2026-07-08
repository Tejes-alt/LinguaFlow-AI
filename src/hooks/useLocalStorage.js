import { useEffect, useState } from 'react';

/**
 * Behaves like useState, but persists the value to localStorage under `key`
 * and rehydrates it on mount. Safe to use for primitives, arrays, and
 * plain objects (anything JSON-serializable).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota / availability errors — this is a non-critical persist.
    }
  }, [key, value]);

  return [value, setValue];
}
