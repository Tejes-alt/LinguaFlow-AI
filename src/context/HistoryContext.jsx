import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'linguaflow-history';
const MAX_ENTRIES = 500;

const HistoryContext = createContext(null);

function loadHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage may be full or unavailable (private browsing, quota, etc).
      // We fail silently since history is a convenience feature, not core.
    }
  }, [history]);

  const addEntry = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const deleteEntry = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const toggleFavorite = useCallback((id) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addEntry, deleteEntry, clearHistory, toggleFavorite }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within a HistoryProvider');
  return ctx;
}
