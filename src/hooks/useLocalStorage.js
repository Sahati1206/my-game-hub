import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch a custom event so other hook instances in the same window can react
        try {
          window.dispatchEvent(new CustomEvent('local-storage', { detail: { key, value: valueToStore } }));
        } catch (e) {
          // CustomEvent may fail in some older environments; ignore
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    const handleCustom = (e) => {
      try {
        if (e?.detail && e.detail.key === key) {
          const raw = window.localStorage.getItem(key);
          setStoredValue(raw ? JSON.parse(raw) : initialValue);
        }
      } catch (err) {
        // ignore
      }
    };

    const handleStorage = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (err) {}
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('local-storage', handleCustom);
      window.addEventListener('storage', handleStorage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('local-storage', handleCustom);
        window.removeEventListener('storage', handleStorage);
      }
    };
  }, [key, initialValue]);
  return [storedValue, setValue];
};

export default useLocalStorage;