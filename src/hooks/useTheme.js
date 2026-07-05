import { useState, useEffect, useCallback } from 'react';

/**
 * Theme hook with localStorage persistence.
 * Manages dark/light theme state and applies it to the document.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('logiflow-theme');
      return stored === 'light' ? 'light' : 'dark'; // Default to dark
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('logiflow-theme', theme);
    } catch {
      // localStorage not available — theme still works, just won't persist
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
